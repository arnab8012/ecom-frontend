import { Link } from "react-router-dom";

export default function ProductCard({ p, onAdd }) {
  const img = p?.images?.[0] || p?.image || p?.thumbnail || p?.photo || "";
  const title = p?.name || p?.title || "Product";
  const weight = p?.weight || p?.size || p?.unit || "";
  const price = Number(p?.price || 0);

  const whole = Math.floor(price);
  const frac = Math.round((price - whole) * 100);

  return (
    <div className="pCardV2">
      <Link className="pTopLink" to={`/product/${p?._id || ""}`}>
        <div className="pThumb">
          {img ? (
            <img className="pThumbImg" src={img} alt={title} loading="lazy" />
          ) : (
            <div className="pThumbPh">No image</div>
          )}
        </div>

        <div className="pInfo">
          <div className="pName">{title}</div>
          {!!weight && <div className="pMeta">{weight}</div>}
        </div>

        <div className="pPriceBig">
          <span className="pWhole">{whole}</span>
          <span className="pFrac">{String(frac).padStart(2, "0")}৳</span>
        </div>
      </Link>

      {/* ✅ curved bottom bar + plus button */}
      <div className="pBottomCurve" aria-hidden="true" />
      <button
        type="button"
        className="pPlusBtn"
        onClick={() => (onAdd ? onAdd(p) : null)}
        aria-label="Add to cart"
      >
        +
      </button>
    </div>
  );
}