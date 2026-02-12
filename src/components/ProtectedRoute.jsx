import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../api/api";

export default function ProtectedRoute({ children }) {
  const { user, booting } = useAuth();
  const location = useLocation();

  // ✅ app boot হচ্ছে → redirect না
  if (booting) return <div className="softBox">Loading...</div>;

  // ✅ local token নেই → login
  const t = api.token();
  if (!t || !user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  return children;
}