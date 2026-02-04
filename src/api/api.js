// src/api/api.js

const BASE = (import.meta.env.VITE_API_BASE || "http://localhost:5000").replace(/\/$/, "");

function getToken() {
  return localStorage.getItem("token") || "";
}
function getAdminToken() {
  return localStorage.getItem("admin_token") || "";
}

async function jsonFetch(url, opts = {}) {
  try {
    const r = await fetch(url, opts);
    const ct = r.headers.get("content-type") || "";

    // JSON না হলে text নাও
    const data = ct.includes("application/json")
      ? await r.json().catch(() => ({}))
      : { ok: false, message: await r.text().catch(() => "Request failed") };

    // status code fail হলে ok false করে দাও (useful)
    if (!r.ok && data && typeof data === "object") {
      if (data.ok === undefined) data.ok = false;
      if (!data.message) data.message = `Request failed (${r.status})`;
    }

    return data;
  } catch (err) {
    // fetch network/cors error
    return { ok: false, message: err?.message || "Network error" };
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

  postAuth(path, body, token) {
    return api.post(path, body, token);
  },
  putAuth(path, body, token) {
    return api.put(path, body, token);
  },

  token: getToken,
  adminToken: getAdminToken,
};