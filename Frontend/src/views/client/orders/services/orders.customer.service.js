import axios from "axios";

const API = "http://localhost:3000/api/orders";
const LS_CART_ID = "guestCartId";

const getToken = () =>
  localStorage.getItem("accessToken") || localStorage.getItem("token") || "";

const authHeaders = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

const readGuestCartId = () => localStorage.getItem(LS_CART_ID) || "";
const saveGuestCartId = (id) => localStorage.setItem(LS_CART_ID, id);
const clearGuestCartId = () => localStorage.removeItem(LS_CART_ID);

export const ordersCustomerService = {
  // -------- Helpers --------
  isLogged: () => !!getToken(),
  getGuestCartId: () => readGuestCartId(),
  clearGuestCartId,

  // -------- Carrito: Obtener (registrado / invitado) --------
  getCart: async () => {
    const token = getToken();

    if (token) {
      const res = await axios.get(`${API}/customer/cart`, authHeaders(token));
      return res.data; // { success, data: { order, items } } o data: null
    }

    // invitado
    let cartId = readGuestCartId();
    if (!cartId) {
      const created = await axios.post(`${API}/guest/cart`);
      cartId = created?.data?.data?.uuid_pedido;
      if (cartId) saveGuestCartId(cartId);
    }

    const res = await axios.get(`${API}/guest/cart/${cartId}`);
    return res.data;
  },

  // -------- Carrito: Agregar/actualizar item --------
  upsertItem: async ({ id_producto, cantidad }) => {
    const token = getToken();

    if (token) {
      const res = await axios.post(
        `${API}/customer/cart/items`,
        { id_producto, cantidad },
        authHeaders(token)
      );
      return res.data;
    }

    let cartId = readGuestCartId();
    if (!cartId) {
      const created = await axios.post(`${API}/guest/cart`);
      cartId = created?.data?.data?.uuid_pedido;
      if (cartId) saveGuestCartId(cartId);
    }

    const res = await axios.post(`${API}/guest/cart/${cartId}/items`, {
      id_producto,
      cantidad,
    });
    return res.data;
  },

  // -------- Carrito: Quitar item --------
  removeItem: async (id_producto) => {
    const token = getToken();

    if (token) {
      const res = await axios.delete(
        `${API}/customer/cart/items/${id_producto}`,
        authHeaders(token)
      );
      return res.data;
    }

    const cartId = readGuestCartId();
    if (!cartId) throw new Error("No hay carrito invitado.");

    const res = await axios.delete(
      `${API}/guest/cart/${cartId}/items/${id_producto}`
    );
    return res.data;
  },

  // -------- Guardar datos del pedido (nombre/apellido/email/telefono) --------
  saveCustomerInfo: async ({ nombre, apellido, email, telefono }) => {
    const token = getToken();

    if (token) {
      const res = await axios.put(
        `${API}/customer/cart/customer-info`,
        { nombre, apellido, email, telefono },
        authHeaders(token)
      );
      return res.data;
    }

    const cartId = readGuestCartId();
    if (!cartId) throw new Error("No hay carrito invitado.");

    const res = await axios.put(`${API}/guest/cart/${cartId}/customer-info`, {
      nombre,
      apellido,
      email,
      telefono,
    });
    return res.data;
  },

  // -------- Guardar dirección (solo si envio) --------
  saveAddress: async ({ direccion, ciudad, pais, codigo_postal }) => {
    const token = getToken();

    if (token) {
      const res = await axios.put(
        `${API}/customer/cart/address`,
        { direccion, ciudad, pais, codigo_postal },
        authHeaders(token)
      );
      return res.data;
    }

    const cartId = readGuestCartId();
    if (!cartId) throw new Error("No hay carrito invitado.");

    const res = await axios.put(`${API}/guest/cart/${cartId}/address`, {
      direccion,
      ciudad,
      pais,
      codigo_postal,
    });
    return res.data;
  },

  // -------- Checkout --------
  checkout: async ({ metodo_entra }) => {
    const token = getToken();

    if (token) {
      const res = await axios.post(
        `${API}/customer/cart/checkout`,
        { metodo_entra },
        authHeaders(token)
      );
      return res.data;
    }

    const cartId = readGuestCartId();
    if (!cartId) throw new Error("No hay carrito invitado.");

    const res = await axios.post(`${API}/guest/cart/${cartId}/checkout`, {
      metodo_entra,
    });

    // si checkout ok, puedes limpiar carrito invitado
    if (res?.data?.success) clearGuestCartId();
    return res.data;
  },
};
