// src/pages/Favorites.jsx

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
    <div className="container favPage">
      {/* Header */}
      <div className="rowBetween favHead">
        <h2 className="favTitle">My Favorites</h2>
        <Link className="btnGhost favBack" to="/">
          ← Back
        </Link>
      </div>

      <div className="muted favUser" style={{ marginBottom: 12 }}>
        {user?.fullName || ""} — Total: {products.length}
      </div>

      {products.length === 0 ? (
        <div className="box favEmpty">No favorites yet</div>
      ) : (
        <>
          {/* Actions */}
          <div className="favActions">
            <button className="btnPinkFull favCheckout" type="button" onClick={checkoutFirst}>
              Checkout (First Favorite)
            </button>

            <button className="btnGhost favClear" type="button" onClick={clear}>
              Clear All
            </button>
          </div>

          {/* Grid */}
          <div className="grid favGrid">
            {products.map((p) => (
              <div key={p._id} className="favItemWrap" style={{ position: "relative" }}>
                <ProductCard p={p} />

                {/* ✅ PER PRODUCT BUY NOW */}
                <button
                  className="btnPink favBuyNow"
                  type="button"
                  style={{
                    position: "absolute",
                    right: 12,
                    bottom: 12,
                    zIndex: 5,
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