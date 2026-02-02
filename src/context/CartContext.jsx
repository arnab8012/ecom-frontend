import { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartCtx = createContext(null);

const LS_KEY = "cart_v1";
const LS_BUY = "buy_now_v1"; // ✅ buy now

function loadJSON(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
  } catch {
    return fallback;
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => loadJSON(LS_KEY, []));
  const [checkoutItem, setCheckoutItem] = useState(() => loadJSON(LS_BUY, null));

  // persist cart
  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(items));
  }, [items]);

  // persist buy now
  useEffect(() => {
    localStorage.setItem(LS_BUY, JSON.stringify(checkoutItem));
  }, [checkoutItem]);

  const value = useMemo(
    () => ({
      items,
      checkoutItem, // ✅ single product checkout item

      add(item) {
        setItems((prev) => {
          const idx = prev.findIndex(
            (x) =>
              x.productId === item.productId &&
              (x.variant || "") === (item.variant || "")
          );

          if (idx >= 0) {
            const copy = [...prev];
            copy[idx] = { ...copy[idx], qty: (copy[idx].qty || 1) + (item.qty || 1) };
            return copy;
          }
          return [...prev, { ...item, qty: item.qty || 1 }];
        });
      },

      remove(productId, variant) {
        setItems((prev) =>
          prev.filter(
            (x) =>
              !(
                x.productId === productId &&
                (x.variant || "") === (variant || "")
              )
          )
        );
      },

      clear() {
        setItems([]);
      },

      setQty(productId, variant, qty) {
        setItems((prev) =>
          prev.map((x) =>
            x.productId === productId && (x.variant || "") === (variant || "")
              ? { ...x, qty: Math.max(1, Number(qty || 1)) }
              : x
          )
        );
      },

      // ✅ BUY NOW: single product checkout
      buyNow(p, variant = "", qty = 1) {
        // p can be full product or already minimal
        const item = {
          productId: p._id || p.productId,
          title: p.title || p.name || "",
          price: Number(p.price || 0),
          image: p.images?.[0] || p.image || "",
          variant: variant || p.variant || "",
          qty: Number(qty || p.qty || 1)
        };
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
