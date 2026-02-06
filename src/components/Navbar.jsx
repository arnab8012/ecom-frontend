import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.png";

export default function Navbar() {
  const nav = useNavigate();
  const { pathname } = useLocation();
  const { user } = useAuth();

  // ✅ admin pages এ navbar দেখাবে না
  if (pathname.startsWith("/admin")) return null;

  const [lang, setLang] = useState(() => localStorage.getItem("lang") || "en");
  useEffect(() => localStorage.setItem("lang", lang), [lang]);

  const [q, setQ] = useState("");
  const doSearch = (e) => {
    e.preventDefault();
    const text = q.trim();
    if (!text) return;
    nav(`/shop?q=${encodeURIComponent(text)}`);
  };

  return (
    <header className="navSolid">
      <div className="navSolidInner">
        <Link className="navBrand" to="/" aria-label="Home">
          <img className="navLogo" src={logo} alt="The Curious Empire" />
          <span className="navTitle">The Curious Empire</span>
        </Link>

        <form className="navSearch" onSubmit={doSearch} role="search">
          <input
            className="navSearchInput"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={lang === "bn" ? "পণ্য খুঁজুন..." : "Search products"}
          />
          <button className="navSearchBtn" type="submit" aria-label="Search">
            🔍
          </button>
        </form>

        <button
          className="navLang"
          type="button"
          onClick={() => setLang((x) => (x === "en" ? "bn" : "en"))}
        >
          {lang === "en" ? "EN" : "BN"}
        </button>
      </div>
    </header>
  );
}