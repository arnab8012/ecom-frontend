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
      {/* ✅ welcome bar (same) */}
      <div className="welcomeBar">
        <div className="welcomeLeft">
          <div className="welcomeTitle">The Curious Empire</div>
          <div className="welcomeSub">Premium Shopping Experience</div>
        </div>
        <div className="welcomeBadge">✨ Premium</div>
      </div>

      {/* ✅ Banner (demo মতো বড় + নিচে curve) */}
      {bannerUrls.length > 0 && (
        <div className="demoHero">
          <div className="demoHeroInner">
            <div
              className="demoBannerTrack"
              style={{
                width: `${bannerUrls.length * 100}%`,
                transform: `translateX(-${slide * (100 / bannerUrls.length)}%)`,
              }}
            >
              {bannerUrls.map((url, i) => (
                <div
                  key={i}
                  className="demoBannerSlide"
                  style={{ width: `${100 / bannerUrls.length}%` }}
                >
                  <img className="demoBannerImg" src={url} alt="banner" />
                </div>
              ))}
            </div>

            {bannerUrls.length > 1 && (
              <div className="demoDots">
                {bannerUrls.map((_, i) => (
                  <button
                    key={i}
                    className={`demoDot ${i === slide ? "active" : ""}`}
                    onClick={() => setSlide(i)}
                    type="button"
                    aria-label={`banner-${i}`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* ✅ curve */}
          <div className="demoHeroCurve" />
        </div>
      )}

      {/* ✅ Categories (demo মতো box cards + ডানে see all green card) */}
      {cats.length > 0 && (
        <div className="demoCatsSection">
          <div className="demoCatsTop">
            <div className="demoCatsTitle">Categories</div>
            <Link className="demoCatsMore" to="/shop">
              See more
            </Link>
          </div>

          <div className="demoCatsRow">
            {cats.slice(0, 5).map((c) => (
              <button
                key={c._id}
                className="demoCatCard"
                type="button"
                onClick={() => nav(`/shop?category=${c._id}`)}
              >
                <img
                  className="demoCatImg"
                  src={c.image || "https://via.placeholder.com/220x140"}
                  alt={c.name}
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "https://via.placeholder.com/220x140";
                  }}
                />
              </button>
            ))}

            {/* ✅ demo এর মতো "See all" card */}
            <button
              type="button"
              className="demoSeeAll"
              onClick={() => nav("/shop")}
              aria-label="see all categories"
            >
              <span className="demoSeeAllIcon">→</span>
              <span className="demoSeeAllTxt">See all</span>
            </button>
          </div>
        </div>
      )}

      {loading && <p style={{ padding: "12px 0" }}>Loading...</p>}

      {/* ✅ Products grouped by category — 2 column (demo মতো) */}
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
