import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../api/api";
import "../../styles/auth.css";

export default function AdminLogin() {
  const nav = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      return alert("Email and password required");
    }

    try {
      setLoading(true);

      // ✅ FIX: correct route
      const r = await api.post("/api/admin-auth/login", {
        email: email.trim(),
        password: password.trim(),
      });

      if (!r?.ok) {
        return alert(r?.message || "Admin login failed");
      }

      localStorage.setItem("admin_token", r.token);
      nav("/admin", { replace: true });
    } catch (err) {
      console.error(err);
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="authWrap">
      <div className="authCard">
        <h2 className="authTitle">Admin Login</h2>

        <form onSubmit={submit}>
          <label className="lbl">Email</label>
          <input
            className="input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@example.com"
          />

          <label className="lbl">Password</label>
          <input
            className="input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="********"
          />

          <button className="btnPinkFull" type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}