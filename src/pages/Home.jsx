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

  const bannerUrls = useMemo(() => {
    const arr = Array.isArray(banners) ? banners : [];
    return arr.map((b) => (typeof b === "string" ? b : b?.url)).filter(Boolean);
  }, [banners]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const [c, r, p] = await Promise.all([
        api.get("/api/categories"),
        api.get("/api/banners"),
        api.get("/api/products"),
      ]);
      if (c?.ok) setCats(c.categories || []);
      if (r?.ok) setBanners(r.banners || []);
      if (p?.ok) setAllProducts(p.products || []);
      setLoading(false);
    })();
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
      if (!map.has(cid)) map.set(cid, []);
      map.get(cid).push(p);
    }
    return map;
  }, [allProducts]);

  return (
    <div className="container homeWrap" style={{ paddingBottom: 90 }}>
      {/* 🔥 FULL WIDTH BANNER */}
      <div className="heroGreenShell heroFullBleed">
        {/* Banner image */}
        {bannerUrls.length > 0 && (
          <div className="heroBanner">
            <div
              className="bannerTrack"
              style={{
                width: `${bannerUrls.length * 100}%`,
                transform: `translateX(-${slide * (100 / bannerUrls.length)}%)`,
              }}
            >
              {bannerUrls.map((url, i) => (
                <div
                  key={i}
                  className="bannerSlide"
                  style={{ width: `${100 / bannerUrls.length}%` }}
                >
                  <img src={url} className="bannerImg" alt="banner" />
                </div>
              ))}
            </div>

            {/* dots */}
            {bannerUrls.length > 1 && (
              <div className="bannerDots">
                {bannerUrls.map((_, i) => (
                  <button
                    key={i}
                    className={`dot ${i === slide ? "active" : ""}`}
                    onClick={() => setSlide(i)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ✅ TEXT ONLY (NO WHITE) */}
        <div className="welcomeBar">
          <div>
            <div className="welcomeTitle">The Curious Empire</div>
            <div className="welcomeSub">Premium Shopping Experience</div>
          </div>
        </div>

        {/* ✅ ONLY ONE U-CURVE AT BOTTOM */}
        <div className="heroGreenCurve" />
      </div>

      {/* Categories */}
      {cats.length > 0 && (
        <div className="homeSection">
          <div className="secTop">
            <h3 className="secTitle">Categories</h3>
            <Link className="seeMore" to="/shop">See more</Link>
          </div>

          <div className="catRow">
            {cats.map((c) => (
              <button
                key={c._id}
                className="catItem"
                onClick={() => nav(`/shop?category=${c._id}`)}
              >
                <div className="catIcon">
                  <img src={c.image} alt={c.name} />
                </div>
                <div className="catName">{c.name}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Products */}
      {cats.map((c) => {
        const list = byCat.get(c._id) || [];
        if (!list.length) return null;

        return (
          <div className="homeSection" key={c._id}>
            <div className="catHeaderRow">
              <div className="catHeaderTitle">{c.name}</div>
              <Link to={`/shop?category=${c._id}`} className="seeMoreBtn">
                See More →
              </Link>
            </div>

            <div className="homeTwoGrid">
              {list.slice(0, 4).map((p) => (
                <ProductCard key={p._id} p={p} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}