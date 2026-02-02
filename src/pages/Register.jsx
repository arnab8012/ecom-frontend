import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/auth.css";

export default function Register() {
  const nav = useNavigate();
  const { register } = useAuth();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("MALE");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (password !== confirm) return alert("Password mismatch");

    setLoading(true);
    const r = await register({ fullName, phone, password, gender });
    setLoading(false);

    if (r.ok) nav("/profile");
    else alert(r.message || "Register failed");
  };

  return (
    <div className="authWrap">
      <div className="authCard">
        <h2 className="authTitle">Create Account</h2>
        <p className="muted center">Join us today! Enter your details below.</p>

        <form onSubmit={submit}>
          <label className="lbl">Full Name</label>
          <input className="input" value={fullName} onChange={(e) => setFullName(e.target.value)} />

          <label className="lbl">Phone Number</label>
          <input className="input" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="01XXXXXXXXX" />

          <div className="twoCol">
            <div>
              <label className="lbl">Password</label>
              <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div>
              <label className="lbl">Confirm</label>
              <input className="input" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
            </div>
          </div>

          <label className="lbl">Gender</label>
          <div className="rowBetween">
            <label className="radio">
              <input type="radio" checked={gender === "MALE"} onChange={() => setGender("MALE")} />
              Male
            </label>
            <label className="radio">
              <input type="radio" checked={gender === "FEMALE"} onChange={() => setGender("FEMALE")} />
              Female
            </label>
          </div>

          <button className="btnPinkFull" disabled={loading}>{loading ? "Creating..." : "Create Account →"}</button>
        </form>

        <div className="muted center">
          Already have an account? <Link to="/login">Log in</Link>
        </div>
      </div>
    </div>
  );
}
