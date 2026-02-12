import "../styles/productDetails.css";
import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../api/api";
import { useCart } from "../context/CartContext";
import { Helmet } from "react-helmet-async";

export default function ProductDetails() {
  const { id } = useParams();
  const nav = useNavigate();
  const { add, buyNow } = useCart();

  const [p, setP] = useState(null);
  const [variant, setVariant] = useState("");
  const [qty, setQty] = useState(1);

  // gallery
  const [idx, setIdx] = useState(0);

  // toast
  const [toast, setToast] = useState("");

  useEffect(() => {
    let alive = true;

    (async () => {
      const r = await api.get(`/api/products/${id}`);
      if (!alive) return;

      if (r.ok) {
        setP(r.product);
        const firstVar = r.product.variants?.[0]?.name || "";
        setVariant(firstVar);
        setQty(1);
        setIdx(0);
      } else {
        alert(r.message || "Product not found");
      }
    })();

    return () => (alive = false);
  }, [id]);

  const imgs = useMemo(() => {
    const arr = Array.isArray(p?.images) ? p.images : [];
    return arr.filter(Boolean);
  }, [p?.images]);

  // auto image slide
  useEffect(() => {
    if (imgs.length <= 1) return;
    const t = setInterval(() => {
      setIdx((x) => (x + 1) % imgs.length);
    }, 2500);
    return () => clearInterval(t);
  }, [imgs.length]);

  if (!p) return <div className="container">Loading…</div>;

  const mainImg = imgs[idx] || "https://via.placeholder.com/800x500?text=Product";

  const cartItem = {
    productId: p._id,
    title: p.title,
    image: imgs[0] || mainImg,
    variant,
    qty,
    price: p.price
  };

  const canonical = `https://thecuriousempire.com/product/${p._id}`;
  const title = `${p.title} | The Curious Empire`;
  const desc =
    p.description ||
    "Shop premium products at The Curious Empire. Quality products with fast delivery.";

  const showToast = (msg) => {
    setToast(msg);
    window.clearTimeout(showToast._t);
    showToast._t = window.setTimeout(() => setToast(""), 1200);
  };

  return (
    <>
      {/* ================= SEO ================= */}
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={desc} />
        <link rel="canonical" href={canonical} />

        <meta property="og:title" content={title} />
        <meta property="og:description" content={desc} />
        <meta property="og:type" content="product" />
        <meta property="og:url" content={canonical} />
        <meta property="og:image" content={imgs[0] || "https://thecuriousempire.com/og.png"} />
      </Helmet>

      <div className="container">
        <div className="pd">
          {/* ===== LEFT: Gallery ===== */}
          <div>
            <div style={{ position: "relative" }}>
              <img
                className="pdImg"
                src={mainImg}
                alt={p.title}
                style={{ width: "100%", borderRadius: 14 }}
              />

              {imgs.length > 1 && (
                <>
                  <button
                    onClick={() => setIdx((x) => (x - 1 + imgs.length) % imgs.length)}
                    className="pdArrow left"
                  >
                    ‹
                  </button>
                  <button
                    onClick={() => setIdx((x) => (x + 1) % imgs.length)}
                    className="pdArrow right"
                  >
                    ›
                  </button>
                </>
              )}
            </div>

            {imgs.length > 1 && (
              <div className="pdThumbs">
                {imgs.map((url, i) => (
                  <img
                    key={i}
                    src={url}
                    alt=""
                    className={i === idx ? "active" : ""}
                    onClick={() => setIdx(i)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* ===== RIGHT: Info ===== */}
          <div className="pdRight">
            {toast && <div className="pdToast">✓ {toast}</div>}

            <h1>{p.title}</h1>

            <div className="priceRow">
              <span className="price">৳ {p.price}</span>
              {p.compareAtPrice && <span className="cut">৳ {p.compareAtPrice}</span>}
            </div>

            <div className="muted">Delivery time: {p.deliveryDays}</div>

            {p.variants?.length > 0 && (
              <div className="box">
                <div className="lbl">Variant</div>
                <select
                  value={variant}
                  onChange={(e) => setVariant(e.target.value)}
                  className="input"
                >
                  {p.variants.map((v, i) => (
                    <option key={i} value={v.name}>
                      {v.name} (Stock: {v.stock})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="box">
              <div className="lbl">Quantity</div>
              <div className="qtyRow">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
                <input value={qty} readOnly />
                <button onClick={() => setQty((q) => q + 1)}>+</button>
              </div>
            </div>

            <div className="pdBtns">
              <button
                className="btnPinkFull"
                onClick={() => {
                  add(cartItem);
                  showToast("Added to cart");
                }}
              >
                Add to Cart
              </button>

              <button
                className="btnDarkFull"
                onClick={() => {
                  buyNow(p, variant, qty);
                  nav("/checkout?mode=buy");
                }}
              >
                Buy Now
              </button>
            </div>

            <div className="box">
              <h4>Description</h4>
              <p className="muted">{p.description || "No description available."}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}