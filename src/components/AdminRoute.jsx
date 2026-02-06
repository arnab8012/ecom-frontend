import { Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../api/api";

export default function AdminRoute({ children }) {
  const loc = useLocation();
  const [ok, setOk] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        const t = api.adminToken(); // localStorage admin_token

        // ✅ token নাই -> no access
        if (!t) {
          if (alive) setOk(false);
          return;
        }

        // ✅ token valid কিনা lightweight check (backend এ route থাকলে)
        // যদি তোমার backend এ /api/admin/me না থাকে, নিচের try ব্লকটা remove করলেও চলবে
        const r = await api.getAuth("/api/admin/me", t);

        if (!alive) return;

        if (r?.ok) {
          setOk(true);
        } else {
          // token invalid -> remove
          localStorage.removeItem("admin_token");
          setOk(false);
        }
      } catch {
        localStorage.removeItem("admin_token");
        if (alive) setOk(false);
      } finally {
        if (alive) setChecking(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  // ✅ checking time এ redirect না
  if (checking) return <div className="softBox">Checking admin...</div>;

  if (!ok) {
    return <Navigate to="/admin/login" replace state={{ from: loc.pathname + loc.search }} />;
  }

  return children;
}