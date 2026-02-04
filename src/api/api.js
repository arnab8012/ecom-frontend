const BASE_RAW = import.meta.env.VITE_API_BASE || "http://localhost:5000";
const BASE = String(BASE_RAW).replace(/\/$/, ""); // শেষের / remove

function getToken() {
  return localStorage.getItem("token") || "";
}
function getAdminToken() {
  return localStorage.getItem("admin_token") || "";
}

async function jsonFetch(url, opts) {
  try {
    const r = await fetch(url, opts);

    // অনেক সময় 404/500 এ json না আসলে error হয়
    const text = await r.text();
    let data = {};
    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      data = { ok: false, message: text || "Non-JSON response" };
    }

    // response ok না হলেও data ফেরত দাও
    return data;
  } catch (e) {
    return { ok: false, message: e?.message || "Network error" };
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