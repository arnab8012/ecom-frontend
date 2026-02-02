import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useFavorites } from "../context/FavoritesContext";

export default function BottomNav() {
  const { user } = useAuth();
  const { items } = useCart();
  const fav = useFavorites();
  const loc = useLocation();

  const cartCount = items.reduce((s, x) => s + (x.qty || 0), 0);
  const favCount = Array.isArray(fav?.favIds) ? fav.favIds.length : 0;

  const active = (path) => (loc.pathname === path ? "bnItem active" : "bnItem");

  return (
    <div className="bottomNav">
      <Link className={active("/")} to="/">
        <div className="bnIcon">🏠</div>
        <div className="bnTxt">Home</div>
      </Link>

      <Link className={active("/shop")} to="/shop">
        <div className="bnIcon">🛍️</div>
        <div className="bnTxt">Shop</div>
      </Link>

      <Link className={active("/cart")} to="/cart">
        <div className="bnIcon">
          🛒
          {cartCount > 0 && <span className="bnBadge">{cartCount}</span>}
        </div>
        <div className="bnTxt">Cart</div>
      </Link>

      {user ? (
        <Link className={active("/favorites")} to="/favorites">
          <div className="bnIcon">
            ❤️
            {favCount > 0 && <span className="bnBadge">{favCount}</span>}
          </div>
          <div className="bnTxt">Priyo</div>
        </Link>
      ) : (
        <Link className={active("/login")} to="/login">
          <div className="bnIcon">🔑</div>
          <div className="bnTxt">Login</div>
        </Link>
      )}
    </div>
  );
}