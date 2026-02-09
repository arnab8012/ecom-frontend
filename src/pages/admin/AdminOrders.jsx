import "../../styles/admin-orders.css";
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
    const rr = await api.put(`/api/admin/orders/${id}/status`, { status }, t);
    if (!rr?.ok) return alert(rr?.message || "Failed to update status");
    load();
  };

  return (
    <div className="container adminOrdersWrap">
      <div className="rowBetween adminOrdersHeader">
        <h2>Admin Orders</h2>
        <Link className="btnGhost" to="/admin">
          ← Back
        </Link>
      </div>

      {loading ? (
        <div className="box adminOrderCard">Loading...</div>
      ) : orders.length === 0 ? (
        <div className="box adminOrderCard">No orders found</div>
      ) : (
        orders.map((o) => {
          const shipping = o.shipping || {};
          const items = Array.isArray(o.items) ? o.items : [];

          return (
            <div className="box adminOrderCard" key={o._id}>
              {/* top */}
              <div className="adminOrderTop">
                <div>
                  <div className="adminOrderNo">
                    Order {o.orderNo || o._id}
                  </div>
                  <div className="adminOrderMeta">
                    {shipping.fullName || "No name"} — {shipping.phone1 || "No phone"} —{" "}
                    {shipping.division || "—"}, {shipping.district || "—"}
                  </div>
                </div>

                <div className="adminOrderTime">
                  {o.createdAt ? new Date(o.createdAt).toLocaleString() : "—"}
                </div>
              </div>

              {/* items */}
              <div className="adminItems">
                {items.length === 0 ? (
                  <div className="muted" style={{ marginTop: 10 }}>
                    No items
                  </div>
                ) : (
                  items.map((it, i) => {
                    const qty = Number(it?.qty || 0);
                    const price = Number(it?.price || 0);
                    const lineTotal = price * qty;

                    return (
                      <div className="adminItem" key={i}>
                        <div className="adminItemInfo">
                          <div className="adminItemTitle">{it?.title || "No title"}</div>
                          {it?.variant ? (
                            <div className="adminItemVar">{it.variant}</div>
                          ) : null}
                        </div>

                        <div className="adminItemRight">
                          <div className="adminQty">x{qty}</div>
                          <div className="adminPrice">৳ {lineTotal}</div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* bottom */}
              <div className="adminBottom">
                <div className="adminTotal">Total: ৳ {o.total ?? "—"}</div>

                <select
                  className="adminStatusSelect"
                  value={o.status || "PLACED"}
                  onChange={(e) => setStatus(o._id, e.target.value)}
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
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