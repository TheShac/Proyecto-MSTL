import api from "../../../../services/api";
import { getValidToken } from "../../../../services/token";

// Cliente registrado → /api/customer/orders/...
// Invitado          → /api/orders/guest/...
const CUSTOMER = "/customer/orders";
const GUEST = "/orders/guest";
const LS_CART_ID = "guestCartId";

// Solo se considera "cliente" si el token existe y NO está expirado;
// de lo contrario se usa el flujo de invitado.
const getToken = () => getValidToken();

const readGuestCartId = () => localStorage.getItem(LS_CART_ID) || "";
const saveGuestCartId = (id) => localStorage.setItem(LS_CART_ID, id);
const clearGuestCartId = () => localStorage.removeItem(LS_CART_ID);

// Asegura un carrito de invitado y devuelve su uuid.
const ensureGuestCartId = async () => {
  let cartId = readGuestCartId();
  if (!cartId) {
    const created = await api.post(`${GUEST}/cart`, null, { auth: false });
    cartId = created?.data?.uuid_pedido;
    if (cartId) saveGuestCartId(cartId);
  }
  return cartId;
};

export const ordersCustomerService = {
  // -------- Helpers --------
  isLogged: () => !!getToken(),
  getGuestCartId: () => readGuestCartId(),
  clearGuestCartId,

  // -------- Historial de pedidos (cliente registrado) --------
  getOrders: () => api.get(`${CUSTOMER}`),

  // -------- Pago simulado (marca el pedido como pagado) --------
  pay: (uuid_pedido) => {
    if (getToken()) return api.post(`${CUSTOMER}/${uuid_pedido}/pay`);
    return api.post(`${GUEST}/cart/${uuid_pedido}/pay`, null, { auth: false });
  },

  // -------- Seguimiento público por código de pedido --------
  track: (uuid_pedido) => api.get(`/orders/track/${uuid_pedido}`, { auth: false }),

  // -------- Tarifas de envío activas (público) --------
  shippingRates: () => api.get("/shipping", { auth: false }),

  // -------- Carrito: Obtener (registrado / invitado) --------
  getCart: async () => {
    if (getToken()) {
      return api.get(`${CUSTOMER}/cart`);
    }
    const cartId = await ensureGuestCartId();
    return api.get(`${GUEST}/cart/${cartId}`, { auth: false });
  },

  // -------- Carrito: Agregar/actualizar item --------
  upsertItem: async ({ id_producto, cantidad }) => {
    if (getToken()) {
      return api.post(`${CUSTOMER}/cart/items`, { id_producto, cantidad });
    }
    const cartId = await ensureGuestCartId();
    return api.post(`${GUEST}/cart/${cartId}/items`, { id_producto, cantidad }, { auth: false });
  },

  // -------- Carrito: Quitar item --------
  removeItem: async (id_producto) => {
    if (getToken()) {
      return api.del(`${CUSTOMER}/cart/items/${id_producto}`);
    }
    const cartId = readGuestCartId();
    if (!cartId) throw new Error("No hay carrito invitado.");
    return api.del(`${GUEST}/cart/${cartId}/items/${id_producto}`, { auth: false });
  },

  // -------- Guardar datos del pedido --------
  saveCustomerInfo: async ({ nombre, apellido, email, telefono }) => {
    const body = { nombre, apellido, email, telefono };
    if (getToken()) {
      return api.put(`${CUSTOMER}/cart/customer-info`, body);
    }
    const cartId = readGuestCartId();
    if (!cartId) throw new Error("No hay carrito invitado.");
    return api.put(`${GUEST}/cart/${cartId}/customer-info`, body, { auth: false });
  },

  // -------- Guardar dirección (solo si envío) --------
  saveAddress: async ({ direccion, ciudad, pais, codigo_postal }) => {
    const body = { direccion, ciudad, pais, codigo_postal };
    if (getToken()) {
      return api.put(`${CUSTOMER}/cart/address`, body);
    }
    const cartId = readGuestCartId();
    if (!cartId) throw new Error("No hay carrito invitado.");
    return api.put(`${GUEST}/cart/${cartId}/address`, body, { auth: false });
  },

  // -------- Checkout --------
  checkout: async ({ metodo_entrega }) => {
    const body = { metodo_entrega };
    if (getToken()) {
      return api.post(`${CUSTOMER}/cart/checkout`, body);
    }
    const cartId = readGuestCartId();
    if (!cartId) throw new Error("No hay carrito invitado.");

    const res = await api.post(`${GUEST}/cart/${cartId}/checkout`, body, { auth: false });
    if (res?.success) clearGuestCartId();
    return res;
  },
};
