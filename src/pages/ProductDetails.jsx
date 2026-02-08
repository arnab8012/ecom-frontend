import "../styles/productDetails.css";
import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../api/api";
import { useCart } from "../context/CartContext";

function safeUrl(u) {
  if (!u) return "";
  return String(u).trim().replace(/ /g, "%20");
}

export default function ProductDetails() {
  const { id } = useParams();
  const nav = useNavigate();
  const { add } = useCart();

  const [p, setP] = useState(null);
  const [variant, setVariant] = useState("");
  const [qty, setQty] = useState(1);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    let alive = true;
    (async () => {
      const r = await api.get(`/api/products/${id}`);
      if (!alive) return;

      if (r.ok) {
        setP(r.product);
        setVariant(r.product.variants?.[0]?.name || "");
        setIdx(0);
      } else {
        alert(r.message || "Not found");
      }
    })();
    return () => (alive = false);
  }, [id]);

  const imgs = useMemo(() => {
    const arr = Array.isArray(p?.images) ? p.images : [];
    return arr.map(safeUrl).filter(Boolean);
  }, [p?.images]);

  useEffect(() => {
    if (imgs.length <= 1) return;
    const t = setInterval(() => {
      setIdx((x) => (x + 1) % imgs.length);
    }, 2500);
    return () => clearInterval(t);
  }, [imgs.length]);

  if (!p) return <div className="container">Loading...</div>;

  const fallbackMain = "https://via.placeholder.com/800x500";
  const mainImg = imgs[idx] || fallbackMain;

  const cartItem = {
    productId: p._id,
    title: p.title,
    image: imgs[0] || mainImg,
    variant,
    qty,
    price: p.price,
  };

  return (
    <div className="container">
      <div className="pd">
        <div>
          <img
            className="pdImg"
            src={mainImg}
            alt={p.title}
            style={{ width: "100%", borderRadius: 14 }}
            onError={(e) => {
              e.currentTarget.src = fallbackMain;
            }}
          />
        </div>

        <div className="pdRight">
          <h2>{p.title}</h2>

          <div className="priceRow">
            <span className="price">৳ {p.price}</span>
            {p.compareAtPrice ? (
              <span className="cut">৳ {p.compareAtPrice}</span>
            ) : null}
          </div>

          <div className="muted">Delivery time: {p.deliveryDays}</div>

          {p.variants?.length ? (
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
          ) : null}

          <div className="qtyRow">
            <button onClick={() => setQty(Math.max(1, qty - 1))}>-</button>
            <input value={qty} readOnly />
            <button onClick={() => setQty(qty + 1)}>+</button>
          </div>

          <button
            className="btnPinkFull"
            onClick={() => {
              add(cartItem);
              nav("/cart");
            }}
          >
            Add to Cart
          </button>

          <button
            className="btnDarkFull"
            onClick={() => {
              add(cartItem);
              nav("/checkout");
            }}
          >
            Buy Now
          </button>

          <p className="muted">{p.description}</p>
        </div>
      </div>
    </div>
  );
}