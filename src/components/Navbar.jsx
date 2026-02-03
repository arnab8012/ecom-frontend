import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useFavorites } from "../context/FavoritesContext";
import { useEffect, useMemo, useRef, useState } from "react";
import MobileMenu from "./MobileMenu";

export default function Navbar() {
  const nav = useNavigate();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  const { user } = useAuth();
  const { items } = useCart();
  const fav = useFavorites();

  // ✅ Hide navbar on admin pages
  if (pathname.startsWith("/admin")) return null;

  const favCount = Array.isArray(fav?.favIds) ? fav.favIds.length : 0;
  const cartCount = Array.isArray(items) ? items.reduce((s, x) => s + (x.qty || 0), 0) : 0;

  // ✅ language
  const [lang, setLang] = useState(() => localStorage.getItem("lang") || "en");
  useEffect(() => localStorage.setItem("lang", lang), [lang]);

  const t = useMemo(() => {
    const dict = {
      en: { home: "Home", shop: "Shop", cart: "Cart", priyo: "Priyo", profile: "Profile", login: "Login", language: "Language" },
      bn: { home: "হোম", shop: "শপ", cart: "কার্ট", priyo: "প্রিয়", profile: "প্রোফাইল", login: "লগইন", language: "ভাষা" },
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

 

  // outside click -> close
  useEffect(() => {
    const onDown = (e) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  // Esc -> close
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // close menu on route change
  useEffect(() => setOpen(false), [pathname]);

  const LOGO = "/logo.png";

  return (
    <div className="nav glassNav">
      {/* ✅ Brand */}
      <Link className="brand" to="/" style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <img
          src={LOGO}
          alt="logo"
          style={{ width: 36, height: 36, borderRadius: 10, objectFit: "cover" }}
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
        <span style={{ fontWeight: 900, color: "#111" }}>The Curious Empire</span>
      </Link>
return (
    <>
      <button onClick={() => setOpen(true)}>☰</button>
      <MobileMenu open={open} onClose={() => setOpen(false)} />
    </>
  );
}

      {/* ✅ Search */}
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

      
        {open && (
          <div className="menuDrop glass">
            {/* ✅ Language row */}
            <div className="menuLangRow">
              <span className="menuLangTxt">{t.language}</span>
              <button
                className="langBtn"
                type="button"
                onClick={() => setLang((x) => (x === "en" ? "bn" : "en"))}
                title="Language"
              >
                {lang === "en" ? "EN" : "BN"}
              </button>
            </div>

            <div className="menuGrid">
              <NavLink to="/" className={({ isActive }) => (isActive ? "mItem active" : "mItem")}>
                <span className="mIcon">🏠</span>
                <span className="mTxt">{t.home}</span>
              </NavLink>

              <NavLink to="/shop" className={({ isActive }) => (isActive ? "mItem active" : "mItem")}>
                <span className="mIcon">🛍️</span>
                <span className="mTxt">{t.shop}</span>
              </NavLink>

              <NavLink to="/cart" className={({ isActive }) => (isActive ? "mItem active" : "mItem")}>
                <span className="mIcon">
                  🛒
                  {cartCount > 0 ? <i className="mBadge">{cartCount}</i> : null}
                </span>
                <span className="mTxt">{t.cart}</span>
              </NavLink>

              <NavLink to="/favorites" className={({ isActive }) => (isActive ? "mItem active" : "mItem")}>
                <span className="mIcon">
                  ❤️
                  {favCount > 0 ? <i className="mBadge">{favCount}</i> : null}
                </span>
                <span className="mTxt">{t.priyo}</span>
              </NavLink>

              <NavLink
                to={user ? "/profile" : "/login"}
                className={({ isActive }) => (isActive ? "mItem active" : "mItem")}
              >
                <span className="mIcon">👤</span>
                <span className="mTxt">{user ? t.profile : t.login}</span>
              </NavLink>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}