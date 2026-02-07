// src/pages/Settings.jsx
import "../styles/settings.css";

import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Settings() {
  const nav = useNavigate();
  const loc = useLocation();
  const { user, logout } = useAuth();

  // ✅ যদি লগইন না থাকে, Login এ পাঠাও
  if (!user) {
    return (
      <div className="container settingsPage">
        <div className="settingsHead">
          <h2 className="settingsTitle">Settings</h2>
          <button className="btnGhost settingsBackBtn" type="button" onClick={() => nav(-1)}>
            ← Back
          </button>
        </div>

        <div className="box premiumCard settingsCard">
          <div className="settingsEmptyIcon">🔒</div>
          <div className="settingsEmptyTitle">You are not logged in</div>
          <div className="settingsEmptyHint">Please login to see settings.</div>
          <Link className="btnPrimary settingsCta" to="/login" state={{ from: loc.pathname }}>
            Login
          </Link>
        </div>
      </div>
    );
  }

  const doLogout = () => {
    const ok = window.confirm("Are you sure you want to logout?");
    if (!ok) return;
    logout();
    nav("/login");
  };

  return (
    <div className="container settingsPage">
      <div className="settingsHead">
        <h2 className="settingsTitle">Settings</h2>

        <button className="btnGhost settingsBackBtn" type="button" onClick={() => nav(-1)}>
          ← Back
        </button>
      </div>

      <div className="box premiumCard settingsCard">
        <div className="settingsRow">
          <div>
            <div className="settingsLabel">Name</div>
            <div className="settingsValue">{user?.fullName || "—"}</div>
          </div>
        </div>

        <div className="settingsRow">
          <div>
            <div className="settingsLabel">Phone</div>
            <div className="settingsValue">{user?.phone || "—"}</div>
          </div>
        </div>

        <div className="settingsBtns">
          <Link className="btnGhost settingsBtn" to="/edit-profile">
            Edit Profile
          </Link>

          <button className="btnGhost settingsBtn logoutBtn" type="button" onClick={doLogout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}