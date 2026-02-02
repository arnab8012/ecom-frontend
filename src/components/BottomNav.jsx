import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useFavorites } from "../context/FavoritesContext";

export default function BottomNav() {
  const { pathname } = useLocation();
  const { user } = useAuth();
  const { items } = useCart();
  const fav = useFavorites();

  // ❌ admin page এ hide
  if (pathname.startsWith("/admin")) return null;

  const cartCount = Array.isArray(items)
    ? items.reduce((s, x) => s + (x.qty || 0), 0)
    : 0;

  const favCount = Array.isArray(fav?.favIds) ? fav.favIds.length : 0;

  const active = (to) =>
    to === "/" ? pathname === "/" : pathname.startsWith(to);

  return (
    <div className="bottomNav">
      <Link className={`bItem ${active("/") ? "active" : ""}`} to="/">
        <span className="bIcon">🏠</span>
        <span>Home</span>
      </Link>

      <Link className={`bItem ${active("/shop") ? "active" : ""}`} to="/shop">
        <span className="bIcon">🛍️</span>
        <span>Shop</span>
      </Link>

      <Link className={`bItem ${active("/cart") ? "active" : ""}`} to="/cart">
        <span className="bIcon">🛒</span>
        <span>Cart ({cartCount})</span>
      </Link>

      {user ? (
        <>
          <Link
            className={`bItem ${active("/favorites") ? "active" : ""}`}
            to="/favorites"
          >
            <span className="bIcon">❤️</span>
            <span>Fav ({favCount})</span>
          </Link>

          <Link
            className={`bItem ${active("/profile") ? "active" : ""}`}
            to="/profile"
          >
            <span className="bIcon">👤</span>
            <span>Profile</span>
          </Link>
        </>
      ) : (
        <Link
          className={`bItem ${active("/login") ? "active" : ""}`}
          to="/login"
        >
          <span className="bIcon">🔑</span>
          <span>Login</span>
        </Link>
      )}
    </div>
  );
}