// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../api/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        // ✅ always read the same key we set on login/register
        const t = localStorage.getItem("token");

        if (!t) {
          if (alive) {
            setUser(null);
            setBooting(false);
          }
          return;
        }

        const r = await api.getAuth("/api/auth/me", t);
        if (!alive) return;

        if (r?.ok) {
          setUser(r.user || null);
        } else {
          // ✅ token invalid হলে remove
          localStorage.removeItem("token");
          setUser(null);
        }
      } catch (e) {
        if (alive) {
          localStorage.removeItem("token");
          setUser(null);
        }
      } finally {
        if (alive) setBooting(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  const login = async (phone, password) => {
    const r = await api.post("/api/auth/login", { phone, password });
    if (!r?.ok) return r;

    localStorage.setItem("token", r.token);
    setUser(r.user || null);
    setBooting(false);
    return { ok: true };
  };

  const register = async ({ fullName, phone, password, gender }) => {
    const r = await api.post("/api/auth/register", { fullName, phone, password, gender });
    if (!r?.ok) return r;

    if (r.token) localStorage.setItem("token", r.token);
    setUser(r.user || null);
    setBooting(false);
    return { ok: true };
  };

  const logout = () => {
    localStorage.removeItem("token");
    // চাইলে cart/fav logout এ clear করতে পারো (optional)
    // localStorage.removeItem("cart_v1");
    // localStorage.removeItem("fav_v1");

    setUser(null);
    setBooting(false);

    // যদি api.js এ token cache থাকে, এখানে clear করো (optional)
    // api.setToken?.(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, booting }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}