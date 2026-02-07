// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../api/api";

const AuthContext = createContext(null);

// ✅ legacy keys (আগের কোডের সাথে compatible)
const CART_KEY = "cart_v1";
const FAV_KEY = "fav_v1";
const BUY_KEY = "buy_now_v1";

// ✅ new guest/per-user keys (যদি তুমি সেটা ব্যবহার করো)
const CART_GUEST = "cart_guest";
const FAV_GUEST = "fav_guest";
const BUY_GUEST = "buy_now_guest";

function clearCartFavEverywhere() {
  try {
    // ✅ fixed known keys
    localStorage.removeItem(CART_KEY);
    localStorage.removeItem(FAV_KEY);
    localStorage.removeItem(BUY_KEY);

    localStorage.removeItem(CART_GUEST);
    localStorage.removeItem(FAV_GUEST);
    localStorage.removeItem(BUY_GUEST);

    // ✅ per-user keys (cart_user_*, fav_user_*, buy_now_user_*)
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (!k) continue;

      if (
        k.startsWith("cart_user_") ||
        k.startsWith("fav_user_") ||
        k.startsWith("buy_now_user_")
      ) {
        keysToRemove.push(k);
      }
    }
    keysToRemove.forEach((k) => localStorage.removeItem(k));
  } catch {
    // ignore
  }
}

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
      } catch {
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

    // ✅ cart + fav clear => badge 0 হবে (সব key ধরলাম)
    clearCartFavEverywhere();

    // ✅ state reset
    setUser(null);
    setBooting(false);

    // ⚠️ reload দরকার নেই যদি Cart/Fav Provider localStorage থেকে update নেয়
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