import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const nav = useNavigate();
  const { pathname } = useLocation();
  const { user } = useAuth();

  // ✅ Hide navbar on admin pages
  if (pathname.startsWith("/admin")) return null;

  // ✅ language
  const [lang, setLang] = useState(() => localStorage.getItem("lang") || "en");
  useEffect(() => localStorage.setItem("lang", lang), [lang]);

  // ✅ navbar search (go shop)
  const [q, setQ] = useState("");
  const doSearch = (e) => {
    e.preventDefault();
    const text = q.trim();
    if (!text) return;
    nav(`/shop?q=${encodeURIComponent(text)}`);
  };

  const avatarLink = user ? "/profile" : "/login";
  const avatarIcon = user ? "👤" : "🔑";

  const LOGO = "/logo.png";

  return (
    <div className="topbar">
      <div className="topbarInner">
        {/* Brand */}
        <Link className="topBrand" to="/">
          <img className="topLogo" src={LOGO} alt="logo" onError={(e) => (e.currentTarget.style.display = "none")} />
          <span className="topTitle">The Curious Empire</span>
        </Link>

        {/* Search */}
        <form className="topSearch" onSubmit={doSearch}>
          <input
            className="topSearchInput"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={lang === "bn" ? "পণ্য খুঁজুন..." : "Search products..."}
          />
          <button className="topSearchBtn" type="submit" aria-label="search">
            🔍
          </button>
        </form>

        {/* Right */}
        <div className="topRight">
          <button
            className="topLang"
            type="button"
            onClick={() => setLang((x) => (x === "en" ? "bn" : "en"))}
            title="Language"
          >
            {lang === "en" ? "EN" : "BN"}
          </button>

          <Link className="topAvatarBtn" to={avatarLink} title="Account">
            <div className="topAvatarCircle">{avatarIcon}</div>
          </Link>
        </div>
      </div>
    </div>
  );
}