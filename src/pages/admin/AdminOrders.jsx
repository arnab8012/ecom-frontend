import { useEffect, useState } from "react";
import { api } from "../../api/api";
import AdminRoute from "../../components/AdminRoute";
import { Link } from "react-router-dom";

const STATUSES = ["PLACED", "CONFIRMED", "IN_TRANSIT", "DELIVERED", "CANCELLED"];

function Inner() {
  const t = api.adminToken();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setLoading(true);

      // ✅ admin token সহ get
      const rr = await api.getAuth("/api/admin/orders", t);

      if (!rr?.ok) {
        alert(rr?.message || "Failed to load orders");
        setOrders([]);
        return;
      }

      setOrders(Array.isArray(rr.orders) ? rr.orders : []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line
  }, []);

  const setStatus = async (id, status) => {
    const rr = await api.putAuth(`/api/admin/orders/${id}/status`, { status }, t);
    if (!rr?.ok) return alert(rr?.message || "Failed to update status");
    load();
  };

  return (
    <div className="container">
      <div className="rowBetween">
        <h2>Admin Orders</h2>
        <Link className="btnGhost" to="/admin">← Back</Link>
      </div>

      {loading ? (
        <div className="box">Loading...</div>
      ) : orders.length === 0 ? (
        <div className="box">No orders found</div>
      ) : (
        orders.map((o) => {
          const shipping = o.shipping || {};
          const items = Array.isArray(o.items) ? o.items : [];

          return (
            <div className="box" key={o._id}>
              <div className="rowBetween">
                <b>Order {o.orderNo || o._id}</b>
                <span className="muted">
                  {o.createdAt ? new Date(o.createdAt).toLocaleString() : "—"}
                </span>
              </div>

              <div className="muted" style={{ marginTop: 6 }}>
                {shipping.fullName || "No name"} — {shipping.phone1 || "No phone"} —{" "}
                {shipping.division || "—"}, {shipping.district || "—"}
              </div>

              <div style={{ marginTop: 10 }}>
                {items.length === 0 ? (
                  <div className="muted">No items</div>
                ) : (
                  items.map((it, i) => (
                    <div
                      key={i}
                      className="rowBetween"
                      style={{ padding: "6px 0", borderTop: "1px solid #eee" }}
                    >
                      <div>
                        <b>{it?.title || "No title"}</b>
                        <div className="muted">{it?.variant || ""}</div>
                      </div>
                      <div>
                        x{it?.qty || 0} — ৳ {(it?.price || 0) * (it?.qty || 0)}
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="rowBetween" style={{ marginTop: 12 }}>
                <b>Total: ৳ {o.total ?? "—"}</b>

                <select
                  className="input"
                  value={o.status || "PLACED"}
                  onChange={(e) => setStatus(o._id, e.target.value)}
                  style={{ maxWidth: 220 }}
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

export default function AdminOrders() {
  return (
    <AdminRoute>
      <Inner />
    </AdminRoute>
  );
}
