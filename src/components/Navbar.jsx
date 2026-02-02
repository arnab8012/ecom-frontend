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

  // ✅ Hide navbar on admin pages (optional)
  if (pathname.startsWith("/admin")) return null;

  const favCount = Array.isArray(fav?.favIds) ? fav.favIds.length : 0;
  const cartCount = Array.isArray(items) ? items.reduce((s, x) => s + (x.qty || 0), 0) : 0;

  // ✅ language
  const [lang, setLang] = useState(() => localStorage.getItem("lang") || "en");
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

  // ✅ active helper (nested routes friendly)
  const isActive = (to) => (to === "/" ? pathname === "/" : pathname.startsWith(to));

  // ✅ Brand logo (replace with your image url / import)
  // option-1: put file in /public/logo.png then use "/logo.png"
  const LOGO = "/logo.png";

  return (
    <div className="nav glassNav">
      {/* ✅ Brand (image) */}
      <Link className="brand" to="/" style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {/* যদি logo না থাকে, img remove করে E-COM লিখে দাও */}
        <img
          src={LOGO}
          alt="logo"
          style={{ width: 36, height: 36, borderRadius: 10, objectFit: "cover" }}
          onError={(e) => {
            // fallback: hide broken image
            e.currentTarget.style.display = "none";
          }}
        />
        <span style={{ fontWeight: 900, color: "#111" }}>The Curious Empire</span>
      </Link>

      {/* ✅ Search on navbar */}
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
        <Link className={`navItem ${isActive("/") ? "active" : ""}`} to="/">
          <span className="navIcon">🏠</span>
          <span>{t.home}</span>
        </Link>

        <Link className={`navItem ${isActive("/cart") ? "active" : ""}`} to="/cart">
          <span className="navIcon">🛒</span>
          <span>
            {t.cart} ({cartCount})
          </span>
        </Link>

        {user ? (
          <>
            <Link className={`navItem ${isActive("/favorites") ? "active" : ""}`} to="/favorites">
              <span className="navIcon">❤️</span>
              <span>
                {t.priyo} ({favCount})
              </span>
            </Link>

            <Link className={`navItem ${isActive("/profile") ? "active" : ""}`} to="/profile">
              <span className="navIcon">👤</span>
              <span>{t.profile}</span>
            </Link>
          </>
        ) : (
          <Link className={`navItem ${isActive("/login") ? "active" : ""}`} to="/login">
            <span className="navIcon">🔑</span>
            <span>{t.login}</span>
          </Link>
        )}
      </div>
    </div>
  );
}