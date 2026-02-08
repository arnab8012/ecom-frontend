import "../styles/productDetails.css";
import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../api/api";
import { useCart } from "../context/CartContext";

export default function ProductDetails() {
  const { id } = useParams();
  const nav = useNavigate();
  const { add } = useCart();

  const [p, setP] = useState(null);
  const [variant, setVariant] = useState("");
  const [qty, setQty] = useState(1);

  // ✅ gallery state
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    let alive = true;

    (async () => {
      const r = await api.get(`/api/products/${id}`);
      if (!alive) return;

      if (r.ok) {
        setP(r.product);
        const firstVar = r.product?.variants?.[0]?.name || "";
        setVariant(firstVar);

        // ✅ reset gallery index
        setIdx(0);
      } else {
        alert(r.message || "Not found");
      }
    })();

    return () => (alive = false);
  }, [id]);

  const imgs = useMemo(() => {
    const arr = Array.isArray(p?.images) ? p.images : [];
    return arr.filter(Boolean);
  }, [p?.images]);

  // ✅ auto image change
  useEffect(() => {
    if (imgs.length <= 1) return;
    const t = setInterval(() => {
      setIdx((x) => (x + 1) % imgs.length);
    }, 2500);
    return () => clearInterval(t);
  }, [imgs.length]);

  if (!p) return <div className="container pdPage">Loading...</div>;

  const mainImg = imgs[idx] || "https://via.placeholder.com/800x500?text=Product";

  const cartItem = {
    productId: p._id,
    title: p.title,
    image: imgs[0] || mainImg,
    variant,
    qty,
    price: p.price,
  };

  const prev = () => {
    if (!imgs.length) return;
    setIdx((x) => (x - 1 + imgs.length) % imgs.length);
  };

  const next = () => {
    if (!imgs.length) return;
    setIdx((x) => (x + 1) % imgs.length);
  };

  return (
    <div className="container pdPage">
      <div className="pd">
        {/* ✅ LEFT: Gallery */}
        <div className="pdLeft">
          <div className="pdGallery">
            <img className="pdImg" src={mainImg} alt={p.title} />

            {/* ✅ arrow buttons */}
            {imgs.length > 1 && (
              <>
                <button type="button" onClick={prev} className="pdNavBtn pdPrev" aria-label="Prev">
                  ‹
                </button>

                <button type="button" onClick={next} className="pdNavBtn pdNext" aria-label="Next">
                  ›
                </button>
              </>
            )}

            {/* ✅ dots */}
            {imgs.length > 1 && (
              <div className="pdDots" aria-label="Image dots">
                {imgs.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setIdx(i)}
                    className={`pdDot ${i === idx ? "active" : ""}`}
                    aria-label={`img-${i}`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* ✅ thumbnails */}
          {imgs.length > 1 && (
            <div className="pdThumbRow">
              {imgs.map((url, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIdx(i)}
                  className={`pdThumbBtn ${i === idx ? "active" : ""}`}
                  title={`Image ${i + 1}`}
                >
                  <img src={url} alt="" className="pdThumbImg" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ✅ RIGHT: Details */}
        <div className="pdRight">
          <h2 className="pdTitle">{p.title}</h2>

          <div className="priceRow">
            <span className="price">৳ {p.price}</span>
            {p.compareAtPrice ? <span className="cut">৳ {p.compareAtPrice}</span> : null}
          </div>

          <div className="muted">Delivery time: {p.deliveryDays}</div>

          {p.variants?.length ? (
            <div className="box">
              <div className="lbl">Available variant:</div>
              <select value={variant} onChange={(e) => setVariant(e.target.value)} className="input">
                {p.variants.map((v, i) => (
                  <option key={i} value={v.name}>
                    {v.name} (Stock: {v.stock})
                  </option>
                ))}
              </select>
            </div>
          ) : null}

          <div className="box">
            <div className="lbl">Quantity</div>
            <div className="qtyRow">
              <button className="btnGhost" onClick={() => setQty((q) => Math.max(1, q - 1))} type="button">
                -
              </button>

              <input
                className="qtyInput"
                value={qty}
                onChange={(e) => setQty(Number(e.target.value || 1))}
                inputMode="numeric"
              />

              <button className="btnGhost" onClick={() => setQty((q) => q + 1)} type="button">
                +
              </button>
            </div>
          </div>

          <div className="pdBtns">
            <button
              className="btnPinkFull"
              onClick={() => {
                add(cartItem);
                nav("/cart");
              }}
              type="button"
            >
              Add to Cart
            </button>

            <button
              className="btnDarkFull"
              onClick={() => {
                add(cartItem);
                nav("/checkout");
              }}
              type="button"
            >
              Buy Now
            </button>
          </div>

          <div className="box">
            <h4>Description</h4>
            <p className="muted">{p.description || "No description yet."}</p>
          </div>
        </div>
      </div>
    </div>
  );
}