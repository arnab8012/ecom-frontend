// src/pages/SettingsEdit.jsx
import "../styles/settings.css";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function SettingsEdit() {
  const nav = useNavigate();
  const { user } = useAuth();

  const [fullName, setFullName] = useState("");
  const [gender, setGender] = useState("");

  useEffect(() => {
    if (!user) {
      nav("/login");
      return;
    }
    setFullName(user?.fullName || "");
    setGender(user?.gender || "");
  }, [user, nav]);

  const save = (e) => {
    e.preventDefault();

    // ✅ এখন শুধু UI; পরে API connect করবো
    alert("Save API এখনো connect করা হয়নি (UI ready).");
  };

  if (!user) return null;

  return (
    <div className="container settingsPage">
      <div className="settingsHead">
        <h2 className="settingsTitle">Edit Profile</h2>

        <button className="settingsBackBtn" type="button" onClick={() => nav(-1)}>
          ← Back
        </button>
      </div>

      <form className="settingsCard premiumCard" onSubmit={save}>
        <label className="formLabel">Full Name</label>
        <input
          className="formInput"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Your name"
        />

        <label className="formLabel">Gender</label>
        <select className="formInput" value={gender} onChange={(e) => setGender(e.target.value)}>
          <option value="">Select</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>

        <div className="settingsBtns">
          <button type="button" className="settingsBtn editBtn" onClick={() => nav(-1)}>
            Cancel
          </button>

          <button type="submit" className="settingsBtn saveBtn">
            Save
          </button>
        </div>
      </form>
    </div>
  );
}