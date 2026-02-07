import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../api/api";
import { useCart } from "./CartContext";
import { useFavorites } from "./FavoritesContext";

const AuthContext = createContext(null);

function getUid(u) {
  // ✅ যেটা তোমার user object এ আছে সেটা ধরবে
  return u?._id || u?.id || u?.phone || u?.email || "";
}

export function AuthProvider({ children }) {
  const cart = useCart();
  const fav = useFavorites();

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
            // guest mode
            cart?.useUserCart?.("");
            fav?.useUserFav?.("");
          }
          return;
        }

        const r = await api.getAuth("/api/auth/me", t);
        if (!alive) return;

        if (r?.ok) {
          const u = r.user || null;
          setUser(u);

          const uid = getUid(u);
          cart?.useUserCart?.(uid);
          fav?.useUserFav?.(uid);
        } else {
          localStorage.removeItem("token");
          setUser(null);

          cart?.useUserCart?.("");
          fav?.useUserFav?.("");
        }
      } catch {
        if (alive) {
          localStorage.removeItem("token");
          setUser(null);

          cart?.useUserCart?.("");
          fav?.useUserFav?.("");
        }
      } finally {
        if (alive) setBooting(false);
      }
    })();

    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (phone, password) => {
    const r = await api.post("/api/auth/login", { phone, password });
    if (!r?.ok) return r;

    localStorage.setItem("token", r.token);

    const u = r.user || null;
    setUser(u);

    const uid = getUid(u) || phone; // fallback phone
    cart?.useUserCart?.(uid);
    fav?.useUserFav?.(uid);

    setBooting(false);
    return { ok: true };
  };

  const register = async ({ fullName, phone, password, gender }) => {
    const r = await api.post("/api/auth/register", { fullName, phone, password, gender });
    if (!r?.ok) return r;

    if (r.token) localStorage.setItem("token", r.token);

    const u = r.user || null;
    setUser(u);

    const uid = getUid(u) || phone;
    cart?.useUserCart?.(uid);
    fav?.useUserFav?.(uid);

    setBooting(false);
    return { ok: true };
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setBooting(false);

    // ✅ guest mode -> badge 0
    cart?.useUserCart?.("");
    fav?.useUserFav?.("");
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