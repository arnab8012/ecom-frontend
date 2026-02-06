import "../styles/product-card.css";
import { useEffect, useMemo, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { api } from "../api/api";
import ProductCard from "../components/ProductCard";

export default function Shop() {
  const { search } = useLocation();
  const params = useMemo(() => new URLSearchParams(search), [search]);

  const category = params.get("category") || "";
  const q = (params.get("q") || "").trim();

  const [all, setAll] = useState([]);
  const [loading, setLoading] = useState(true);

  // "See more" limit
  const [limit, setLimit] = useState(12);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);

        const url = category
          ? `/api/products?category=${encodeURIComponent(category)}`
          : "/api/products";

        const r = await api.get(url);
        if (!alive) return;

        if (r?.ok) setAll(Array.isArray(r.products) ? r.products : []);
        else setAll([]);
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [category]);

  const filtered = useMemo(() => {
    const text = q.toLowerCase();
    if (!text) return all;

    return (all || []).filter((p) => {
      const title = String(p?.title || "").toLowerCase();
      const desc = String(p?.description || "").toLowerCase();
      const catName = String(p?.category?.name || "").toLowerCase();
      return title.includes(text) || desc.includes(text) || catName.includes(text);
    });
  }, [all, q]);

  const visible = useMemo(() => filtered.slice(0, limit), [filtered, limit]);
  const canMore = visible.length < filtered.length;

  useEffect(() => {
    setLimit(12);
  }, [q, category]);

  return (
    <div className="container">
      {/* Header row */}
      <div className="shopHead">
        <div>
          <div className="shopTitle">Products</div>
          <div className="shopSub">
            {q ? (
              <>
                Search: <b>{q}</b> —{" "}
              </>
            ) : null}
            Showing {visible.length} / {filtered.length}
          </div>
        </div>

        <Link className="btnSoftLink" to="/">
          ← Back
        </Link>
      </div>

      {loading ? (
        <div className="softBox">Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="softBox">No products found</div>
      ) : (
        <>
          <div className="productsGrid">
            {visible.map((p) => (
              <ProductCard key={p._id} p={p} />
            ))}
          </div>

          {canMore ? (
            <div className="shopMoreWrap">
              <button className="btnPrimary" type="button" onClick={() => setLimit((x) => x + 12)}>
                See more
              </button>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}
