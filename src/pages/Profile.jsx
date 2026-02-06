import { useEffect, useState } from "react";
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
  const token = api.token();

  const [tab, setTab] = useState("PLACED");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);

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
  }, [tab, token]);

  return (
    <div className="container profilePage">
      {/* ✅ Profile Header */}
      <div className="profileTop premiumCard">
        <div>
          <div className="big">{user?.fullName || ""}</div>
          <div className="muted">{user?.phone || ""}</div>
        </div>

        <div className="profileActions">
          <Link className="btnGhost" to="/settings">
            ⚙ Settings
          </Link>

          <button
            className="btnGhost"
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
        orders.map((o) => (
          <div key={o._id} className="box premiumCard orderCard">
            <div className="rowBetween orderTopRow">
              <b>Order ID: {o.orderNo || o._id}</b>
              <span className="muted">
                {o.createdAt ? new Date(o.createdAt).toLocaleString() : "—"}
              </span>
            </div>

            <div className="orderStatus">
              Status: <b>{o.status}</b>
            </div>

            <div className="orderItems">
              {(o.items || []).map((it, i) => (
                <div key={i} className="orderItemRow">
                  <div>
                    <b>{it?.title || "No title"}</b>
                    <div className="muted">{it?.variant || ""}</div>
                  </div>
                  <div className="orderItemPrice">
                    x{Number(it?.qty || 0)} — ৳{" "}
                    {Number(it?.price || 0) * Number(it?.qty || 0)}
                  </div>
                </div>
              ))}
            </div>

            <div className="rowBetween orderTotalRow">
              <b>Total:</b>
              <b>৳ {o.total ?? "—"}</b>
            </div>
          </div>
        ))
      )}

      <div className="center" style={{ marginTop: 20 }}>
        <Link className="btnPrimary" to="/">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}