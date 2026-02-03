import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useFavorites } from "../context/FavoritesContext";
import { useEffect, useMemo, useState } from "react";

export default function Navbar() {
  const nav = useNavigate();
  const { pathname } = useLocation();

  const { user } = useAuth();
  const { items } = useCart();
  const fav = useFavorites();

  // ✅ Hide navbar on admin pages
  if (pathname.startsWith("/admin")) return null;

  const favCount = Array.isArray(fav?.favIds) ? fav.favIds.length : 0;
  const cartCount = Array.isArray(items)
    ? items.reduce((s, x) => s + (x.qty || 0), 0)
    : 0;

  // ✅ language
  const [lang, setLang] = useState(() => localStorage.getItem("lang") || "en");
  useEffect(() => localStorage.setItem("lang", lang), [lang]);

  const t = useMemo(() => {
    const dict = {
      en: { home: "Home", shop: "Shop", cart: "Cart", priyo: "Priyo", profile: "Profile", login: "Login" },
      bn: { home: "হোম", shop: "শপ", cart: "কার্ট", priyo: "প্রিয়", profile: "প্রোফাইল", login: "লগইন" },
    };
    return dict[lang] || dict.en;
  }, [lang]);

  // ✅ search
  const [q, setQ] = useState("");
  const doSearch = (e) => {
    e.preventDefault();
    if (!q.trim()) return;
    nav(`/shop?q=${encodeURIComponent(q.trim())}`);
  };

  const LOGO = "/logo.png";

  return (
    <div className="nav glassNav">
      {/* Brand */}
      <Link className="brand" to="/" style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <img
          src={LOGO}
          alt="logo"
          style={{ width: 36, height: 36, borderRadius: 10 }}
          onError={(e) => (e.currentTarget.style.display = "none")}
        />
        <span style={{ fontWeight: 900 }}>The Curious Empire</span>
      </Link>

      {/* Search */}
      <form className="navSearchWrap" onSubmit={doSearch}>
        <input
          className="navSearch"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={lang === "bn" ? "পণ্য খুঁজুন..." : "Search products..."}
        />
        <button className="navSearchBtn">Search</button>
      </form>

      {/* Menu links (no hamburger) */}
      <div className="navLinks">
        <NavLink to="/">{t.home}</NavLink>
        <NavLink to="/shop">{t.shop}</NavLink>
        <NavLink to="/cart">
          {t.cart} {cartCount > 0 && `(${cartCount})`}
        </NavLink>
        <NavLink to="/favorites">
          {t.priyo} {favCount > 0 && `(${favCount})`}
        </NavLink>
        <NavLink to={user ? "/profile" : "/login"}>
          {user ? t.profile : t.login}
        </NavLink>

        <button
          className="langBtn"
          onClick={() => setLang((x) => (x === "en" ? "bn" : "en"))}
        >
          {lang === "en" ? "BN" : "EN"}
        </button>
      </div>
    </div>
  );
}