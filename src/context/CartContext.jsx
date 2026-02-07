import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "./AuthContext";

const CartCtx = createContext(null);

// ✅ guest + per-user keys
const CART_GUEST = "cart_guest";
const BUY_GUEST = "buy_now_guest";
const CART_USER = (uid) => `cart_user_${uid}`;
const BUY_USER = (uid) => `buy_now_user_${uid}`;

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
function getVar(x) {
  return String(x?.variant || "");
}

export function CartProvider({ children }) {
  const { user } = useAuth();

  const uid = user?._id || user?.id || user?.userId || "";

  const cartKey = uid ? CART_USER(uid) : CART_GUEST;
  const buyKey = uid ? BUY_USER(uid) : BUY_GUEST;

  const [items, setItems] = useState(() => {
    const data = loadJSON(cartKey, []);
    return Array.isArray(data) ? data : [];
  });

  const [checkoutItem, setCheckoutItem] = useState(() => loadJSON(buyKey, null));

  // ✅ login/logout হলে correct key থেকে cart/buy reload
  useEffect(() => {
    const data = loadJSON(cartKey, []);
    setItems(Array.isArray(data) ? data : []);
    setCheckoutItem(loadJSON(buyKey, null));
  }, [cartKey, buyKey]);

  // ✅ persist cart
  useEffect(() => {
    try {
      localStorage.setItem(cartKey, JSON.stringify(items));
    } catch {}
  }, [cartKey, items]);

  // ✅ persist buy now
  useEffect(() => {
    try {
      localStorage.setItem(buyKey, JSON.stringify(checkoutItem));
    } catch {}
  }, [buyKey, checkoutItem]);

  const value = useMemo(
    () => ({
      items,
      checkoutItem,

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

      remove(productId, variant = "") {
        const pid = String(productId || "");
        const v = String(variant || "");
        if (!pid) return;

        setItems((prev) => {
          const list = Array.isArray(prev) ? prev : [];
          if (!v) return list.filter((x) => getId(x) !== pid);
          return list.filter((x) => !(getId(x) === pid && getVar(x) === v));
        });
      },

      clear() {
        setItems([]);
      },

      setQty(productId, variantOrQty, maybeQty) {
        const pid = String(productId || "");
        if (!pid) return;

        let v = "";
        let qty = 1;

        if (typeof maybeQty === "undefined") {
          qty = Number(variantOrQty || 1);
        } else {
          v = String(variantOrQty || "");
          qty = Number(maybeQty || 1);
        }

        setItems((prev) => {
          const list = Array.isArray(prev) ? prev : [];
          return list.map((x) => {
            if (getId(x) !== pid) return x;
            if (v && getVar(x) !== v) return x;
            return { ...x, qty: Math.max(1, qty) };
          });
        });
      },

      // ✅ Cart.jsx এর + / - এর জন্য
      inc(id) {
        const pid = String(id || "");
        if (!pid) return;

        setItems((prev) => {
          const list = Array.isArray(prev) ? prev : [];
          return list.map((x) =>
            getId(x) === pid ? { ...x, qty: (Number(x.qty) || 1) + 1 } : x
          );
        });
      },

      dec(id) {
        const pid = String(id || "");
        if (!pid) return;

        setItems((prev) => {
          const list = Array.isArray(prev) ? prev : [];
          const found = list.find((x) => getId(x) === pid);
          const q = found ? Number(found.qty) || 1 : 1;

          if (q <= 1) return list.filter((x) => getId(x) !== pid);

          return list.map((x) =>
            getId(x) === pid ? { ...x, qty: (Number(x.qty) || 1) - 1 } : x
          );
        });
      },

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
      },

      // ✅ logout এ UI থেকে 0 করতে চাইলে এটা call করবে
      resetUIOnly() {
        setItems([]);
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