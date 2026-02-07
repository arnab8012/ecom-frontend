import { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartCtx = createContext(null);

const LS_KEY = "cart_v1";
const LS_BUY = "buy_now_v1"; // ✅ buy now

function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

// ✅ id normalize: productId/_id/id সব ধরবে
function getId(x) {
  return String(x?.productId || x?._id || x?.id || x?.product?._id || x?.product?.id || "");
}

// ✅ variant normalize
function getVar(x) {
  return String(x?.variant || "");
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    const data = loadJSON(LS_KEY, []);
    return Array.isArray(data) ? data : [];
  });

  const [checkoutItem, setCheckoutItem] = useState(() => loadJSON(LS_BUY, null));

  // persist cart
  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(items));
    } catch {}
  }, [items]);

  // persist buy now
  useEffect(() => {
    try {
      localStorage.setItem(LS_BUY, JSON.stringify(checkoutItem));
    } catch {}
  }, [checkoutItem]);

  const value = useMemo(
    () => ({
      items,
      checkoutItem, // ✅ single product checkout item

      // ✅ add to cart (compatible)
      add(item) {
        const pid = getId(item);
        const v = getVar(item);

        if (!pid) return;

        setItems((prev) => {
          const list = Array.isArray(prev) ? prev : [];

          const idx = list.findIndex((x) => getId(x) === pid && getVar(x) === v);

          if (idx >= 0) {
            const copy = [...list];
            copy[idx] = {
              ...copy[idx],
              qty: (Number(copy[idx].qty) || 1) + (Number(item?.qty) || 1)
            };
            return copy;
          }

          // ✅ ensure productId stored (Cart.jsx থেকে id pass করলে match হবে)
          return [
            ...list,
            {
              ...item,
              productId: item?.productId || item?._id || item?.id || pid,
              variant: v,
              qty: Number(item?.qty) || 1
            }
          ];
        });
      },

      // ✅ remove: (id) বা (productId, variant) দুইভাবেই চলবে
      remove(productId, variant = "") {
        const pid = String(productId || "");
        const v = String(variant || "");

        if (!pid) return;

        setItems((prev) => {
          const list = Array.isArray(prev) ? prev : [];

          // যদি variant দেওয়া না থাকে => id match হলেই remove
          if (!v) return list.filter((x) => getId(x) !== pid);

          // variant দেওয়া থাকলে => id + variant match
          return list.filter((x) => !(getId(x) === pid && getVar(x) === v));
        });
      },

      clear() {
        setItems([]);
      },

      // ✅ setQty: (id, qty) বা (productId, variant, qty) compatible
      setQty(productId, variantOrQty, maybeQty) {
        const pid = String(productId || "");
        if (!pid) return;

        // call pattern check
        let v = "";
        let qty = 1;

        if (typeof maybeQty === "undefined") {
          // setQty(id, qty)
          qty = Number(variantOrQty || 1);
        } else {
          // setQty(id, variant, qty)
          v = String(variantOrQty || "");
          qty = Number(maybeQty || 1);
        }

        setItems((prev) => {
          const list = Array.isArray(prev) ? prev : [];

          return list.map((x) => {
            const xid = getId(x);
            const xv = getVar(x);

            if (xid !== pid) return x;

            // যদি variant দেওয়া থাকে, match না হলে skip
            if (v && xv !== v) return x;

            return { ...x, qty: Math.max(1, qty) };
          });
        });
      },

      // ✅ inc/dec যোগ করা হলো (Cart.jsx এর সাথে match)
      inc(id) {
        const pid = String(id || "");
        if (!pid) return;

        setItems((prev) => {
          const list = Array.isArray(prev) ? prev : [];
          return list.map((x) => (getId(x) === pid ? { ...x, qty: (Number(x.qty) || 1) + 1 } : x));
        });
      },

      dec(id) {
        const pid = String(id || "");
        if (!pid) return;

        setItems((prev) => {
          const list = Array.isArray(prev) ? prev : [];

          // qty 1 হলে remove করে দিবো (better UX)
          const found = list.find((x) => getId(x) === pid);
          const q = found ? Number(found.qty) || 1 : 1;

          if (q <= 1) return list.filter((x) => getId(x) !== pid);

          return list.map((x) => (getId(x) === pid ? { ...x, qty: (Number(x.qty) || 1) - 1 } : x));
        });
      },

      // ✅ BUY NOW: single product checkout
      buyNow(p, variant = "", qty = 1) {
        const item = {
          productId: p?._id || p?.productId || p?.id || "",
          title: p?.title || p?.name || "",
          price: Number(p?.price || 0),
          image: p?.images?.[0] || p?.image || "",
          variant: String(variant || p?.variant || ""),
          qty: Number(qty || p?.qty || 1)
        };
        if (!item.productId) return;
        setCheckoutItem(item);
      },

      clearBuyNow() {
        setCheckoutItem(null);
      }
    }),
    [items, checkoutItem]
  );

  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>;
}

export function useCart() {
  return useContext(CartCtx);
}