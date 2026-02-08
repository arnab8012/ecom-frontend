// src/pages/ProductDetails.jsx
import "../styles/productDetails.css";

import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../api/api";

// (তোমার প্রজেক্টে CartContext থাকলে এটা কাজ করবে)
// না থাকলে এটা remove করে নিজের cart add function বসিয়ে দিও
import { useCart } from "../context/CartContext";

export default function ProductDetails() {
  const nav = useNavigate();
  const { id } = useParams();
  const cart = useCart?.();

  const [loading, setLoading] = useState(true);
  const [p, setP] = useState(null);

  const [variant, setVariant] = useState("");
  const [qty, setQty] = useState(1);

  const [descOpen, setDescOpen] = useState(false);

  // ✅ image helper: relative হলে BASE যোগ করবে
  const absUrl = (u) => {
    if (!u) return "";
    const s = String(u);
    if (s.startsWith("http://") || s.startsWith("https://")) return s;
    return `${api.BASE}${s.startsWith("/") ? "" : "/"}${s}`;
  };

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);
        // 🔧 Backend route তোমারটা আলাদা হলে এখানে শুধু urlটা বদলাবে
        // common: /api/products/:id
        const r = await api.get(`/api/products/${id}`);
        if (!alive) return;

        if (r?.ok) {
          const prod = r.product || r.p || r.data || null;
          setP(prod);

          // default variant
          const v =
            (prod?.variants && prod.variants[0]?.name) ||
            prod?.variant ||
            prod?.variants?.[0] ||
            "";
          setVariant(v || "");
        } else {
          setP(null);
        }
      } catch {
        if (alive) setP(null);
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [id]);

  const priceNow = useMemo(() => {
    const vObj =
      (p?.variants || []).find((x) => x?.name === variant) ||
      (p?.variants || []).find((x) => x?.variant === variant) ||
      null;

    // try multiple common fields
    const now =
      vObj?.price ??
      p?.price ??
      p?.sellPrice ??
      p?.salePrice ??
      p?.currentPrice ??
      0;

    const old =
      vObj?.oldPrice ??
      p?.oldPrice ??
      p?.mrp ??
      p?.regularPrice ??
      p?.originalPrice ??
      0;

    const stock = vObj?.stock ?? vObj?.qty ?? p?.stock ?? p?.qty ?? null;

    return {
      now: Number(now || 0),
      old: Number(old || 0),
      stock: typeof stock === "number" ? stock : stock ? Number(stock) : null,
    };
  }, [p, variant]);

  const deliveryText = useMemo(() => {
    // তোমার backend এ থাকলে ব্যবহার হবে
    return p?.deliveryTime || p?.delivery || "3–5 days";
  }, [p]);

  const variantsList = useMemo(() => {
    const arr = Array.isArray(p?.variants) ? p.variants : [];
    if (arr.length) {
      return arr.map((x) => ({
        key: x?.name || x?.variant || String(x?._id || ""),
        label: x?.name || x?.variant || "Variant",
        stock: x?.stock ?? x?.qty ?? null,
      }));
    }
    // fallback (single variant)
    if (p?.variant) return [{ key: p.variant, label: p.variant, stock: p?.stock ?? null }];
    return [];
  }, [p]);

  const clampQty = (n) => {
    const max = priceNow.stock && priceNow.stock > 0 ? priceNow.stock : 99;
    const v = Math.max(1, Math.min(max, Number(n || 1)));
    return v;
  };

  const addToCart = () => {
    const item = {
      productId: p?._id || id,
      title: p?.title || p?.name || "Product",
      price: priceNow.now,
      qty: clampQty(qty),
      variant: variant || "",
      image: absUrl(p?.image || p?.thumbnail || p?.images?.[0]),
    };

    // ✅ safest: support multiple cart APIs without crashing
    if (cart?.addToCart) cart.addToCart(item);
    else if (cart?.add) cart.add(item);
    else if (cart?.addItem) cart.addItem(item);
    else {
      // fallback simple storage (so button works even if no CartContext)
      const k = "guest_cart";
      const old = JSON.parse(localStorage.getItem(k) || "[]");
      old.push(item);
      localStorage.setItem(k, JSON.stringify(old));
    }

    // small feedback
    try {
      navigator?.vibrate?.(25);
    } catch {}
    alert("Added to cart ✅");
  };

  const buyNow = () => {
    addToCart();
    nav("/cart");
  };

  if (loading) {
    return (
      <div className="container pdPage">
        <div className="pdCard pdSkeleton">Loading…</div>
      </div>
    );
  }

  if (!p) {
    return (
      <div className="container pdPage">
        <div className="pdCard">
          <b>Product not found</b>
          <div className="pdGap" />
          <button className="pdBtnGhost" onClick={() => nav(-1)} type="button">
            ← Back
          </button>
        </div>
      </div>
    );
  }

  const img = absUrl(p?.image || p?.thumbnail || p?.images?.[0]);

  const hasDiscount = priceNow.old > priceNow.now && priceNow.now > 0;
  const offPct =
    hasDiscount && priceNow.old
      ? Math.round(((priceNow.old - priceNow.now) / priceNow.old) * 100)
      : 0;

  return (
    <div className="container pdPage">
      <div className="pdTop">
        <button className="pdBack" type="button" onClick={() => nav(-1)}>
          ← Back
        </button>
      </div>

      <div className="pdGrid">
        {/* IMAGE */}
        <div className="pdMedia pdCard">
          {img ? (
            <img className="pdImg" src={img} alt={p?.title || p?.name || "Product"} />
          ) : (
            <div className="pdImgFallback">No image</div>
          )}
        </div>

        {/* INFO */}
        <div className="pdInfo pdCard">
          {/* ✅ 1 বাদ (Title truncate করিনি) */}
          <h1 className="pdTitle">{p?.title || p?.name}</h1>

          {/* ✅ 2 Price layout */}
          <div className="pdPriceRow">
            <div className="pdPriceLeft">
              <span className="pdPriceNow">৳ {priceNow.now || 0}</span>
              {hasDiscount && (
                <>
                  <span className="pdPriceOld">৳ {priceNow.old}</span>
                  <span className="pdBadgeOff">-{offPct}%</span>
                </>
              )}
            </div>

            {priceNow.stock !== null && (
              <span className={priceNow.stock > 0 ? "pdStock ok" : "pdStock no"}>
                {priceNow.stock > 0 ? `Stock: ${priceNow.stock}` : "Out of stock"}
              </span>
            )}
          </div>

          {/* ✅ 3 Delivery */}
          <div className="pdDelivery">
            <span className="pdDeliveryIcon">🚚</span>
            <div>
              <div className="pdDeliveryLabel">Delivery time</div>
              <div className="pdDeliveryValue">{deliveryText}</div>
            </div>
          </div>

          {/* ✅ 4 Variant dropdown */}
          {variantsList.length > 0 && (
            <div className="pdBlock">
              <div className="pdLabel">Available variant</div>
              <div className="pdSelectWrap">
                <select
                  className="pdSelect"
                  value={variant}
                  onChange={(e) => setVariant(e.target.value)}
                >
                  {variantsList.map((v) => (
                    <option key={v.key} value={v.label}>
                      {v.label}
                      {typeof v.stock === "number" ? ` (Stock: ${v.stock})` : ""}
                    </option>
                  ))}
                </select>
                <span className="pdSelectChevron">▾</span>
              </div>
            </div>
          )}

          {/* ✅ 5 Quantity compact */}
          <div className="pdBlock">
            <div className="pdLabel">Quantity</div>
            <div className="pdQtyRow">
              <button
                className="pdQtyBtn"
                type="button"
                onClick={() => setQty((x) => clampQty(x - 1))}
                aria-label="Decrease quantity"
              >
                −
              </button>

              <input
                className="pdQtyInput"
                value={qty}
                onChange={(e) => setQty(clampQty(e.target.value))}
                inputMode="numeric"
              />

              <button
                className="pdQtyBtn"
                type="button"
                onClick={() => setQty((x) => clampQty(x + 1))}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          </div>

          {/* ✅ 7 Description spacing + Read more */}
          <div className="pdBlock">
            <div className="pdLabel">Description</div>

            <div className={descOpen ? "pdDesc open" : "pdDesc"}>
              {String(p?.description || p?.details || "").trim() || "No description"}
            </div>

            <button
              className="pdReadMore"
              type="button"
              onClick={() => setDescOpen((s) => !s)}
            >
              {descOpen ? "Show less" : "Read more"}
            </button>
          </div>
        </div>
      </div>

      {/* ✅ 6 Sticky bottom CTA */}
      <div className="pdStickyBar">
        <button className="pdBtnGhost" type="button" onClick={() => nav("/cart")}>
          View Cart
        </button>

        <button
          className="pdBtnPrimary"
          type="button"
          onClick={addToCart}
          disabled={priceNow.stock === 0}
        >
          Add to Cart
        </button>

        <button
          className="pdBtnBuy"
          type="button"
          onClick={buyNow}
          disabled={priceNow.stock === 0}
        >
          Buy Now
        </button>
      </div>

      {/* ✅ 8 Navbar overlap fix: bottom + safe area spacing */}
      <div className="pdBottomSpace" />
    </div>
  );
}