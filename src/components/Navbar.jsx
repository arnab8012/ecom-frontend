import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import logo from "../assets/logo.png";

export default function Navbar() {
  const { pathname } = useLocation();
  const nav = useNavigate();
  const [q, setQ] = useState("");

  if (pathname.startsWith("/admin")) return null;

  const onSearch = (e) => {
    e.preventDefault();
    if (!q.trim()) return;
    nav(`/shop?q=${encodeURIComponent(q.trim())}`);
  };

  return (
    <header className="topbar">
      <div className="topbarInner">
        {/* LOGO */}
        <Link to="/" className="topBrand">
          <img src={logo} alt="The Curious Empire" />
          <span>The Curious Empire</span>
        </Link>

        {/* SEARCH */}
        <form className="topSearch" onSubmit={onSearch}>
          <input
            placeholder="Search products"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <button type="submit">🔍</button>
        </form>

        {/* LANG */}
        <button className="langBtn">EN</button>
      </div>
    </header>
  );
}