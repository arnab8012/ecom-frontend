import { createContext, useContext, useEffect, useMemo, useState } from "react";

const FavoritesCtx = createContext(null);
const LS_KEY = "fav_v1";

function loadFav() {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) || "[]");
  } catch {
    return [];
  }
}

export function FavoritesProvider({ children }) {
  const [favIds, setFavIds] = useState(loadFav());

  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(favIds));
  }, [favIds]);

  const value = useMemo(
    () => ({
      favIds,
      isFav(id) {
        return favIds.includes(String(id));
      },
      toggle(id) {
        const s = String(id);
        setFavIds((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));
      },
      remove(id) {
        const s = String(id);
        setFavIds((prev) => prev.filter((x) => x !== s));
      },
      clear() {
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
