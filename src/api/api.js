const BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

function getToken() {
  return localStorage.getItem("token") || "";
}
function getAdminToken() {
  return localStorage.getItem("admin_token") || "";
}

async function jsonFetch(url, opts) {
  const r = await fetch(url, opts);
  const data = await r.json().catch(() => ({}));
  return data;
}

export const api = {
  BASE,

  get(path) {
    return jsonFetch(`${BASE}${path}`);
  },

  getAuth(path, token) {
    return jsonFetch(`${BASE}${path}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  },

  post(path, body, token) {
    return jsonFetch(`${BASE}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(body || {}),
    });
  },

  put(path, body, token) {
    return jsonFetch(`${BASE}${path}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(body || {}),
    });
  },

  delete(path, token) {
    return jsonFetch(`${BASE}${path}`, {
      method: "DELETE",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  },

  postAuth(path, body, token) {
    return api.post(path, body, token);
  },
  putAuth(path, body, token) {
    return api.put(path, body, token);
  },

  token: getToken,
  adminToken: getAdminToken,
};