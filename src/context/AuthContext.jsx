// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../api/api";

const AuthContext = createContext(null);

// ✅ storage keys (এগুলো তোমার project এর keys অনুযায়ী)
// CartProvider এ তুমি LS_KEY = "cart_v1" ব্যবহার করছো
const CART_KEY = "cart_v1";

// FavoritesContext এ যে key আছে সেটা এখানে দাও (তোমারটা যদি আলাদা হয়, বদলাও)
const FAV_KEY = "fav_v1";

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
    // ✅ auth clear
    localStorage.removeItem("token");

    // ✅ cart + favorites clear করলে badge 0 হবে
    localStorage.removeItem(CART_KEY);
    localStorage.removeItem(FAV_KEY);

    // ✅ state reset
    setUser(null);
    setBooting(false);

    // ✅ যদি api.js এ token cache থাকে, এখানে clear (optional)
    // api.setToken?.(null);

    // ✅ UI instant refresh চাইলে (optional)
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