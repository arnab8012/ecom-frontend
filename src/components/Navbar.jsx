import "../styles/navbar.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import logo from "../assets/logo.png";

export default function Navbar() {
  const nav = useNavigate();
  const { pathname } = useLocation();

  // ❌ Admin panel এ navbar দেখাবে না
  if (pathname.startsWith("/admin")) return null;

  const [q, setQ] = useState("");

  const doSearch = (e) => {
    e.preventDefault();
    const v = q.trim();
    if (!v) return;
    nav(`/shop?q=${encodeURIComponent(v)}`);
  };

  return (
    <header className="topbar">
      <div className="topbarInner">
        {/* LEFT: LOGO */}
        <Link to="/" className="topBrand" aria-label="Go to home">
          <img src={logo} alt="The Curious Empire" className="topLogo" loading="eager" />
        </Link>

        {/* MIDDLE: TEXT (logo-search gap) */}
        <div className="topMidText" aria-label="Brand tagline">
          <div className="topMidTitle">The Curious Empire</div>
          <div className="topMidSub">Premium Shopping Experience</div>
        </div>

        {/* RIGHT: SEARCH */}
        <form className="topSearch" onSubmit={doSearch} role="search" aria-label="Search products">
          <div className="topSearchBox">
            <input
              className="topSearchInput"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search"
              autoComplete="off"
              inputMode="search"
            />
            <button className="topSearchBtn" type="submit" aria-label="Search">
              🔍
            </button>
          </div>
        </form>
      </div>
    </header>
  );
}