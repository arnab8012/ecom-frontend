// src/pages/SettingsEdit.jsx
import "../styles/settingsEdit.css";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../api/api";

export default function SettingsEdit() {
  const nav = useNavigate();
  const { user } = useAuth();

  const [fullName, setFullName] = useState("");
  const [gender, setGender] = useState("");

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setFullName(user?.fullName || "");
    setGender(user?.gender || "");
  }, [user]);

  const onSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);

      const token = localStorage.getItem("token");
      if (!token) return nav("/login");

      const r = await api.postAuth?.("/api/auth/update-profile", token, {
        fullName,
        gender
      });

      // যদি আপনার api.js এ postAuth না থাকে, তাহলে নিচের fallback use করবে:
      // const r = await api.post("/api/auth/update-profile", { fullName, gender });

      if (!r?.ok) {
        alert(r?.message || "Save failed");
        return;
      }

      alert("Saved ✅");
      nav("/settings");
    } catch (err) {
      alert(err?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container editProfilePage">
      {/* Header */}
      <div className="editHead">
        <h2 className="editTitle">Edit Profile</h2>

        <button className="editBackBtn" type="button" onClick={() => nav(-1)}>
          ← Back
        </button>
      </div>

      {/* Card */}
      <form className="editCard" onSubmit={onSave}>
        <div className="editGrid">
          {/* Full Name */}
          <div className="field">
            <label className="lbl">Full Name</label>
            <input
              className="inp"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Full name"
              autoComplete="name"
            />
          </div>

          {/* Gender */}
          <div className="field">
            <label className="lbl">Gender</label>
            <select className="inp" value={gender} onChange={(e) => setGender(e.target.value)}>
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        {/* Buttons */}
        <div className="editBtns">
          <button className="btnCancel" type="button" onClick={() => nav(-1)} disabled={saving}>
            Cancel
          </button>

          <button className="btnSave" type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </form>

      {/* bottom spacing so footer/nav never sticks */}
      <div className="editBottomSpace" />
    </div>
  );
}