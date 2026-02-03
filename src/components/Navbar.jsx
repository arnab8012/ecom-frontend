import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useMemo, useState } from "react";

export default function Navbar() {
  const nav = useNavigate();
  const { pathname } = useLocation();
  const { user } = useAuth();

  // ✅ Hide navbar on admin pages (optional)
  if (pathname.startsWith("/admin")) return null;

  // ✅ language
  const [lang, setLang] = useState(() => localStorage.getItem("lang") || "en");
  useEffect(() => localStorage.setItem("lang", lang), [lang]);

  const t = useMemo(() => {
    const dict = {
      en: { ph: "Search products...", search: "Search" },
      bn: { ph: "পণ্য খুঁজুন...", search: "Search" },
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

  const LOGO = "/logo.png";

  return (
    <header className="topbar">
      <div className="topbarInner">
        {/* ✅ Brand */}
        <Link className="topBrand" to="/">
          <img
            className="topLogo"
            src={LOGO}
            alt="logo"
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
          <span className="topTitle">The Curious Empire</span>
        </Link>

        {/* ✅ Small search */}
        <form className="topSearch" onSubmit={doSearch}>
          <input
            className="topSearchInput"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t.ph}
          />
          <button className="topSearchBtn" type="submit" aria-label="search">
            🔍
          </button>
        </form>

        {/* ✅ Right side: language + profile/login icon */}
        <div className="topRight">
          <button
            className="topLang"
            type="button"
            onClick={() => setLang((x) => (x === "en" ? "bn" : "en"))}
            title="Language"
          >
            {lang === "en" ? "EN" : "BN"}
          </button>

          <Link className="topAvatarBtn" to={user ? "/profile" : "/login"} title="Account">
            <span className="topAvatarCircle">{user ? "👤" : "🔑"}</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
