import { NavLink, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useFavorites } from "../context/FavoritesContext";
import { useAuth } from "../context/AuthContext";

export default function BottomNav() {
  const { items } = useCart();
  const { favIds } = useFavorites();
  const { user } = useAuth();
  const loc = useLocation();

  // ✅ Admin pages এ bottom nav hide (চাইলে)
  if (loc.pathname.startsWith("/admin")) return null;

  const cartCount = (items || []).reduce((s, x) => s + (x.qty || 0), 0);
  const favCount = Array.isArray(favIds) ? favIds.length : 0;

  return (
    <div className="bottomNav">
      <NavLink to="/" className={({ isActive }) => (isActive ? "bnItem active" : "bnItem")}>
        <span className="bnIcon">🏠</span>
        <span className="bnText">Home</span>
      </NavLink>

      <NavLink to="/shop" className={({ isActive }) => (isActive ? "bnItem active" : "bnItem")}>
        <span className="bnIcon">🛍️</span>
        <span className="bnText">Shop</span>
      </NavLink>

      <div className="bnDivider" />

      <NavLink to="/cart" className={({ isActive }) => (isActive ? "bnItem active" : "bnItem")}>
        <span className="bnIcon">
          🛒
          {cartCount > 0 ? <i className="bnBadge">{cartCount}</i> : null}
        </span>
        <span className="bnText">Cart</span>
      </NavLink>

      <NavLink to="/favorites" className={({ isActive }) => (isActive ? "bnItem active" : "bnItem")}>
        <span className="bnIcon">
          ❤️
          {favCount > 0 ? <i className="bnBadge">{favCount}</i> : null}
        </span>
        <span className="bnText">Priyo</span>
      </NavLink>

      <NavLink
        to={user ? "/profile" : "/login"}
        className={({ isActive }) => (isActive ? "bnItem active" : "bnItem")}
      >
        <span className="bnIcon">👤</span>
        <span className="bnText">{user ? "Profile" : "Login"}</span>
      </NavLink>
    </div>
  );
}