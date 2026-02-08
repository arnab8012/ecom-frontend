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
    <header className="topbar" role="banner">
      <div className="topbarInner">

        {/* =====================
            BRAND LOGO
        ===================== */}
        <Link
          to="/"
          className="topBrand"
          aria-label="Go to homepage"
        >
          <img
            src={logo}
            alt="The Curious Empire"
            className="topLogo"
            loading="eager"
          />
        </Link>

        {/* =====================
            BRAND TEXT (IMAGE STYLE)
        ===================== */}
        <div className="brandTextWrap">
          <span className="brandTextMain">
            The Curious Empire
          </span>
          <span className="brandTextSub">
            Premium Shopping Experience
          </span>
        </div>

        {/* =====================
            SEARCH
        ===================== */}
        <form
          className="topSearch"
          onSubmit={doSearch}
          role="search"
          aria-label="Search products"
        >
          <div className="topSearchBox">
            <input
              className="topSearchInput"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search"
              autoComplete="off"
              inputMode="search"
              aria-label="Search products"
            />
            <button
              className="topSearchBtn"
              type="submit"
              aria-label="Search"
            >
              🔍
            </button>
          </div>
        </form>

      </div>
    </header>
  );
}