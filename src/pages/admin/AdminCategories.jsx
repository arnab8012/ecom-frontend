import { useEffect, useState } from "react";
import { api } from "../../api/api";
import AdminRoute from "../../components/AdminRoute";
import { Link } from "react-router-dom";

function Inner() {
  const [cats, setCats] = useState([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const load = async () => {
    try {
      const r = await api.get("/api/categories");
      if (r?.ok) setCats(Array.isArray(r.categories) ? r.categories : []);
      else setCats([]);
    } catch {
      setCats([]);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // ✅ Add category
  const add = async () => {
    const n = name.trim();
    if (!n) return alert("Category name required");

    setLoading(true);
    try {
      const t = api.adminToken();
      const r = await api.post("/api/admin/categories", { name: n }, t);
      if (!r?.ok) return alert(r?.message || "Failed");

      setName("");
      load();
    } finally {
      setLoading(false);
    }
  };

  // ✅ Delete category
  const remove = async (id, catName) => {
    if (!window.confirm(`Delete category "${catName}" ?`)) return;

    const t = api.adminToken();
    const r = await api.delete(`/api/admin/categories/${id}`, t);
    if (!r?.ok) return alert(r?.message || "Delete failed");

    load();
  };

  return (
    <div className="container">
      <div className="rowBetween">
        <h2 style={{ margin: 0 }}>Admin Categories</h2>
        <Link className="btnGhost" to="/admin">
          ← Back
        </Link>
      </div>

      {/* Add */}
      <div className="box adminCard" style={{ marginTop: 12 }}>
        <label className="lbl">Category name</label>
        <input
          className="input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Electronics"
        />
        <button className="btnPinkFull" type="button" onClick={add} disabled={loading}>
          {loading ? "Saving..." : "Add Category"}
        </button>
      </div>

      {/* List */}
      <div className="box adminCard" style={{ marginTop: 12 }}>
        {cats.length === 0 ? (
          <div className="muted">No categories</div>
        ) : (
          cats.map((c) => (
            <div key={c._id} className="adminListRow">
              <div>
                <b>{c.name}</b>
                <div className="muted" style={{ fontSize: 12 }}>
                  {c.createdAt ? new Date(c.createdAt).toDateString() : ""}
                </div>
              </div>

              <button
                className="btnGhost"
                type="button"
                style={{ color: "#ff2d55", borderColor: "rgba(255,45,85,0.25)" }}
                onClick={() => remove(c._id, c.name)}
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default function AdminCategories() {
  return (
    <AdminRoute>
      <Inner />
    </AdminRoute>
  );
}