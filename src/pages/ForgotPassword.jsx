import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../api/api";
import "../styles/auth.css"; // তোমার existing auth.css থাকলে এটা রাখো
import "../styles/forgot-password.css";

export default function ForgotPassword() {
  const nav = useNavigate();

  const [phone, setPhone] = useState("");
  const [fullName, setFullName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();

    if (!phone || !fullName || !newPassword) {
      alert("Phone, Full Name, New Password লাগবে");
      return;
    }

    try {
      setLoading(true);
      const r = await api.post("/api/auth/reset-password", {
        phone,
        fullName,
        newPassword,
      });

      if (!r?.ok) {
        alert(r?.message || "Failed to reset password");
        return;
      }

      alert("✅ Password updated! এখন Login করো");
      nav("/login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="authWrap">
      <div className="authCard fpCard">
        <h2 className="authTitle">Forgot Password</h2>

        <form onSubmit={submit}>
          <label className="lbl">Phone Number</label>
          <input
            className="inp"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="01XXXXXXXXX"
          />

          <label className="lbl">Full Name (যেটা দিয়ে Register করেছিলে)</label>
          <input
            className="inp"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Your full name"
          />

          <label className="lbl">New Password</label>
          <input
            className="inp"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="New password"
          />

          <button className="btnPinkFull" type="submit" disabled={loading}>
            {loading ? "Please wait..." : "Reset Password"}
          </button>

          <div className="fpBottom">
            <Link to="/login" className="fpLink">
              ← Back to Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}