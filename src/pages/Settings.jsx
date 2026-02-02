import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Settings() {
  const { user, logout } = useAuth();
  const nav = useNavigate();

  return (
    <div className="container">
      <div className="rowBetween" style={{ marginBottom: 14 }}>
        <h2>Settings</h2>
        <Link className="btnGhost" to="/profile">← Back</Link>
      </div>

      <div className="box">
        <div className="muted">Name</div>
        <div style={{ fontWeight: 800, marginBottom: 10 }}>
          {user?.fullName || "—"}
        </div>

        <div className="muted">Phone</div>
        <div style={{ fontWeight: 800, marginBottom: 10 }}>
          {user?.phone || "—"}
        </div>

        <div className="rowBetween" style={{ gap: 10, marginTop: 12 }}>
          <button className="btnPink" type="button" onClick={() => nav("/settings/edit")}>
            Edit Profile
          </button>

          <button
            className="btnGhost"
            type="button"
            onClick={() => {
              logout();
              nav("/login");
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
