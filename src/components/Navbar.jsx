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
    <header className="topbar">
      <div className="topbarInner">
        <Link className="topBrand" to="/" aria-label="Home">
          <img className="topLogo" src={logo} alt="The Curious Empire" />
          <span className="topTitle">The Curious Empire</span>
        </Link>

        <form className="topSearch" onSubmit={doSearch} role="search">
          <div className="topSearchBox">
            <input
              className="topSearchInput"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={lang === "bn" ? "পণ্য খুঁজুন..." : "Search products..."}
            />
            <button className="topSearchBtn" type="submit" aria-label="Search">
              🔍
            </button>
          </div>
        </form>

        <div className="topRight">
          <button
            className="topLang"
            type="button"
            onClick={() => setLang((x) => (x === "en" ? "bn" : "en"))}
          >
            {lang === "en" ? "EN" : "BN"}
          </button>
        </div>
      </div>
    </header>
  );
}