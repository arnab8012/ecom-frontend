import "../styles/product-card.css";
import { Link, useNavigate } from "react-router-dom";
import { useFavorites } from "../context/FavoritesContext";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useState } from "react";

export default function ProductCard({ p }) {
  const nav = useNavigate();
  const fav = useFavorites();
  const { user } = useAuth();
  const { add } = useCart();

  const [added, setAdded] = useState(false);

  const isFav = Array.isArray(fav?.favIds) ? fav.favIds.includes(p?._id) : false;

  const img =
    Array.isArray(p?.images) && p.images.length
      ? p.images[0]
      : p?.image || "https://via.placeholder.com/300";

  const productLink = "/product/" + p?._id;

  const stop = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const onFav = (e) => {
    stop(e);
    if (!user) {
      nav("/login");
      return;
    }
    fav?.toggle?.(p._id);
  };

  const onAddCart = (e) => {
    stop(e);

    add?.({
      productId: p?._id,
      title: p?.title,
      price: p?.price,
      image: img,
      variant: "",
      qty: 1,
    });

    // ✅ show toast
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <div className="pCard">
      {/* ✅ Toast */}
      {added && <div className="toastAdded">✓ Added to cart</div>}

      <div className="pImgWrap">
        <Link to={productLink} onClick={(e) => e.stopPropagation()}>
          <img className="pImg" src={img} alt={p?.title} />
        </Link>

        <button className="pFav" type="button" onClick={onFav}>
          {isFav ? "❤️" : "🤍"}
        </button>
      </div>

      <div className="pBody">
        <Link to={productLink} className="pTitle">
          {p?.title}
        </Link>

        <div className="pPrice">৳ {p?.price}</div>

        <div className="pActions">
          <Link to={productLink} className="btnSoft">
            View
          </Link>

          <button className="btnPrimary" onClick={onAddCart}>
            Add
          </button>
        </div>
      </div>
    </div>
  );
}