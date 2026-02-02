import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../api/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [booting, setBooting] = useState(true);

  // ⭐ VERY IMPORTANT — token দিয়ে user load
  useEffect(() => {
    const boot = async () => {
      try {
        const t = api.token();

        if (!t) {
          setUser(null);
          return;
        }

        const r = await api.getAuth("/api/auth/me", t);

        if (r?.ok) setUser(r.user);
        else setUser(null);
      } catch {
        setUser(null);
      } finally {
        setBooting(false);
      }
    };

    boot();
  }, []);

  const login = async (phone, password) => {
    const r = await api.post("/api/auth/login", { phone, password });

    if (!r.ok) return r;

    localStorage.setItem("token", r.token);
    setUser(r.user);

    return { ok: true };
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, booting }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
