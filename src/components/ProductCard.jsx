import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useMemo, useState } from "react";

export default function Navbar() {
  const nav = useNavigate();
  const { pathname } = useLocation();
  const { user } = useAuth();

  // ✅ Hide navbar on admin pages
  if (pathname.startsWith("/admin")) return null;

  const [lang, setLang] = useState(() => localStorage.getItem("lang") || "en");
  useEffect(() => localStorage.setItem("lang", lang), [lang]);

  const t = useMemo(() => {
    const dict = {
      en: { search: "Search", ph: "Search products..." },
      bn: { search: "খুঁজুন", ph: "পণ্য খুঁজুন..." },
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

  const LOGO = "/logo.png";

  return (
    <div className="nav premiumNav">
      <Link className="brand premiumBrand" to="/">
        <img
          src={LOGO}
          alt="logo"
          className="brandLogo"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
        <span className="brandTxt">The Curious Empire</span>
      </Link>

      <form className="navSearchWrap premiumSearch" onSubmit={doSearch}>
        <input
          className="navSearch premiumSearchInput"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={t.ph}
        />
        <button className="navSearchBtn premiumSearchBtn" type="submit">
          {t.search}
        </button>
      </form>

      <div className="navRight premiumRight">
        <button
          className="langBtn premiumLang"
          type="button"
          onClick={() => setLang((x) => (x === "en" ? "bn" : "en"))}
          title="Language"
        >
          {lang === "en" ? "EN" : "BN"}
        </button>

        {user ? (
          <button type="button" className="navIconBtn" title="Profile" onClick={() => nav("/profile")}>
            👤
          </button>
        ) : (
          <button type="button" className="navIconBtn" title="Login" onClick={() => nav("/login")}>
            🔑
          </button>
        )}
      </div>
    </div>
  );
}