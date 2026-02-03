import { Link } from "react-router-dom";

export default function ProductCard({ p, onAdd, onBuy }) {
  const img =
    p?.images?.[0] ||
    p?.image ||
    p?.thumbnail ||
    "https://via.placeholder.com/300x300?text=No+Image";

  return (
    <div className="pCard">
      <Link to={`/product/${p?._id}`} className="pLink">
        <div className="pImgWrap">
          <img className="pImg" src={img} alt={p?.name || "product"} />
        </div>

        <div className="pBody">
          <span className="pTitle">{p?.name}</span>

          <div className="pPriceRow">
            <div className="pPrice">
              {p?.price}
              <span style={{ fontSize: 14 }}>৳</span>
            </div>
          </div>
        </div>
      </Link>

      {/* ✅ আগের মতো বাটন (No +) */}
      <div className="pActions">
        <button
          type="button"
          className="btnSoft"
          onClick={() => (onAdd ? onAdd(p) : null)}
        >
          Add to Cart
        </button>

        <button
          type="button"
          className="btnPrimary"
          onClick={() => (onBuy ? onBuy(p) : onAdd ? onAdd(p) : null)}
        >
          Buy
        </button>
      </div>
    </div>
  );
}