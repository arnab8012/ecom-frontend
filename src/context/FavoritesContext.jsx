import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "./AuthContext";

const FavoritesCtx = createContext(null);

// ✅ guest + per-user keys
const KEY_GUEST = "fav_guest";
const KEY_USER = (uid) => `fav_user_${uid}`;

function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

export function FavoritesProvider({ children }) {
  const { user } = useAuth();

  const uid = user?._id || user?.id || user?.userId || "";
  const storageKey = uid ? KEY_USER(uid) : KEY_GUEST;

  const [favIds, setFavIds] = useState(() => loadJSON(storageKey, []));

  // ✅ যখন login/logout হবে => নতুন key থেকে fav load করবে
  useEffect(() => {
    setFavIds(loadJSON(storageKey, []));
  }, [storageKey]);

  // ✅ persist current fav to correct key
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(favIds));
    } catch {}
  }, [storageKey, favIds]);

  const value = useMemo(
    () => ({
      favIds,

      isFav(id) {
        const s = String(id);
        return Array.isArray(favIds) ? favIds.includes(s) : false;
      },

      toggle(id) {
        const s = String(id);
        setFavIds((prev) => {
          const list = Array.isArray(prev) ? prev : [];
          return list.includes(s) ? list.filter((x) => x !== s) : [...list, s];
        });
      },

      remove(id) {
        const s = String(id);
        setFavIds((prev) => (Array.isArray(prev) ? prev.filter((x) => x !== s) : []));
      },

      clear() {
        setFavIds([]);
      },

      // ✅ logout এ UI থেকে 0 করতে চাইলে এটা call করবে
      resetUIOnly() {
        setFavIds([]);
      }
    }),
    [favIds]
  );

  return <FavoritesCtx.Provider value={value}>{children}</FavoritesCtx.Provider>;
}

export function useFavorites() {
  return useContext(FavoritesCtx);
}