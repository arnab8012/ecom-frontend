import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useFavorites } from "../context/FavoritesContext";
import { useAuth } from "../context/AuthContext";

export default function ProductCard({ p }) {
  const nav = useNavigate();
  const { add } = useCart();
  const { user } = useAuth();
  const { isFav, toggle } = useFavorites();

  const imgs = useMemo(() => {
    const arr = Array.isArray(p?.images) ? p.images : [];
    return arr.filter(Boolean);
  }, [p?._id]);

  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (imgs.length <= 1) return;
    setIdx(0);
    const t = setInterval(() => {
      setIdx((x) => (x + 1) % imgs.length);
    }, 2500);
    return () => clearInterval(t);
  }, [imgs.length]);

  const img = imgs[idx] || "https://via.placeholder.com/400x300?text=Product";

  const onFav = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) return nav("/login");
    toggle(p._id);
  };

  return (
    <div className="pCard">
      <div className="pImgWrap">
        <Link to={`/product/${p._id}`}>
          <img className="pImg" src={img} alt={p?.title || ""} />
        </Link>

        <button className="pFav" type="button" onClick={onFav} title="Priyo">
          {isFav(p._id) ? "❤️" : "🤍"}
        </button>

        {imgs.length > 1 && (
          <div className="pDots">
            {imgs.map((_, i) => (
              <button
                key={i}
                className={`pDot ${i === idx ? "active" : ""}`}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIdx(i);
                }}
                aria-label={`img-${i}`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="pBody">
        <Link className="pTitle" to={`/product/${p._id}`}>
          {p.title}
        </Link>

        <div className="pPriceRow">
          <span className="pPrice">৳ {p.price}</span>
        </div>

        <div className="pActions">
          <button className="btnSoft" type="button" onClick={() => nav(`/product/${p._id}`)}>
            View
          </button>

          <button
            className="btnPrimary"
            type="button"
            onClick={() => {
              add({
                productId: p._id,
                title: p.title,
                price: p.price,
                image: imgs[0] || "",
                variant: "",
                qty: 1,
              });
              alert("✅ Added to cart");
            }}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}