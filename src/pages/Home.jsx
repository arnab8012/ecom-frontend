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

  // helper: relative image হলে BASE যোগ করবে
  const absUrl = (u) => {
    if (!u) return "";
    const s = String(u);
    if (s.startsWith("http://") || s.startsWith("https://")) return s;
    return `${api.BASE}${s.startsWith("/") ? "" : "/"}${s}`;
  };

  const bannerUrls = useMemo(() => {
    return (Array.isArray(banners) ? banners : [])
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

    return () => {
      alive = false;
    };
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

  return (
    <div className="container homeWrap" style={{ paddingBottom: 90 }}>
      {/* ===== Banner ===== */}
      {bannerUrls.length > 0 && (
        <div className="homeBanner">
          <img
            src={bannerUrls[slide]}
            alt="The Curious Empire Banner"
            className="bannerImg"
          />

          <div className="bannerOverlay">
            <h1>The Curious Empire</h1>
            <p>Premium Shopping Experience</p>
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

      {/* ===== Categories ===== */}
      {cats.length > 0 && (
        <div className="homeSection">
          <div className="secTop">
            <h3 className="secTitle">Categories</h3>
            <Link className="seeMore" to="/shop">
              See more
            </Link>
          </div>

          <div className="catRow">
            {cats.map((c) => (
              <button
                key={c._id}
                className="catItem"
                onClick={() => nav(`/shop?category=${c._id}`)}
              >
                <div className="catIcon">
                  <img src={absUrl(c.image)} alt={c.name} />
                </div>
                <div className="catName">{c.name}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {loading && <p>Loading...</p>}

      {/* ===== Products ===== */}
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
              {take(list, 2).map((p) => (
                <ProductCard key={p._id} p={p} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}