import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useMemo, useState } from "react";

export default function Navbar() {
  const nav = useNavigate();
  const { pathname } = useLocation();
  const { user } = useAuth();

  // ✅ Hide navbar on admin pages
  if (pathname.startsWith("/admin")) return null;

  // ✅ language
  const [lang, setLang] = useState(() => localStorage.getItem("lang") || "en");
  useEffect(() => localStorage.setItem("lang", lang), [lang]);

  const t = useMemo(() => {
    const dict = {
      en: { ph: "Search products..." },
      bn: { ph: "পণ্য খুঁজুন..." },
    };
    return dict[lang] || dict.en;
  }, [lang]);

  // ✅ search
  const [q, setQ] = useState("");
  const doSearch = (e) => {
    e.preventDefault();
    const text = q.trim();
    if (!text) return;
    nav(`/shop?q=${encodeURIComponent(text)}`);
  };

  return (
    <header className="tealNav">
      <div className="tealNavInner">
        {/* ⬅️ left spacer (demo মতো center search রাখতে) */}
        <div className="navSpacer" />

        {/* 🔍 Center pill search */}
        <form className="pillSearch" onSubmit={doSearch}>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t.ph}
          />
          <button type="submit" aria-label="search">
            🔍
          </button>
        </form>

        {/* 👉 Right side */}
        <div className="navRight">
          <button
            className="langCircle"
            type="button"
            onClick={() => setLang((x) => (x === "en" ? "bn" : "en"))}
            title="Language"
          >
            {lang === "en" ? "EN" : "BN"}
          </button>

          {user ? (
            <button
              className="profileCircle"
              onClick={() => nav("/profile")}
              title="Profile"
            >
              👤
            </button>
          ) : (
            <button
              className="profileCircle"
              onClick={() => nav("/login")}
              title