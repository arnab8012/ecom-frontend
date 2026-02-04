import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useMemo, useState } from "react";

export default function Navbar() {
const nav = useNavigate();
const { pathname } = useLocation();

const { user } = useAuth();

// ✅ Hide navbar on admin pages (optional)
if (pathname.startsWith("/admin")) return null;

// ✅ language
const [lang, setLang] = useState(() => localStorage.getItem("lang") || "en");
useEffect(() => localStorage.setItem("lang", lang), [lang]);

const t = useMemo(() => {
const dict = {
en: { search: "Search", ph: "Search products..." },
bn: { search: "খুঁজুন", ph: "পণ্য খুঁজুন..." },
};
return dict[lang] || dict.en;
}, [lang]);

// ✅ navbar search (go shop)
const [q, setQ] = useState("");
const doSearch = (e) => {
e.preventDefault();
const text = q.trim();
if (!text) return;
nav(/shop?q=${encodeURIComponent(text)});
};

// ✅ Brand logo
const LOGO = "/logo.png";

return (
<div className="nav glassNav">
{/* ✅ Brand */}
<Link className="brand" to="/" style={{ display: "flex", alignItems: "center", gap: 10 }}>
<img
src={LOGO}
alt="logo"
style={{ width: 36, height: 36, borderRadius: 10, objectFit: "cover" }}
onError={(e) => {
e.currentTarget.style.display = "none";
}}
/>
<span style={{ fontWeight: 900, color: "#111" }}>The Curious Empire</span>
</Link>

{/* ✅ Search */}  
  <form className="navSearchWrap" onSubmit={doSearch}>  
    <input  
      className="navSearch"  
      value={q}  
      onChange={(e) => setQ(e.target.value)}  
      placeholder={t.ph}  
    />  
    <button className="navSearchBtn" type="submit">  
      {t.search}  
    </button>  
  </form>  

  {/* ✅ Right side (ONLY language now) */}  
  <div className="navRight">  
    <button  
      className="langBtn"  
      type="button"  
      onClick={() => setLang((x) => (x === "en" ? "bn" : "en"))}  
      title="Language"  
    >  
      {lang === "en" ? "EN" : "BN"}  
    </button>  
  </div>  
</div>

);
}