import "../styles/product-card.css";
import { Link, useNavigate } from "react-router-dom";
import { useFavorites } from "../context/FavoritesContext";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function ProductCard({ p }) {
  const nav = useNavigate();
  const fav = useFavorites();
  const { user } = useAuth();
  const { add } = useCart();

  const isFav = Array.isArray(fav?.favIds) ? fav.favIds.includes(p?._id) : false;

  const img =
    Array.isArray(p?.images) && p.images.length
      ? p.images[0]
      : p?.image || "https://via.placeholder.com/300";

  const productLink = "/product/" + p?._id;

  // ✅ prevent parent click (Home এর category button / wrapper)
  const stop = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const onFav = (e) => {
    stop(e);

    // ✅ login ছাড়া priyo না
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

    // ✅ Add হবে, কিন্তু cart page এ যাবে না
    // nav("/cart");  <-- এটা বাদ
  };

  return (
    <div className="pCard">
      {/* image area */}
      <div className="pImgWrap">
        <Link to={productLink} onClick={(e) => e.stopPropagation()}>
          <img
            className="pImg"
            src={img}
            alt={p?.title || "product"}
            loading="lazy"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "https://via.placeholder.com/300";
            }}
          />
        </Link>

        {/* favorite */}
        <button className="pFav" type="button" onClick={onFav} title="Priyo">
          {isFav ? "❤️" : "🤍"}
        </button>
      </div>

      {/* body */}
      <div className="pBody" onClick={(e) => e.stopPropagation()}>
        <Link to={productLink} className="pTitle" onClick={(e) => e.stopPropagation()}>
          {p?.title}
        </Link>

        <div className="pPriceRow">
          <div className="pPrice">৳ {p?.price}</div>
        </div>

        <div className="pActions">
          {/* ✅ Premium 2-button: View + Add */}
          <Link to={productLink} className="btnSoft" onClick={(e) => e.stopPropagation()}>
            View
          </Link>

          <button className="btnPrimary" type="button" onClick={onAddCart}>
            Add
          </button>
        </div>
      </div>
    </div>
  );
}