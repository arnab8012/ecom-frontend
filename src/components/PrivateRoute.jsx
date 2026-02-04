import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PrivateRoute({ children }) {
  const { user } = useAuth();
  const loc = useLocation();

  if (!user) {
    // ✅ login এ পাঠাবে, shop এ না
    return <Navigate to="/login" replace state={{ from: loc.pathname + loc.search }} />;
  }

  return children;
}