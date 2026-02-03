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
    <div className="card premiumCard">
      <div className="premiumImgWrap">
        <Link to={`/product/${p._id}`}>
          <img className="cardImg premiumImg" src={img} alt={p?.title || ""} />
        </Link>

        <button type="button" onClick={onFav} className="favBtn" title="Priyo">
          {isFav(p._id) ? "❤️" : "🤍"}
        </button>
      </div>

      <div className="cardBody">
        <Link className="cardTitle premiumTitle" to={`/product/${p._id}`}>
          {p.title}
        </Link>

        <div className="priceRow">
          <span className="price">৳ {p.price}</span>
        </div>

        <div className="rowBetween" style={{ marginTop: 8 }}>
          <button className="btnGhost" type="button" onClick={() => nav(`/product/${p._id}`)}>
            View
          </button>

          <button
            className="btnPink"
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