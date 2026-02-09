import "../styles/home.css";
import "../styles/categories.css";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api/api";
import ProductCard from "../components/ProductCard";

export default function Home() {
  const nav = useNavigate();

  const [cats, setCats] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [slide, setSlide] = useState(0);

  const absUrl = (u) => {
    if (!u) return "";
    const s = String(u);
    if (s.startsWith("http://") || s.startsWith("https://")) return s;
    return `${api.BASE}${s.startsWith("/") ? "" : "/"}${s}`;
  };

  const bannerUrls = useMemo(() => {
    return (banners || [])
      .map((b) => (typeof b === "string" ? b : b?.url))
      .map(absUrl)
      .filter(Boolean);
  }, [banners]);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);
        const [c, r, p] = await Promise.all([
          api.get("/api/categories"),
          api.get("/api/banners"),
          api.get("/api/products"),
        ]);

        if (!alive) return;

        if (c?.ok) setCats(c.categories || []);
        if (r?.ok) setBanners(r.banners || []);
        if (p?.ok) setAllProducts(p.products || []);
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => (alive = false);
  }, []);

  useEffect(() => {
    if (bannerUrls.length <= 1) return;
    const id = setInterval(
      () => setSlide((s) => (s + 1) % bannerUrls.length),
      3500
    );
    return () => clearInterval(id);
  }, [bannerUrls.length]);

  const byCat = useMemo(() => {
    const map = new Map();
    for (const p of allProducts) {
      const cid = p?.category?._id;
      if (!cid) continue;
      if (!map.has(cid)) map.set(cid, []);
      map.get(cid).push(p);
    }
    return map;
  }, [allProducts]);

  const newArrivals = useMemo(() => {
    // নতুনগুলো আগে দেখাতে চাইলে createdAt থাকলে sort করা যাবে
    const arr = Array.isArray(allProducts) ? [...allProducts] : [];
    // যদি createdAt না থাকে, এই sort কাজ নাও করতে পারে, তাই safe রাখলাম
    arr.sort((a, b) => {
      const da = a?.createdAt ? new Date(a.createdAt).getTime() : 0;
      const db = b?.createdAt ? new Date(b.createdAt).getTime() : 0;
      return db - da;
    });
    return arr.slice(0, 6);
  }, [allProducts]);

  return (
    <div className="container homeWrap">
      {/* ===== BANNER ===== */}
      {bannerUrls.length > 0 && (
        <div className="homeBanner">
          <div
            className="bannerSlideTrack"
            style={{ transform: `translateX(-${slide * 100}%)` }}
          >
            {bannerUrls.map((url, i) => (
              <div className="bannerSlide" key={i}>
                <img src={url} className="bannerImg" alt="Banner" />
              </div>
            ))}
          </div>

          {bannerUrls.length > 1 && (
            <div className="bannerDots">
              {bannerUrls.map((_, i) => (
                <button
                  key={i}
                  className={`dot ${i === slide ? "active" : ""}`}
                  onClick={() => setSlide(i)}
                  type="button"
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ===== BANNER TEXT ===== */}
      <div className="homeHeroText">
        <div className="homeHeroTitle">The Curious Empire</div>
        <div className="homeHeroSub">Premium Shopping Experience</div>
      </div>

      {/* =========================
          ✅ CATEGORIES SECTION
          (ডান থেকে বামে, এক লাইনে scroll)
         ========================= */}
      <div className="catSection">
        <div className="catHeader">
          <h3>Categories</h3>
          <button
            type="button"
            className="seeMore"
            onClick={() => nav("/shop")}
          >
            See more →
          </button>
        </div>

        <div className="catGrid">
          {cats.map((c) => (
            <button
              type="button"
              key={c._id}
              className="catCard"
              onClick={() => nav(`/shop?category=${c.slug || c._id}`)}
            >
              <img
                src={absUrl(c.image) || "https://via.placeholder.com/80"}
                alt={c.name}
              />
              <p>{c.name}</p>
            </button>
          ))}
        </div>

        {/* ✅ bottom options (2টা) */}
        <div className="catOptions">
          <div className="optionCard">
            🚚 <span>Free Delivery</span>
          </div>

          <div className="optionCard">
            🛍️ <span>Best Offers</span>
          </div>
        </div>
      </div>

      {/* ===== NEW ARRIVALS (example section) ===== */}
      <div className="homeSection">
        <div className="rowBetween homeSectionHeader">
          <h3 className="homeSectionTitle">NEW ARRIVALS</h3>
          <Link className="seeMoreLink" to="/shop">
            See More →
          </Link>
        </div>

        {loading ? (
          <div className="box">Loading...</div>
        ) : newArrivals.length === 0 ? (
          <div className="box">No products yet</div>
        ) : (
          <div className="grid">
            {newArrivals.map((p) => (
              <ProductCard key={p._id} p={p} />
            ))}
          </div>
        )}
      </div>

      {/* ===== CATEGORY WISE SECTIONS (optional but সুন্দর লাগে) ===== */}
      {cats.map((c) => {
        const list = byCat.get(c._id) || [];
        if (!list.length) return null;

        return (
          <div className="homeSection" key={c._id}>
            <div className="rowBetween homeSectionHeader">
              <h3 className="homeSectionTitle">{c.name}</h3>
              <button
                type="button"
                className="seeMoreLink"
                onClick={() => nav(`/shop?category=${c.slug || c._id}`)}
              >
                See More →
              </button>
            </div>

            <div className="grid">
              {list.slice(0, 6).map((p) => (
                <ProductCard key={p._id} p={p} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}