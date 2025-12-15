import { OrderGuestModel } from "../../models/orders/orders.guest.model.js";

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || "").trim());

// POST /api/orders/guest/cart
export const createGuestCart = async (req, res) => {
  try {
    const cart = await OrderGuestModel.createCart();
    return res.json({ success: true, data: cart });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ success: false, message: "Error interno creando carrito invitado." });
  }
};

// GET /api/orders/guest/cart/:uuid_pedido
export const getGuestCart = async (req, res) => {
  try {
    const { uuid_pedido } = req.params;

    const order = await OrderGuestModel.findCartById(uuid_pedido);
    if (!order) return res.status(404).json({ success: false, message: "Carrito no encontrado." });

    const items = await OrderGuestModel.listCartItems(uuid_pedido);
    return res.json({ success: true, data: { order, items } });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ success: false, message: "Error interno obteniendo carrito." });
  }
};

// POST /api/orders/guest/cart/:uuid_pedido/items
export const addOrUpdateGuestCartItem = async (req, res) => {
  try {
    const { uuid_pedido } = req.params;
    const { id_producto, cantidad } = req.body;

    const id = Number(id_producto);
    const qty = Number(cantidad);

    if (!id || Number.isNaN(id)) return res.status(400).json({ message: "id_producto inválido." });
    if (!Number.isFinite(qty) || !Number.isInteger(qty) || qty < 0) {
      return res.status(400).json({ message: "cantidad inválida. Debe ser entero >= 0." });
    }

    const order = await OrderGuestModel.findCartById(uuid_pedido);
    if (!order) return res.status(404).json({ message: "Carrito no encontrado." });

    const result = await OrderGuestModel.upsertCartItem({ uuid_pedido, id_producto: id, cantidad: qty });
    const items = await OrderGuestModel.listCartItems(uuid_pedido);

    return res.json({ success: true, message: "Carrito actualizado.", data: { uuid_pedido, subtotal: result.subtotal, items } });
  } catch (e) {
    console.error(e);
    return res.status(e.status || 500).json({ success: false, message: e.message || "Error interno." });
  }
};

// DELETE /api/orders/guest/cart/:uuid_pedido/items/:id_producto
export const removeGuestCartItem = async (req, res) => {
  try {
    const { uuid_pedido, id_producto } = req.params;
    const id = Number(id_producto);

    if (!id || Number.isNaN(id)) return res.status(400).json({ message: "id_producto inválido." });

    const result = await OrderGuestModel.upsertCartItem({ uuid_pedido, id_producto: id, cantidad: 0 });
    const items = await OrderGuestModel.listCartItems(uuid_pedido);

    return res.json({ success: true, message: "Producto eliminado.", data: { uuid_pedido, subtotal: result.subtotal, items } });
  } catch (e) {
    console.error(e);
    return res.status(e.status || 500).json({ success: false, message: e.message || "Error interno." });
  }
};

// PUT /api/orders/guest/cart/:uuid_pedido/customer-info
export const saveGuestCustomerInfo = async (req, res) => {
  try {
    const { uuid_pedido } = req.params;
    const { nombre, apellido, email, telefono } = req.body;

    if (!nombre || !apellido || !email) return res.status(400).json({ message: "nombre, apellido y email son obligatorios." });
    if (!isValidEmail(email)) return res.status(400).json({ message: "Email inválido." });

    await OrderGuestModel.updateCustomerInfo({
      uuid_pedido,
      nombre: String(nombre).trim(),
      apellido: String(apellido).trim(),
      email: String(email).trim(),
      telefono: telefono ? String(telefono).trim() : "",
    });

    return res.json({ success: true, message: "Datos del pedido guardados." });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ success: false, message: "Error interno guardando datos." });
  }
};

// PUT /api/orders/guest/cart/:uuid_pedido/address
export const saveGuestShippingAddress = async (req, res) => {
  try {
    const { uuid_pedido } = req.params;
    const { direccion, ciudad, pais, codigo_postal } = req.body;

    if (!direccion || !ciudad || !pais) return res.status(400).json({ message: "direccion, ciudad y pais son obligatorios." });

    const addr = await OrderGuestModel.createAddressGuest({
      direccion: String(direccion).trim(),
      ciudad: String(ciudad).trim(),
      pais: String(pais).trim(),
      codigo_postal: codigo_postal ? String(codigo_postal).trim() : null,
    });

    await OrderGuestModel.attachAddressToOrder({ uuid_pedido, id_address: addr.id_address });

    return res.json({ success: true, message: "Dirección guardada.", data: addr });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ success: false, message: "Error interno guardando dirección." });
  }
};

// POST /api/orders/guest/cart/:uuid_pedido/checkout
export const checkoutGuestCart = async (req, res) => {
  try {
    const { uuid_pedido } = req.params;
    const { metodo_entrega } = req.body;

    if (!metodo_entrega || !["retiro", "envio"].includes(metodo_entrega)) {
      return res.status(400).json({ message: "metodo_entrega inválido. Use retiro o envio." });
    }

    const result = await OrderGuestModel.checkoutCart({ uuid_pedido, metodo_entrega, costo_envio: 0 });

    return res.json({ success: true, message: "Pedido confirmado (pendiente).", data: result });
  } catch (e) {
    console.error(e);
    return res.status(e.status || 500).json({ success: false, message: e.message || "Error interno checkout." });
  }
};
