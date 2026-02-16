import { memo } from "react";
import { useNavigate } from "react-router-dom";

import { memo } from "react";
import { useNavigate } from "react-router-dom";

/* ✅ এখানে বসাও */
const CAT_ICONS = {
  "Mobile Accessories": "📱",
  "HeadphoneS": "🎧",
  "Bluetooth Speakers": "🔊",
  "Data Cables": "🔌",
};

function HomeCategories({ cats }) {
  const nav = useNavigate();

  if (!Array.isArray(cats) || cats.length === 0) return null;

  return (
    <div className="homeSection">
      {/* Header */}
      <div className="rowBetween" style={{ alignItems: "center" }}>
        <h3 style={{ margin: 0 }}>Categories</h3>

        <button
          type="button"
          className="btnGhost"
          onClick={() => nav("/shop")}
          style={{ padding: "8px 12px" }}
        >
          See more
        </button>
      </div>

      {/* Categories Row (RTL) */}
      <div className="catRow">
        {cats.map((c) => (
          <button
            key={c._id} // ✅ stable key
            className="catItem"
            type="button"
            onClick={() => nav(`/shop?category=${c._id}`)}
          >
           <div className="catIcon">
          <span className="catEmoji">
       {CAT_ICONS[c.name] || "📦"}
            </span>
            </div>

      <div className="catName">{c.name}</div>
          </button>
        ))}
      </div>

      {/* ✅ Bottom 2 Options */}
      <div className="catOptions">
        <div className="optionCard">🚚 <span>Free Delivery</span></div>
        <div className="optionCard">🛍️ <span>Best Offers</span></div>
      </div>
    </div>
  );
}

export default memo(HomeCategories);