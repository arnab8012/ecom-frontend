import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useMemo, useState } from "react";

export default function Navbar() {
  const nav = useNavigate();
  const { pathname } = useLocation();
  const { user } = useAuth();

  if (pathname.startsWith("/admin")) return null;

  const [lang, setLang] = useState(() => localStorage.getItem("lang") || "en");
  useEffect(() => localStorage.setItem("lang", lang), [lang]);

  const t = useMemo(() => {
    const dict = {
      en: { ph: "Search products..." },
      bn: { ph: "পণ্য খুঁজুন..." },
    };
    return dict[lang] || dict.en;
  }, [lang]);

  const [q, setQ] = useState("");

  const doSearch = (e) => {
    e.preventDefault();
    const text = q.trim();
    if (!text) return;
    nav(`/shop?q=${encodeURIComponent(text)}`);
  };

  return (
    <header className="topbar">
      <div className="topbarInner">
        {/* Brand */}
        <Link className="topBrand" to="/">
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
          <button className="topSearchBtn" type="submit" aria-label="search">
            🔍
          </button>
        </form>

        {/* Right side */}
        <div className="topRight">
          <button
            className="topLang"
            type="button"
            onClick={() => setLang((x) => (x === "en" ? "bn" : "en"))}
            title="Language"
          >
            {lang === "en" ? "EN" : "BN"}
          </button>

          <button
            className="profileCircle"
            type="button"
            onClick={() => nav(user ? "/profile" : "/login")}
            title={user ? "Profile" : "Login"}
          >
            {user ? "👤" : "🔑"}
          </button>
        </div>
      </div>
    </header>
  );
}