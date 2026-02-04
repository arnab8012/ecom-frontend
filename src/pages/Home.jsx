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

  // ✅ helper: relative image হলে BASE যোগ করবে
  const absUrl = (u) => {
    if (!u) return "";
    const s = String(u);
    if (s.startsWith("http://") || s.startsWith("https://")) return s;
    // "/uploads/.." বা "uploads/.." দুইটাই handle
    return `${api.BASE}${s.startsWith("/") ? "" : "/"}${s}`;
  };

  const bannerUrls = useMemo(() => {
    const arr = Array.isArray(banners) ? banners : [];
    return arr
      .map((b) => (typeof b === "string" ? b : b?.url))
      .map((u) => absUrl(u))
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
      } catch (e) {
        console.log("Home Load Error", e);
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => (alive = false);
  }, []);

  useEffect(() => {
    if (bannerUrls.length <= 1) return;
    const id = setInterval(() => {
      setSlide((s) => (s + 1) % bannerUrls.length);
    }, 3500);
    return () => clearInterval(id);
  }, [bannerUrls.length]);

  const byCat = useMemo(() => {
    const map = new Map();
    for (const p of allProducts || []) {
      const cid = p?.category?._id || "uncat";
      if (!map.has(cid)) map.set(cid, []);
      map.get(cid).push(p);
    }
    return map;
  }, [allProducts]);

  const take = (arr, n) => (Array.isArray(arr) ? arr.slice(0, n) : []);
  const titleText = (name) => String(name || "").toUpperCase();

  return (
    <div className="container homeWrap" style={{ paddingBottom: 90 }}>
      {/* welcome bar */}
      <div className="welcomeBar">
        <div className="welcomeLeft">
          <div className="welcomeTitle">The Curious Empire</div>
          <div className="welcomeSub">Premium Shopping Experience</div>
        </div>
        <div className="welcomeBadge">✨ Premium</div>
      </div>

      {/* Banner */}
      {bannerUrls.length > 0 && (
        <div className="heroBannerWrap">
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
                  <img className="bannerImg" src={url} alt="banner" />
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
                    aria-label={`banner-${i}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Categories */}
      {cats.length > 0 && (
        <div className="homeSection">
          <div className="secTop">
            <h3 className="secTitle">Categories</h3>
            <Link className="seeMore" to="/shop">
              See more
            </Link>
          </div>

          <div className="catRow">
            {cats.map((c) => {
              const imgUrl = absUrl(c?.image) || "https://via.placeholder.com/160";
              return (
                <button
                  key={c._id}
                  className="catItem"
                  type="button"
                  onClick={() => nav(`/shop?category=${c._id}`)}
                >
                  <div className="catIcon">
                    <img
                      src={imgUrl}
                      alt={c.name}
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "https://via.placeholder.com/160";
                      }}
                    />
                  </div>
                  <div className="catName">{c.name}</div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {loading && <p style={{ padding: "12px 0" }}>Loading...</p>}

      {/* Products by category */}
      {cats.map((c) => {
        const list = byCat.get(c._id) || [];
        if (!list.length) return null;

        return (
          <div className="homeSection" key={c._id} style={{ marginTop: 18 }}>
            <div className="catHeaderRow">
              <div className="catHeaderTitle">{titleText(c.name)}</div>
              <Link to={`/shop?category=${c._id}`} className="seeMoreBtn">
                See More →
              </Link>
            </div>

            <div className="homeTwoGrid">
              {take(list, 4).map((p) => (
                <div key={p._id} style={{ width: "100%" }}>
                  <ProductCard p={p} />
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}