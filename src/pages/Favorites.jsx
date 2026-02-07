// src/pages/Favorites.jsx
import "../styles/favorites.css";

import { Link, useNavigate, useLocation } from "react-router-dom";
import { useFavorites } from "../context/FavoritesContext";
import { useAuth } from "../context/AuthContext";

export default function Favorites() {
  const nav = useNavigate();
  const loc = useLocation();
  const fav = useFavorites();
  const { user } = useAuth();

  // ✅ admin panel এ hide
  if (loc.pathname.startsWith("/admin")) return null;

  // ✅ বিভিন্ন context shape handle
  const favIds = Array.isArray(fav?.favIds) ? fav.favIds : [];
  const favItemsRaw =
    (Array.isArray(fav?.items) && fav.items) ||
    (Array.isArray(fav?.favorites) && fav.favorites) ||
    (Array.isArray(fav?.list) && fav.list) ||
    [];

  // ✅ যদি object list না থাকে, তাও count দেখাবে
  const list = favItemsRaw;

  const total = list.length || favIds.length;

  const formatBDT = (n) => `৳ ${Math.round(Number(n) || 0).toLocaleString("en-US")}`;

  const doRemove = (id) => {
    // ✅ তোমার context এ remove / toggle / removeFav / removeFavorite যে যেটা আছে সেটার সাথে কাজ করবে
    if (fav?.remove) return fav.remove(id);
    if (fav?.removeFav) return fav.removeFav(id);
    if (fav?.removeFavorite) return fav.removeFavorite(id);
    if (fav?.toggle) return fav.toggle(id);
    if (fav?.toggleFav) return fav.toggleFav(id);
    // কিছু না থাকলে কিছুই করবে না
  };

  const doClear = () => {
    if (fav?.clear) return fav.clear();
    if (fav?.clearAll) return fav.clearAll();
    if (fav?.reset) return fav.reset();
  };

  return (
    <div className="container favPage">
      <div className="rowBetween favHead">
        <div>
          <h2 className="favTitle" style={{ margin: 0 }}>
            My Favorites
          </h2>
          <div className="favSub">
            {user?.name || user?.phone || user?.email || "Guest"} — <b>Total: {total}</b>
          </div>
        </div>

        <button className="favBackBtn" type="button" onClick={() => nav(-1)}>
          ← Back
        </button>
      </div>

      {!total ? (
        <div className="favEmpty">
          No favorites yet. <Link to="/shop">Go to shop</Link>
        </div>
      ) : (
        <>
          <div className="favTopActions">
            <button type="button" className="favPrimaryBtn" onClick={() => nav("/checkout")}>
              Checkout (First Favorite)
            </button>

            <button type="button" className="favGhostBtn" onClick={doClear}>
              Clear All
            </button>
          </div>

          {/* ✅ যদি তোমার context এ favorite item object থাকে—Cart style cards */}
          {list.length ? (
            <div className="favList">
              {list.map((x, idx) => {
                const id = x?.productId || x?._id || x?.id;
                const title = x?.title || x?.name || "Product";
                const price = Number(x?.price) || 0;
                const img =
                  x?.images?.[0] ||
                  x?.image ||
                  x?.thumb ||
                  "https://via.placeholder.com/320x240?text=Product";

                return (
                  <div className="favItem" key={id || `${title}-${idx}`}>
                    <Link to={id ? `/product/${id}` : "#"} className="favThumb">
                      <img
                        src={img}
                        alt={title}
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.src = "https://via.placeholder.com/320x240?text=Product";
                        }}
                      />
                    </Link>

                    <div className="favInfo">
                      <Link to={id ? `/product/${id}` : "#"} className="favItemTitle">
                        {title}
                      </Link>

                      <div className="favPrice">{formatBDT(price)}</div>

                      <div className="favBtns">
                        <Link to={id ? `/product/${id}` : "#"} className="favViewBtn">
                          View
                        </Link>

                        <button
                          type="button"
                          className="favRemoveBtn"
                          onClick={() => id && doRemove(String(id))}
                          disabled={!id}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            // ✅ যদি item object না থাকে (শুধু favIds থাকে)
            <div className="favEmpty">
              Favorites loaded, but product details not found in context.
              <br />
              (Only IDs stored: {favIds.length})
            </div>
          )}
        </>
      )}
    </div>
  );
}