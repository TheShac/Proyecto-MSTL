import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import { ordersCustomerService } from "../views/client/orders/services/orders.customer.service";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  // Solo cargamos si hay carrito (cliente logueado o invitado con carrito ya
  // creado), para no crear carritos de invitado vacíos en cada visita.
  const refresh = useCallback(async () => {
    const hasCart =
      ordersCustomerService.isLogged() || ordersCustomerService.getGuestCartId();
    if (!hasCart) {
      setItems([]);
      return;
    }

    setLoading(true);
    try {
      const res = await ordersCustomerService.getCart();
      setItems(res?.data?.items || []);
    } catch (e) {
      console.error("No se pudo cargar el carrito:", e);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // Agrega +qty a la cantidad actual del producto (el backend usa cantidad absoluta).
  const addToCart = useCallback(
    async (product, qty = 1) => {
      const id = product.id_producto;
      const current = items.find((it) => it.id_producto === id);
      const nextQty = Number(current?.cantidad || 0) + qty;
      const res = await ordersCustomerService.upsertItem({
        id_producto: id,
        cantidad: nextQty,
      });
      await refresh();
      return res;
    },
    [items, refresh]
  );

  const setQty = useCallback(
    async (id_producto, cantidad) => {
      await ordersCustomerService.upsertItem({ id_producto, cantidad });
      await refresh();
    },
    [refresh]
  );

  const removeItem = useCallback(
    async (id_producto) => {
      await ordersCustomerService.removeItem(id_producto);
      await refresh();
    },
    [refresh]
  );

  const count = useMemo(
    () => items.reduce((acc, it) => acc + Number(it.cantidad || 0), 0),
    [items]
  );

  const subtotal = useMemo(
    () =>
      items.reduce(
        (acc, it) => acc + Number(it.cantidad || 0) * Number(it.precio_unitario || 0),
        0
      ),
    [items]
  );

  const value = useMemo(
    () => ({
      items,
      count,
      subtotal,
      loading,
      isOpen,
      openCart,
      closeCart,
      refresh,
      addToCart,
      setQty,
      removeItem,
    }),
    [items, count, subtotal, loading, isOpen, openCart, closeCart, refresh, addToCart, setQty, removeItem]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart debe usarse dentro de <CartProvider>");
  return ctx;
};
