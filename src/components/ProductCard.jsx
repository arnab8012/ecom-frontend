import { Link } from "react-router-dom";
import { useFavorites } from "../context/FavoritesContext";

export default function ProductCard({ p }) {
  const fav = useFavorites();
  const isFav = fav?.favIds?.includes(p?._id);

  const img =
    Array.isArray(p?.images) && p.images.length
      ? p.images[0]
      : p?.image || "https://via.placeholder.com/300";

  const productLink = "/product/" + p._id;

  return (
    <div className="pCard">
      {/* image area */}
      <div className="pImgWrap">
        <Link to={productLink}>
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
        <button
          className="pFav"
          type="button"
          onClick={() => fav?.toggle?.(p._id)}
        >
          {isFav ? "❤️" : "🤍"}
        </button>
      </div>

      {/* body */}
      <div className="pBody">
        <Link to={productLink} className="pTitle">
          {p?.title}
        </Link>

        <div className="pPriceRow">
          <div className="pPrice">৳ {p?.price}</div>
        </div>

        <div className="pActions">
          <Link to={productLink} className="btnSoft">
            View & Buy
          </Link>
        </div>
      </div>
    </div>
  );
}