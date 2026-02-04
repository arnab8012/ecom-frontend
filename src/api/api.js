const BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";
console.log("API BASE =", BASE);

function getToken() {
  return localStorage.getItem("token") || "";
}

function getAdminToken() {
  return localStorage.getItem("admin_token") || "";
}

async function jsonFetch(url, opts) {
  try {
    const r = await fetch(url, opts);
    const data = await r.json().catch(() => ({}));
    return data;
  } catch (e) {
    console.error("API ERROR:", url, e);
    return { ok: false, message: "Network error" };
  }
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

  token: getToken,
  adminToken: getAdminToken,
};