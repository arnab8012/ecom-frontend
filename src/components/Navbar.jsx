import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useMemo, useState } from "react";

export default function Navbar() {
  const nav = useNavigate();
  const { pathname } = useLocation();
  const { user } = useAuth();

  // hide on admin
  if (pathname.startsWith("/admin")) return null;

  // language
  const [lang, setLang] = useState(() => localStorage.getItem("lang") || "en");
  useEffect(() => {
    localStorage.setItem("lang", lang);
  }, [lang]);

  const t = useMemo(() => {
    return (
      {
        en: { ph: "Search products..." },
        bn: { ph: "পণ্য খুঁজুন..." },
      }[lang] || { ph: "Search products..." }
    );
  }, [lang]);

  const [q, setQ] = useState("");

  const doSearch = (e) => {
    e.preventDefault();
    const text = q.trim();
    if (!text) return;
    nav(`/shop?q=${encodeURIComponent(text)}`);
  };

  const LOGO = "/logo.png";

  return (
    <header className="topbar">
      <div className="topbarInner">
        {/* Brand */}
        <Link to="/" className="topBrand">
          <img
            className="topLogo"
            src={LOGO}
            alt="logo"
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
          <span className="topTitle">The Curious Empire</span>
        </Link>

        {/* Search */}
        <form className="topSearch" onSubmit={doSearch}>
          <input
            className="topSearchInput"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t.ph}
          />
          <button type="submit" className="topSearchBtn" aria-label="search">
            🔍
          </button>
        </form>

        {/* Right */}
        <div className="topRight">
          <button
            type="button"
            className="topLang"
            onClick={() => setLang(lang === "en" ? "bn" : "en")}
            title="Language"
          >
            {lang === "en" ? "EN" : "BN"}
          </button>

          <Link
            to={user ? "/profile" : "/login"}
            className="topAvatarBtn"
            title={user ? "Profile" : "Login"}
          >
            <span className="topAvatarCircle">{user ? "👤" : "🔑"}</span>
          </Link>
        </div>
      </div>
    </header>
  );
}