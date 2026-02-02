import { Link, useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const nav = useNavigate();
  return (
    <div className="container">
      <div className="rowBetween">
        <h2>Admin Dashboard</h2>
        <button
          className="btnGhost"
          onClick={() => {
            localStorage.removeItem("admin_token");
            nav("/admin/login");
          }}
        >
          Logout
        </button>
      </div>

      <div className="cats">
        <Link className="chip active" to="/admin/products">Products</Link>
        <Link className="chip active" to="/admin/categories">Categories</Link>
        <Link className="chip active" to="/admin/orders">Orders</Link>
        <Link className="btnGhost" to="/admin/banners">Banners</Link>

      </div>
    </div>
  );
}
