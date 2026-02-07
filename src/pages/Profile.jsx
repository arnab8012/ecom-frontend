// src/pages/Profile.jsx
import "../styles/profile.css";

import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../api/api";

const TABS = [
  { key: "PLACED", label: "Placed" },
  { key: "CONFIRMED", label: "To Ship" },
  { key: "DELIVERED", label: "To Received" },
  { key: "CANCELLED", label: "Cancelled" },
  { key: "ALL", label: "All Orders" }
];

export default function Profile() {
  const { user, logout } = useAuth();
  const nav = useNavigate();

  // ✅ always use same token key
  const token = useMemo(() => localStorage.getItem("token"), []);

  const [tab, setTab] = useState("PLACED");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const formatBDT = (n) => `৳ ${Math.round(Number(n) || 0).toLocaleString("en-US")}`;

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);

        // ✅ token না থাকলে login এ পাঠাও
        if (!token) {
          if (alive) {
            setOrders([]);
            setLoading(false);
            nav("/login");
          }
          return;
        }

        const url =
          tab === "ALL"
            ? "/api/orders/my"
            : `/api/orders/my?status=${encodeURIComponent(tab)}`;

        const r = await api.getAuth(url, token);

        if (!alive) return;

        if (r?.ok) setOrders(Array.isArray(r.orders) ? r.orders : []);
        else setOrders([]);
      } catch {
        if (alive) setOrders([]);
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [tab, token, nav]);

  return (
    <div className="container profilePage">
      {/* ✅ Profile Header */}
      <div className="profileTop premiumCard">
        <div>
          <div className="big">{user?.fullName || "User"}</div>
          <div className="muted">{user?.phone || ""}</div>
        </div>

        <div className="profileActions">
          <Link className="btnGhost profileBtn" to="/settings">
            ⚙ Settings
          </Link>

          <button
            className="btnGhost profileBtn"
            type="button"
            onClick={() => {
              logout();
              nav("/login");
            }}
          >
            Logout
          </button>
        </div>
      </div>

      <div className="profileTitleRow">
        <h3 className="profileH">My Orders</h3>
        <div className="muted">Filter by status</div>
      </div>

      {/* ✅ Tabs */}
      <div className="tabsRow">
        {TABS.map((t) => (
          <button
            key={t.key}
            className={tab === t.key ? "chip active" : "chip"}
            onClick={() => setTab(t.key)}
            type="button"
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ✅ Orders */}
      {loading ? (
        <div className="box premiumCard">Loading...</div>
      ) : orders.length === 0 ? (
        <div className="box premiumCard">No orders</div>
      ) : (
        <div className="ordersWrap">
          {orders.map((o) => {
            const id = o._id || o.id || o.orderNo;
            const when = o.createdAt ? new Date(o.createdAt).toLocaleString() : "—";
            const items = Array.isArray(o.items) ? o.items : [];
            const total = o.total ?? items.reduce((s, it) => s + (Number(it?.price) || 0) * (Number(it?.qty) || 0), 0);

            return (
              <div key={id} className="box premiumCard orderCard">
                <div className="rowBetween orderTopRow">
                  <b className="orderIdText">Order ID: {o.orderNo || o._id}</b>
                  <span className="muted">{when}</span>
                </div>

                <div className="orderStatusRow">
                  Status: <span className="statusPill">{String(o.status || "").toUpperCase()}</span>
                </div>

                <div className="orderItems">
                  {items.map((it, i) => {
                    const title = it?.title || "No title";
                    const variant = it?.variant || "";
                    const qty = Number(it?.qty || 0);
                    const price = Number(it?.price || 0);
                    const line = price * qty;

                    return (
                      <div key={i} className="orderItemRow">
                        <div className="orderItemLeft">
                          <b>{title}</b>
                          {variant ? <div className="muted">{variant}</div> : null}
                        </div>

                        <div className="orderItemPrice">
                          x{qty} — {formatBDT(line)}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="rowBetween orderTotalRow">
                  <b>Total:</b>
                  <b>{formatBDT(total)}</b>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="center" style={{ marginTop: 20 }}>
        <Link className="btnPrimary profileContinueBtn" to="/">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}