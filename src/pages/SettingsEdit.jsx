import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api/api";
import { useAuth } from "../context/AuthContext";

export default function SettingsEdit() {
  const { user } = useAuth();
  const nav = useNavigate();
  const token = api.token();

  const [fullName, setFullName] = useState("");
  const [permanentAddress, setPermanentAddress] = useState("");
  const [gender, setGender] = useState("MALE");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFullName(user?.fullName || "");
    setPermanentAddress(user?.permanentAddress || "");
    setGender(user?.gender || "MALE");
  }, [user]);

  const save = async () => {
    try {
      setLoading(true);
      const r = await api.put("/api/auth/me", { fullName, permanentAddress, gender }, token);
      if (!r?.ok) return alert(r?.message || "Failed to update");
      alert("✅ Updated");
      nav("/profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="rowBetween" style={{ marginBottom: 14 }}>
        <h2>Edit Profile</h2>
        <Link className="btnGhost" to="/settings">← Back</Link>
      </div>

      <div className="box">
        <label className="lbl">Full Name</label>
        <input className="input" value={fullName} onChange={(e) => setFullName(e.target.value)} />

        <label className="lbl">Permanent Address</label>
        <input className="input" value={permanentAddress} onChange={(e) => setPermanentAddress(e.target.value)} />

        <label className="lbl">Gender</label>
        <select className="input" value={gender} onChange={(e) => setGender(e.target.value)}>
          <option value="MALE">MALE</option>
          <option value="FEMALE">FEMALE</option>
          <option value="OTHER">OTHER</option>
        </select>

        <button className="btnPinkFull" type="button" disabled={loading} onClick={save}>
          {loading ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
}
