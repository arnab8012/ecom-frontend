import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.png";

export default function Navbar() {
  const nav = useNavigate();
  const { pathname } = useLocation();
  const { user } = useAuth();

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
        <Link to="/" className="navSolidBrand" aria-label="Home">
          <img src={logo} alt="The Curious Empire" />
        </Link>

        <form className="navSolidSearch" onSubmit={doSearch} role="search">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={lang === "bn" ? "পণ্য খুঁজুন..." : "Search products"}
          />
          <button type="submit" aria-label="Search">🔍</button>
        </form>

        <button
          className="navSolidLang"
          type="button"
          onClick={() => setLang((x) => (x === "en" ? "bn" : "en"))}
        >
          {lang.toUpperCase()}
        </button>
      </div>
    </header>
  );
}