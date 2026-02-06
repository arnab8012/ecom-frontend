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

    const em = String(email || "").trim();
    const pw = String(password || "").trim();

    if (!em || !pw) {
      return alert("Email and password required");
    }

    try {
      setLoading(true);

      // ✅ correct route
      const r = await api.post("/api/admin-auth/login", {
        email: em,
        password: pw,
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
      <div className="authCard adminAuthCard">
        <h2 className="authTitle">Admin Login</h2>
        <p className="muted center" style={{ marginTop: -6 }}>
          Secure admin access only
        </p>

        <form onSubmit={submit}>
          <label className="lbl">Email</label>
          <input
            className="input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@example.com"
            autoComplete="email"
            required
          />

          <label className="lbl" style={{ marginTop: 10 }}>
            Password
          </label>
          <input
            className="input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="********"
            autoComplete="current-password"
            required
          />

          <button className="btnPinkFull" type="submit" disabled={loading} style={{ marginTop: 12 }}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}