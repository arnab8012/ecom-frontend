// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../api/api";

const AuthContext = createContext(null);

const CART_KEY = "cart_v1";
const FAV_KEY = "fav_v1";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
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
    // ✅ auth clear
    localStorage.removeItem("token");

    // ✅ cart + fav clear => badge 0 হবে
    localStorage.removeItem(CART_KEY);
    localStorage.removeItem(FAV_KEY);

    // ✅ state reset
    setUser(null);
    setBooting(false);

    // ✅ UI সাথে সাথে update না হলে এটা দাও (optional)
    // window.location.reload();
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