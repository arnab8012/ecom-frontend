import { Navigate } from "react-router-dom";

export default function AdminRoute({ children }) {
  const t = localStorage.getItem("admin_token");
  if (!t) return <Navigate to="/admin/login" replace />;
  return children;
}
