import { useEffect, useState } from "react";
import { api } from "../../api/api";
import AdminRoute from "../../components/AdminRoute";
import { Link } from "react-router-dom";

function Inner() {
  const t = api.adminToken();

  const [cats, setCats] = useState([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const load = async () => {
    const r = await api.get("/api/categories");
    if (r?.ok) setCats(r.categories || []);
  };

  useEffect(() => {
    load();
  }, []);

  // ✅ Add category
  const add = async () => {
    if (!name.trim()) return alert("Category name required");

    setLoading(true);
    try {
      const r = await api.post("/api/admin/categories", { name: name.trim() }, t);
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

    const r = await api.delete(`/api/admin/categories/${id}`, t);
    if (!r?.ok) return alert(r?.message || "Delete failed");

    load();
  };

  return (
    <div className="container">
      <div className="rowBetween">
        <h2>Admin Categories</h2>
        <Link className="btnGhost" to="/admin">← Back</Link>
      </div>

      {/* Add */}
      <div className="box">
        <label className="lbl">Category name</label>
        <input
          className="input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Electronics"
        />
        <button className="btnPinkFull" onClick={add} disabled={loading}>
          {loading ? "Saving..." : "Add Category"}
        </button>
      </div>

      {/* List */}
      <div className="box">
        {cats.length === 0 && <div className="muted">No categories</div>}

        {cats.map((c) => (
          <div
            key={c._id}
            className="rowBetween"
            style={{ padding: "10px 0", borderTop: "1px solid #eee" }}
          >
            <div>
              <b>{c.name}</b>
              <div className="muted" style={{ fontSize: 12 }}>
                {new Date(c.createdAt).toDateString()}
              </div>
            </div>

            <button
              className="btnGhost"
              style={{ color: "red" }}
              onClick={() => remove(c._id, c.name)}
            >
              Delete
            </button>
          </div>
        ))}
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
