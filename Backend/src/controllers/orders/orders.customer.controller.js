import { OrderCustomerModel } from "../../models/orders/orders.customer.model.js";

const requireCustomer = (req, res) => {
  if (!req.user) {
    res.status(401).json({ message: "No autenticado." });
    return false;
  }
  if (req.user.userType !== "customer") {
    res.status(403).json({ message: "Solo clientes pueden acceder a esta función." });
    return false;
  }
  return true;
};

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || "").trim());

// GET /api/orders/customer/cart
export const getMyCart = async (req, res) => {
  if (!requireCustomer(req, res)) return;

  try {
    const uuid_customer = req.user.id;
    const cart = await OrderCustomerModel.findCartByCustomer(uuid_customer);

    if (!cart) {
      return res.json({ success: true, data: null });
    }

    const items = await OrderCustomerModel.listCartItems(cart.uuid_pedido);

    return res.json({
      success: true,
      data: {
        order: cart,
        items,
      },
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ success: false, message: "Error interno al obtener el carrito." });
  }
};

// POST /api/orders/customer/cart/items
// body: { id_producto, cantidad }
export const addOrUpdateCartItem = async (req, res) => {
  if (!requireCustomer(req, res)) return;

  try {
    const uuid_customer = req.user.id;
    const { id_producto, cantidad } = req.body;

    const id = Number(id_producto);
    const qty = Number(cantidad);

    if (!id || Number.isNaN(id)) {
      return res.status(400).json({ message: "id_producto inválido." });
    }
    if (!Number.isFinite(qty) || !Number.isInteger(qty) || qty < 0) {
      return res.status(400).json({ message: "cantidad inválida. Debe ser entero >= 0." });
    }

    let cart = await OrderCustomerModel.findCartByCustomer(uuid_customer);
    if (!cart) cart = await OrderCustomerModel.createCart(uuid_customer);

    const result = await OrderCustomerModel.upsertCartItem({
      uuid_pedido: cart.uuid_pedido,
      id_producto: id,
      cantidad: qty,
    });

    const items = await OrderCustomerModel.listCartItems(cart.uuid_pedido);

    return res.json({
      success: true,
      message: "Carrito actualizado.",
      data: {
        uuid_pedido: cart.uuid_pedido,
        subtotal: result.subtotal,
        items,
      },
    });
  } catch (e) {
    console.error(e);
    const status = e.status || 500;
    return res.status(status).json({ success: false, message: e.message || "Error interno." });
  }
};

// DELETE /api/orders/customer/cart/items/:id_producto
export const removeCartItem = async (req, res) => {
  if (!requireCustomer(req, res)) return;

  try {
    const uuid_customer = req.user.id;
    const id = Number(req.params.id_producto);

    if (!id || Number.isNaN(id)) {
      return res.status(400).json({ message: "id_producto inválido." });
    }

    const cart = await OrderCustomerModel.findCartByCustomer(uuid_customer);
    if (!cart) {
      return res.status(404).json({ message: "No hay carrito activo." });
    }

    const result = await OrderCustomerModel.upsertCartItem({
      uuid_pedido: cart.uuid_pedido,
      id_producto: id,
      cantidad: 0,
    });

    const items = await OrderCustomerModel.listCartItems(cart.uuid_pedido);

    return res.json({
      success: true,
      message: "Producto eliminado del carrito.",
      data: {
        uuid_pedido: cart.uuid_pedido,
        subtotal: result.subtotal,
        items,
      },
    });
  } catch (e) {
    console.error(e);
    const status = e.status || 500;
    return res.status(status).json({ success: false, message: e.message || "Error interno al eliminar item." });
  }
};

// PUT /api/orders/customer/cart/customer-info
export const saveCustomerInfo = async (req, res) => {
  if (!requireCustomer(req, res)) return;

  try {
    const uuid_customer = req.user.id;
    const { nombre, apellido, email, telefono } = req.body;

    if (!nombre || !apellido || !email) {
      return res.status(400).json({ message: "nombre, apellido y email son obligatorios." });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Email inválido." });
    }

    const cart = await OrderCustomerModel.findCartByCustomer(uuid_customer);
    if (!cart) {
      return res.status(404).json({ message: "No hay carrito activo." });
    }

    await OrderCustomerModel.updateCustomerInfo({
      uuid_pedido: cart.uuid_pedido,
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

// PUT /api/orders/customer/cart/address
export const saveShippingAddress = async (req, res) => {
  if (!requireCustomer(req, res)) return;

  try {
    const uuid_customer = req.user.id;
    const { direccion, ciudad, pais, codigo_postal } = req.body;

    if (!direccion || !ciudad || !pais) {
      return res.status(400).json({ message: "direccion, ciudad y pais son obligatorios." });
    }

    const cart = await OrderCustomerModel.findCartByCustomer(uuid_customer);
    if (!cart) {
      return res.status(404).json({ message: "No hay carrito activo." });
    }

    const addr = await OrderCustomerModel.upsertAddressForCustomer({
      uuid_customer,
      direccion: String(direccion).trim(),
      ciudad: String(ciudad).trim(),
      pais: String(pais).trim(),
      codigo_postal: codigo_postal ? String(codigo_postal).trim() : null,
    });

    await OrderCustomerModel.attachAddressToOrder({
      uuid_pedido: cart.uuid_pedido,
      id_address: addr.id_address,
    });

    return res.json({ success: true, message: "Dirección guardada.", data: addr });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ success: false, message: "Error interno guardando dirección." });
  }
};

// POST /api/orders/customer/cart/checkout
export const checkoutCart = async (req, res) => {
  if (!requireCustomer(req, res)) return;

  try {
    const uuid_customer = req.user.id;
    const { metodo_entrega } = req.body;

    if (!metodo_entrega || !["retiro", "envio"].includes(metodo_entra)) {
      return res.status(400).json({ message: "metodo_entra inválido. Use retiro o envio." });
    }

    const cart = await OrderCustomerModel.findCartByCustomer(uuid_customer);
    if (!cart) {
      return res.status(404).json({ message: "No hay carrito activo." });
    }

    // costo_envio por ahora 0 (luego lo calculas)
    const result = await OrderCustomerModel.checkoutCart({
      uuid_pedido: cart.uuid_pedido,
      metodo_entrega,
      costo_envio: 0,
    });

    return res.json({
      success: true,
      message: "Pedido confirmado (pendiente).",
      data: result,
    });
  } catch (e) {
    console.error(e);
    const status = e.status || 500;
    return res.status(status).json({ success: false, message: e.message || "Error interno checkout." });
  }
};
