import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import logo from "../assets/logo.png";
import { useLanguage } from "../context/LanguageContext";

export default function Navbar() {
  const nav = useNavigate();
  const { pathname } = useLocation();
  const { lang } = useLanguage();

  // ❌ Admin panel এ navbar দেখাবে না
  if (pathname.startsWith("/admin")) return null;

  const [q, setQ] = useState("");

  const doSearch = (e) => {
    e.preventDefault();
    if (!q.trim()) return;
    nav(`/shop?q=${encodeURIComponent(q.trim())}`);
  };

  return (
    <header className="topbar">
      <div className="topbarInner">
        {/* BRAND */}
        <Link to="/" className="topBrand">
          <img
            src={logo}
            alt="The Curious Empire"
            className="topLogo"
            loading="eager"
          />
          <span className="topTitle">The Curious Empire</span>
        </Link>

        {/* SEARCH */}
        <form className="topSearch" onSubmit={doSearch}>
          <input
            className="topSearchInput"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={lang === "bn" ? "পণ্য খুঁজুন..." : "Search products"}
          />
          <button className="topSearchBtn" type="submit">🔍</button>
        </form>
      </div>
    </header>
  );
}