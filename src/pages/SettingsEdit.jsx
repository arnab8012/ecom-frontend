// src/pages/SettingsEdit.jsx
import "../styles/settings.css";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../api/api";

export default function SettingsEdit() {
  const { user } = useAuth();
  const nav = useNavigate();
  const token = api.token();

  const [fullName, setFullName] = useState("");
  const [gender, setGender] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || "");
      setGender(user.gender || "");
    }
  }, [user]);

  const saveProfile = async () => {
    if (!fullName.trim()) return alert("Name required");

    try {
      setSaving(true);
      const r = await api.putAuth(
        "/api/users/me",
        { fullName, gender },
        token
      );

      if (r?.ok) {
        nav("/settings");
      } else {
        alert(r?.message || "Update failed");
      }
    } catch {
      alert("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container settingsPage">
      {/* Header */}
      <div className="settingsHead">
        <h1 className="settingsTitle">Edit Profile</h1>
        <button
          className="settingsBackBtn"
          type="button"
          onClick={() => nav(-1)}
        >
          ← Back
        </button>
      </div>

      {/* Card */}
      <div className="settingsCard">
        {/* Name */}
        <label className="formLabel">Full Name</label>
        <input
          className="formInput"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Your name"
        />

        {/* Gender */}
        <label className="formLabel">Gender</label>
        <select
          className="formInput"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
        >
          <option value="">Select</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>

        {/* Buttons */}
        <div className="settingsBtns">
          <button
            className="settingsBtn editBtn"
            type="button"
            onClick={() => nav(-1)}
            disabled={saving}
          >
            Cancel
          </button>

          <button
            className="settingsBtn saveBtn"
            type="button"
            onClick={saveProfile}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}