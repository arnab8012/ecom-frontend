import { memo } from "react";
import { useNavigate } from "react-router-dom";

function HomeCategories({ cats }) {
  const nav = useNavigate();

  if (!Array.isArray(cats) || cats.length === 0) return null;

  return (
    <div className="catRow">
      {cats.map((c) => (
        <button
          key={c._id} // ✅ stable key
          className="catItem"
          type="button"
          onClick={() => nav(`/shop?category=${c._id}`)}
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
  );
}

export default memo(HomeCategories); // ✅ banner slide হলেও re-render কমে যাবে