import { Link, useLocation, useNavigate } from "react-router-dom";
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

  const favCount = Array.isArray(fav?.favIds) ? fav.favIds.length : 0;
  const cartCount = items.reduce((s, x) => s + (x.qty || 0), 0);

  // ✅ language
  const [lang, setLang] = useState(localStorage.getItem("lang") || "en");
  useEffect(() => localStorage.setItem("lang", lang), [lang]);

  const t = useMemo(() => {
    const dict = {
      en: { home: "Home", cart: "Cart", priyo: "Priyo", profile: "Profile", login: "Login" },
      bn: { home: "হোম", cart: "কার্ট", priyo: "প্রিয়", profile: "প্রোফাইল", login: "লগইন" },
    };
    return dict[lang] || dict.en;
  }, [lang]);

  // ✅ navbar search (go shop)
  const [q, setQ] = useState("");
  const doSearch = (e) => {
    e.preventDefault();
    const text = q.trim();
    if (!text) return;
    nav(`/shop?q=${encodeURIComponent(text)}`);
  };

  return (
    <div className="nav glassNav">
      <Link className="brand" to="/">
        E-COM
      </Link>

      {/* ✅ Search on TOP border (navbar) */}
      <form className="navSearchWrap" onSubmit={doSearch}>
        <input
          className="navSearch"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={lang === "bn" ? "পণ্য খুঁজুন..." : "Search products..."}
        />
        <button className="navSearchBtn" type="submit">
          {lang === "bn" ? "খুঁজুন" : "Search"}
        </button>
      </form>

      <div className="navRight">
        {/* ✅ Language Toggle */}
        <button
          className="langBtn"
          type="button"
          onClick={() => setLang((x) => (x === "en" ? "bn" : "en"))}
          title="Language"
        >
          {lang === "en" ? "EN" : "BN"}
        </button>

        <span className="navDivider" />

        {/* ✅ Icon menu */}
        <Link className={`navItem ${pathname === "/" ? "active" : ""}`} to="/">
          <span className="navIcon">🏠</span>
          <span>{t.home}</span>
        </Link>

        <Link className={`navItem ${pathname === "/cart" ? "active" : ""}`} to="/cart">
          <span className="navIcon">🛒</span>
          <span>
            {t.cart} ({cartCount})
          </span>
        </Link>

        {user ? (
          <>
            <Link className={`navItem ${pathname === "/favorites" ? "active" : ""}`} to="/favorites">
              <span className="navIcon">❤️</span>
              <span>
                {t.priyo} ({favCount})
              </span>
            </Link>

            <Link className={`navItem ${pathname === "/profile" ? "active" : ""}`} to="/profile">
              <span className="navIcon">👤</span>
              <span>{t.profile}</span>
            </Link>
          </>
        ) : (
          <Link className={`navItem ${pathname === "/login" ? "active" : ""}`} to="/login">
            <span className="navIcon">🔑</span>
            <span>{t.login}</span>
          </Link>
        )}
      </div>
    </div>
  );
}
