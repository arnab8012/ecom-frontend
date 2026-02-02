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

  const cartCount = items.reduce((s, x) => s + (x.qty || 0), 0);
  const favCount = Array.isArray(fav?.favIds) ? fav.favIds.length : 0;

  /* ✅ language */
  const [lang, setLang] = useState(localStorage.getItem("lang") || "en");
  useEffect(() => localStorage.setItem("lang", lang), [lang]);

  const t = useMemo(() => {
    const dict = {
      en: { home: "Home", cart: "Cart", fav: "Favorite", login: "Login", profile: "Profile" },
      bn: { home: "হোম", cart: "কার্ট", fav: "প্রিয়", login: "লগইন", profile: "প্রোফাইল" },
    };
    return dict[lang];
  }, [lang]);

  /* ✅ search */
  const [q, setQ] = useState("");
  const doSearch = (e) => {
    e.preventDefault();
    if (!q.trim()) return;
    nav(`/shop?q=${encodeURIComponent(q)}`);
    setOpen(false);
  };

  /* ✅ hamburger menu */
  const [open, setOpen] = useState(false);

  // ❌ admin page এ navbar hide
  if (pathname.startsWith("/admin")) return null;

  return (
    <div className="nav glassNav">
      {/* Logo */}
      <Link className="brand" to="/">
        <img src="/logo.png" alt="logo" height="28" />
      </Link>

      {/* Search */}
      <form className="navSearchWrap" onSubmit={doSearch}>
        <input
          className="navSearch"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={lang === "bn" ? "পণ্য খুঁজুন..." : "Search products..."}
        />
      </form>

      {/* ☰ Menu button */}
      <button className="menuBtn" onClick={() => setOpen((x) => !x)}>
        ☰
      </button>

      {/* Dropdown menu */}
      {open && (
        <div className="menuDrop glass">
          <Link onClick={() => setOpen(false)} to="/">
            🏠 {t.home}
          </Link>

          <Link onClick={() => setOpen(false)} to="/cart">
            🛒 {t.cart} ({cartCount})
          </Link>

          {user ? (
            <>
              <Link onClick={() => setOpen(false)} to="/favorites">
                ❤️ {t.fav} ({favCount})
              </Link>
              <Link onClick={() => setOpen(false)} to="/profile">
                👤 {t.profile}
              </Link>
            </>
          ) : (
            <Link onClick={() => setOpen(false)} to="/login">
              🔑 {t.login}
            </Link>
          )}

          <hr />

          <button
            className="langBtn"
            onClick={() => setLang((l) => (l === "en" ? "bn" : "en"))}
          >
            🌐 {lang === "en" ? "বাংলা" : "English"}
          </button>
        </div>
      )}
    </div>
  );
}