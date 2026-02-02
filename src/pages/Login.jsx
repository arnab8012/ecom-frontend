import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./PublicAuth.css";

export default function Login() {
  const nav = useNavigate();
  const { user, login } = useAuth();

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ already logged in -> login page এ থাকবেই না
  useEffect(() => {
    if (user) nav("/profile", { replace: true });
  }, [user, nav]);

  const submit = async (e) => {
    e.preventDefault();
    if (!phone || !password) return alert("Phone & Password required");

    try {
      setLoading(true);
      const r = await login(phone, password);

      if (!r?.ok) {
        alert(r?.message || "Login failed");
        return;
      }

      // ✅ login success -> Home এ যাও
      nav("/", { replace: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="authWrap">
      <div className="authCard">
        <h2 className="authTitle">Login</h2>

        <form onSubmit={submit}>
          <label className="lbl">Phone Number</label>
          <input
            className="input"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="01xxxxxxxxx"
          />

          <label className="lbl">Password</label>
          <input
            className="input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="******"
          />

          <button className="btnPinkFull" disabled={loading}>
            {loading ? "Please wait..." : "Login"}
          </button>

          <div className="muted" style={{ marginTop: 10 }}>
            No account? <Link to="/register">Register</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
