import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../api/api";
import "../../styles/auth.css";

export default function AdminLogin() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    const r = await api.post("/api/admin-auth/login", { email, password });
    if (!r.ok) return alert(r.message || "Admin login failed");

    localStorage.setItem("admin_token", r.token);
    nav("/admin");
  };

  return (
    <div className="authWrap">
      <div className="authCard">
        <h2 className="authTitle">Admin Login</h2>
        <form onSubmit={submit}>
          <label className="lbl">Email</label>
          <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
          <label className="lbl">Password</label>
          <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button className="btnPinkFull">Login</button>
        </form>
      </div>
    </div>
  );
}
