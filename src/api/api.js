// ✅ Prod এ localhost থাকলে "NetworkError when attempting to fetch resource" হবেই
// তাই env না থাকলে PROD এ Render backend ধরছি।

const PROD_FALLBACK = "https://ecom-backend-rqj0.onrender.com";

const BASE_RAW =
  import.meta.env.VITE_API_BASE ||
  (import.meta.env.PROD ? PROD_FALLBACK : "http://localhost:5000");

const BASE = String(BASE_RAW).replace(/\/$/, ""); // শেষের / remove

function getToken() {
  return localStorage.getItem("token") || "";
}
function getAdminToken() {
  return localStorage.getItem("admin_token") || "";
}

async function jsonFetch(url, opts = {}) {
  try {
    const r = await fetch(url, {
      ...opts,
      // ✅ future-proof (cookie auth থাকলেও কাজ করবে)
      credentials: "include",
    });

    const text = await r.text();
    let data = {};
    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      data = { ok: false, message: text || "Non-JSON response" };
    }

    // ✅ HTTP status hint add
    if (!r.ok && data && typeof data === "object" && !("status" in data)) {
      data.status = r.status;
    }

    return data;
  } catch (e) {
    return { ok: false, message: e?.message || "Network error" };
  }
}

export const api = {
  BASE,

  get(path) {
    return jsonFetch(`${BASE}${path}`, { method: "GET" });
  },

  getAuth(path, token) {
    return jsonFetch(`${BASE}${path}`, {
      method: "GET",
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