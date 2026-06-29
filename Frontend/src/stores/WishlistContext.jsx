import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import { wishlistService } from "../views/client/wishlist/services/wishlistService";
import { useAuth } from "./AuthContext";

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const auth = useAuth();
  const [items, setItems] = useState([]);

  const isCustomer = auth.isLoggedIn && auth.userType === "customer";

  const refresh = useCallback(async () => {
    if (!isCustomer) {
      setItems([]);
      return;
    }
    try {
      const res = await wishlistService.list();
      setItems(res?.data || []);
    } catch (e) {
      console.error("No se pudo cargar la wishlist:", e);
      setItems([]);
    }
  }, [isCustomer]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const ids = useMemo(() => new Set(items.map((i) => i.id_producto)), [items]);
  const has = useCallback((id) => ids.has(Number(id)), [ids]);

  const add = useCallback(
    async (id) => {
      await wishlistService.add(id);
      await refresh();
    },
    [refresh]
  );

  const remove = useCallback(
    async (id) => {
      await wishlistService.remove(id);
      await refresh();
    },
    [refresh]
  );

  const toggle = useCallback(
    async (id) => {
      if (ids.has(Number(id))) await remove(id);
      else await add(id);
    },
    [ids, add, remove]
  );

  const value = useMemo(
    () => ({ items, ids, has, count: items.length, isCustomer, refresh, add, remove, toggle }),
    [items, ids, has, isCustomer, refresh, add, remove, toggle]
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};

export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist debe usarse dentro de <WishlistProvider>");
  return ctx;
};
