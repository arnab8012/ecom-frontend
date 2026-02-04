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
        {/* Left: brand (optional small) */}
        <Link to="/" className="topBrand" aria-label="home">
          <span className="topBrandDot" />
        </Link>

        {/* Center: pill search */}
        <form className="pillSearch" onSubmit={doSearch}>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t.ph}
            aria-label="search"
          />
          <button type="submit" aria-label="search-btn">
            🔍
          </button>
        </form>

        {/* Right: EN + profile */}
        <button
          type="button"
          className="langCircle"
          onClick={() => setLang((x) => (x === "en" ? "bn" : "en"))}
          title="Language"
        >
          {lang === "en" ? "EN" : "BN"}
        </button>

        <button
          type="button"
          className="keyCircle"
          onClick={() => nav(user ? "/profile" : "/login")}
          title={user ? "Profile" : "Login"}
        >
          {user ? "👤" : "🔑"}
        </button>
      </div>
    </header>
  );
}