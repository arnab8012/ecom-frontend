import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFavorites } from "../context/FavoritesContext";
import { useAuth } from "../context/AuthContext";
import PrivateRoute from "../components/PrivateRoute";
import ProductCard from "../components/ProductCard";
import { api } from "../api/api";
import { useCart } from "../context/CartContext";

function FavoritesInner() {
  const { favIds, clear } = useFavorites();
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const { buyNow } = useCart();
  const nav = useNavigate();

  const ids = useMemo(() => favIds.map(String), [favIds]);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        const r = await api.get("/api/products");
        if (!alive) return;

        const all = r?.ok ? r.products || [] : [];
        setProducts(all.filter((p) => ids.includes(String(p._id))));
      } catch {
        if (alive) setProducts([]);
      }
    })();

    return () => {
      alive = false;
    };
  }, [ids]);

  const checkoutFirst = () => {
    if (!products.length) return alert("No favorite product");
    const p0 = products[0];

    // ✅ set single product for checkout
    buyNow(p0, "", 1);
    nav("/checkout");
  };

  return (
    <div className="container">
      <div className="rowBetween">
        <h2>My Favorites</h2>
        <Link className="btnGhost" to="/">
          ← Back
        </Link>
      </div>

      <div className="muted" style={{ marginBottom: 12 }}>
        {user?.fullName || ""} — Total: {products.length}
      </div>

      {products.length === 0 ? (
        <div className="box">No favorites yet</div>
      ) : (
        <>
          {/* ✅ TOP CHECKOUT */}
          <button className="btnPinkFull" type="button" onClick={checkoutFirst}>
            Checkout (First Favorite)
          </button>

          <button
            className="btnGhost"
            type="button"
            onClick={clear}
            style={{ margin: "12px 0" }}
          >
            Clear All
          </button>

          <div className="grid">
            {products.map((p) => (
              <div key={p._id} style={{ position: "relative" }}>
                <ProductCard p={p} />

                {/* ✅ PER PRODUCT BUY NOW */}
                <button
                  className="btnPink"
                  type="button"
                  style={{
                    position: "absolute",
                    right: 12,
                    bottom: 12,
                    zIndex: 5
                  }}
                  onClick={() => {
                    buyNow(p, "", 1);
                    nav("/checkout");
                  }}
                >
                  Buy Now
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function Favorites() {
  return (
    <PrivateRoute>
      <FavoritesInner />
    </PrivateRoute>
  );
}
