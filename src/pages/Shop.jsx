import { useEffect, useMemo, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { api } from "../api/api";
import ProductCard from "../components/ProductCard";

export default function Shop() {
  const { search } = useLocation();
  const params = useMemo(() => new URLSearchParams(search), [search]);

  const category = params.get("category") || "";
  const q = (params.get("q") || "").trim(); // ✅ from navbar

  const [all, setAll] = useState([]);         // fetched products
  const [loading, setLoading] = useState(true);

  // ✅ "See more" limit
  const [limit, setLimit] = useState(12);

  // ✅ Load products by category (backend)
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

  // ✅ Frontend search filter (works without backend search API)
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

  // ✅ Show limited products for "See more"
  const visible = useMemo(() => filtered.slice(0, limit), [filtered, limit]);
  const canMore = visible.length < filtered.length;

  // ✅ Reset limit when query/category changes
  useEffect(() => {
    setLimit(12);
  }, [q, category]);

  return (
    <div className="container">
      <div className="rowBetween" style={{ marginBottom: 12 }}>
        <div>
          <h2 style={{ margin: 0 }}>Products</h2>
          <div className="muted" style={{ marginTop: 6 }}>
            {q ? (
              <>Search: <b>{q}</b> — </>
            ) : null}
            Showing {visible.length} / {filtered.length}
          </div>
        </div>

        <Link className="btnGhost" to="/">← Back</Link>
      </div>

      {loading ? (
        <div className="box">Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="box">No products found</div>
      ) : (
        <>
          <div className="grid">
            {visible.map((p) => (
              <ProductCard key={p._id} p={p} />
            ))}
          </div>

          {/* ✅ See more */}
          {canMore ? (
            <div className="center" style={{ marginTop: 16 }}>
              <button
                className="btnPink"
                type="button"
                onClick={() => setLimit((x) => x + 12)}
              >
                See more
              </button>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}
