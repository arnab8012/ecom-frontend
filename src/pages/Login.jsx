import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const nav = useNavigate();
  const loc = useLocation();
  const { login } = useAuth();

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const r = await login(phone, password); // তোমার context অনুযায়ী
      if (r?.ok === false) throw new Error(r.message || "Login failed");

      // ✅ যদি আগে private পেজ থেকে আসো, সেখানেই ফেরত যাবে
      const back = loc.state?.from || "/profile";
      nav(back, { replace: true });
    } catch (err) {
      alert(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: 520 }}>
      <h2 style={{ marginTop: 8 }}>Login</h2>

      <form onSubmit={onSubmit} className="box" style={{ marginTop: 10 }}>
        <label className="lbl">Phone</label>
        <input value={phone} onChange={(e) => setPhone(e.target.value)} />

        <label className="lbl" style={{ marginTop: 10 }}>Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

        <button className="btnPrimary" disabled={loading} style={{ marginTop: 14 }}>
          {loading ? "Loading..." : "Login"}
        </button>

        <div style={{ marginTop: 10 }}>
          No account? <Link to="/register">Register</Link>
        </div>
      </form>
    </div>
  );
}