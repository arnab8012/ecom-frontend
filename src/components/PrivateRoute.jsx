import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PrivateRoute({ children }) {
  const { user, booting } = useAuth();
  const loc = useLocation();

  if (booting) return <div style={{ padding: 16 }}>Loading...</div>;

  if (!user) {
    return <Navigate to="/login" replace state={{ from: loc.pathname }} />;
  }

  return children;
}
