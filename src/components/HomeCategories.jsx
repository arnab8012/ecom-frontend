import { memo } from "react";
import { useNavigate, Link } from "react-router-dom";

function HomeCategories({ cats }) {
  const nav = useNavigate();

  if (!Array.isArray(cats) || cats.length === 0) return null;

  return (
    <div className="catSection">
      <div className="catHeader">
        <h3>Categories</h3>

        <Link className="seeMore" to="/shop">
          See more
        </Link>
      </div>

      {/* ✅ right-to-left row */}
      <div className="catRow">
        {cats.map((c) => (
          <button
            key={c._id}
            className="catItem"
            type="button"
            onClick={() => nav(`/shop?category=${c.slug || c._id}`)}
          >
            <div className="catIcon">
              <img
                src={c.image || "https://via.placeholder.com/160"}
                alt={c.name}
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "https://via.placeholder.com/160";
                }}
              />
            </div>
            <div className="catName">{c.name}</div>
          </button>
        ))}
      </div>

      {/* ✅ 2 options under categories */}
      <div className="catOptions">
        <div className="optionCard">
          🚚 <span>Free Delivery</span>
        </div>

        <div className="optionCard">
          🛍️ <span>Best Offers</span>
        </div>
      </div>
    </div>
  );
}

export default memo(HomeCategories);