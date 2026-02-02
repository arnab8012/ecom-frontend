import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../api/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [booting, setBooting] = useState(true);

  // ✅ token থাকলে user load, না থাকলে booting false করবেই
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

  // ✅ Login
  const login = async (phone, password) => {
    const r = await api.post("/api/auth/login", { phone, password });

    if (!r?.ok) return r;

    localStorage.setItem("token", r.token);
    setUser(r.user);

    return { ok: true };
  };

  // ✅ Register (NEW) — Register.jsx এটা কল করে
  const register = async ({ fullName, phone, password, gender }) => {
    const r = await api.post("/api/auth/register", {
      fullName,
      phone,
      password,
      gender,
    });

    if (!r?.ok) return r;

    // ✅ register success হলে token save + user set
    if (r.token) localStorage.setItem("token", r.token);
    if (r.user) setUser(r.user);

    return { ok: true };
  };

  // ✅ Logout
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
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