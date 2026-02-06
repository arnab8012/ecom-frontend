import { Link, useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const nav = useNavigate();

  return (
    <div className="container">
      <div className="rowBetween">
        <h2 style={{ margin: 0 }}>Admin Dashboard</h2>

        <button
          className="btnGhost"
          type="button"
          onClick={() => {
            localStorage.removeItem("admin_token");
            nav("/admin/login");
          }}
        >
          Logout
        </button>
      </div>

      {/* ✅ Premium quick actions */}
      <div className="adminDashGrid" style={{ marginTop: 14 }}>
        <Link className="adminDashCard" to="/admin/products">
          <div className="adminDashIcon">🛍️</div>
          <div className="adminDashTitle">Products</div>
          <div className="adminDashSub">Add / Edit / Delete products</div>
        </Link>

        <Link className="adminDashCard" to="/admin/categories">
          <div className="adminDashIcon">🗂️</div>
          <div className="adminDashTitle">Categories</div>
          <div className="adminDashSub">Manage category list</div>
        </Link>

        <Link className="adminDashCard" to="/admin/orders">
          <div className="adminDashIcon">📦</div>
          <div className="adminDashTitle">Orders</div>
          <div className="adminDashSub">View & update orders</div>
        </Link>

        <Link className="adminDashCard" to="/admin/banners">
          <div className="adminDashIcon">🖼️</div>
          <div className="adminDashTitle">Banners</div>
          <div className="adminDashSub">Upload & manage banners</div>
        </Link>
      </div>

      {/* ✅ Keep your existing chips row too (same links) */}
      <div className="cats" style={{ marginTop: 14 }}>
        <Link className="chip active" to="/admin/products">
          Products
        </Link>
        <Link className="chip active" to="/admin/categories">
          Categories
        </Link>
        <Link className="chip active" to="/admin/orders">
          Orders
        </Link>
        <Link className="chip active" to="/admin/banners">
          Banners
        </Link>
      </div>
    </div>
  );
}