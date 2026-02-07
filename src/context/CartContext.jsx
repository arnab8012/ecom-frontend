import { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartCtx = createContext(null);

// ✅ guest keys (logout হলে UI 0 দেখানোর জন্য)
const LS_GUEST = "cart_guest";
const LS_BUY_GUEST = "buy_now_guest";

// ✅ helper
function safeParse(raw, fallback) {
  try {
    const v = JSON.parse(raw);
    return v ?? fallback;
  } catch {
    return fallback;
  }
}
function loadKey(key, fallback) {
  const raw = localStorage.getItem(key);
  return raw ? safeParse(raw, fallback) : fallback;
}

// ✅ per-user keys
const userCartKey = (uid) => `cart_user_${String(uid || "").trim()}`;
const userBuyKey = (uid) => `buy_now_user_${String(uid || "").trim()}`;

// ✅ id normalize
function getId(x) {
  return String(x?.productId || x?._id || x?.id || x?.product?._id || x?.product?.id || "");
}
function getVar(x) {
  return String(x?.variant || "");
}

export function CartProvider({ children }) {
  const [activeKey, setActiveKey] = useState(LS_GUEST);
  const [activeBuyKey, setActiveBuyKey] = useState(LS_BUY_GUEST);

  const [items, setItems] = useState(() => {
    const data = loadKey(LS_GUEST, []);
    return Array.isArray(data) ? data : [];
  });

  const [checkoutItem, setCheckoutItem] = useState(() => loadKey(LS_BUY_GUEST, null));

  // ✅ persist to current active keys
  useEffect(() => {
    try {
      localStorage.setItem(activeKey, JSON.stringify(items));
    } catch {}
  }, [items, activeKey]);

  useEffect(() => {
    try {
      localStorage.setItem(activeBuyKey, JSON.stringify(checkoutItem));
    } catch {}
  }, [checkoutItem, activeBuyKey]);

  // ✅ switch cart storage by user (login/logout এ কল হবে)
  const useUserCart = (uidOrPhone) => {
    const uid = String(uidOrPhone || "").trim();

    if (!uid) {
      // guest mode
      setActiveKey(LS_GUEST);
      setActiveBuyKey(LS_BUY_GUEST);

      const gi = loadKey(LS_GUEST, []);
      setItems(Array.isArray(gi) ? gi : []);

      const gb = loadKey(LS_BUY_GUEST, null);
      setCheckoutItem(gb || null);
      return;
    }

    // user mode
    const ck = userCartKey(uid);
    const bk = userBuyKey(uid);

    setActiveKey(ck);
    setActiveBuyKey(bk);

    const ui = loadKey(ck, []);
    setItems(Array.isArray(ui) ? ui : []);

    const ub = loadKey(bk, null);
    setCheckoutItem(ub || null);
  };

  const value = useMemo(
    () => ({
      items,
      checkoutItem,

      // ✅ important: AuthContext থেকে login/logout হলে call করবে
      useUserCart,

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
              qty: (Number(copy[idx].qty) || 1) + (Number(item?.qty) || 1),
            };
            return copy;
          }

          return [
            ...list,
            {
              ...item,
              productId: item?.productId || item?._id || item?.id || pid,
              variant: v,
              qty: Number(item?.qty) || 1,
            },
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
          const found = list.find((x) => getId(x) === pid);
          const q = found ? Number(found.qty) || 1 : 1;

          if (q <= 1) return list.filter((x) => getId(x) !== pid);

          return list.map((x) => (getId(x) === pid ? { ...x, qty: (Number(x.qty) || 1) - 1 } : x));
        });
      },

      buyNow(p, variant = "", qty = 1) {
        const item = {
          productId: p?._id || p?.productId || p?.id || "",
          title: p?.title || p?.name || "",
          price: Number(p?.price || 0),
          image: p?.images?.[0] || p?.image || "",
          variant: String(variant || p?.variant || ""),
          qty: Number(qty || p?.qty || 1),
        };
        if (!item.productId) return;
        setCheckoutItem(item);
      },

      clearBuyNow() {
        setCheckoutItem(null);
      },
    }),
    [items, checkoutItem]
  );

  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>;
}

export function useCart() {
  return useContext(CartCtx);
}