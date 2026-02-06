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
    if (!q.trim()) return;
    nav(`/shop?q=${encodeURIComponent(q.trim())}`);
  };

  return (
    <header className="navGlass">
      <div className="navInner">

        <Link to="/" className="navBrand">
          <img src={logo} alt="The Curious Empire" />
        </Link>

        <form className="navSearch" onSubmit={doSearch}>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={lang === "bn" ? "পণ্য খুঁজুন" : "Search products"}
          />
          <button type="submit">🔍</button>
        </form>

        <button
          className="navLang"
          onClick={() => setLang((l) => (l === "en" ? "bn" : "en"))}
        >
          {lang.toUpperCase()}
        </button>

      </div>
    </header>
  );
}