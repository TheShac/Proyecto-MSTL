import * as OrderService from '../services/orders.service.js';

// ── Helpers de respuesta ──────────────────────────────────────────────────────

const handle = (res, error) => {
  console.error(error);
  res.status(error.status ?? 500).json({ success: false, message: error.message ?? 'Error interno.' });
};

// ── Admin ─────────────────────────────────────────────────────────────────────

export const getAllOrders = async (req, res) => {
  try {
    const data = await OrderService.getAllOrders();
    res.json({ success: true, data });
  } catch (e) { handle(res, e); }
};

export const getOrderById = async (req, res) => {
  try {
    const data = await OrderService.getOrderById(req.params.id);
    res.json({ success: true, data });
  } catch (e) { handle(res, e); }
};

export const updateOrderStatus = async (req, res) => {
  try {
    await OrderService.updateOrderStatus(req.params.id, req.body.estado);
    res.json({ success: true, message: 'Estado actualizado.' });
  } catch (e) { handle(res, e); }
};

// ── Customer cart ─────────────────────────────────────────────────────────────

export const getMyCart = async (req, res) => {
  try {
    const data = await OrderService.getMyCart(req.user.id);
    res.json({ success: true, data });
  } catch (e) { handle(res, e); }
};

export const addOrUpdateCartItem = async (req, res) => {
  try {
    const data = await OrderService.addOrUpdateCartItem(req.user.id, req.body);
    res.json({ success: true, message: 'Carrito actualizado.', data });
  } catch (e) { handle(res, e); }
};

export const removeCartItem = async (req, res) => {
  try {
    const data = await OrderService.removeCartItem(req.user.id, req.params.id_producto);
    res.json({ success: true, message: 'Producto eliminado del carrito.', data });
  } catch (e) { handle(res, e); }
};

export const saveCustomerInfo = async (req, res) => {
  try {
    await OrderService.saveCustomerInfo(req.user.id, req.body);
    res.json({ success: true, message: 'Datos del pedido guardados.' });
  } catch (e) { handle(res, e); }
};

export const saveShippingAddress = async (req, res) => {
  try {
    const data = await OrderService.saveShippingAddress(req.user.id, req.body);
    res.json({ success: true, message: 'Dirección guardada.', data });
  } catch (e) { handle(res, e); }
};

export const checkoutCart = async (req, res) => {
  try {
    const data = await OrderService.checkoutCustomerCart(req.user.id, req.body);
    res.json({ success: true, message: 'Pedido confirmado (pendiente).', data });
  } catch (e) { handle(res, e); }
};

// ── Guest cart ────────────────────────────────────────────────────────────────

export const createGuestCart = async (req, res) => {
  try {
    const data = await OrderService.createGuestCart();
    res.json({ success: true, data });
  } catch (e) { handle(res, e); }
};

export const getGuestCart = async (req, res) => {
  try {
    const data = await OrderService.getGuestCart(req.params.uuid_pedido);
    res.json({ success: true, data });
  } catch (e) { handle(res, e); }
};

export const addOrUpdateGuestCartItem = async (req, res) => {
  try {
    const data = await OrderService.addOrUpdateGuestCartItem(req.params.uuid_pedido, req.body);
    res.json({ success: true, message: 'Carrito actualizado.', data });
  } catch (e) { handle(res, e); }
};

export const removeGuestCartItem = async (req, res) => {
  try {
    const data = await OrderService.removeGuestCartItem(req.params.uuid_pedido, req.params.id_producto);
    res.json({ success: true, message: 'Producto eliminado.', data });
  } catch (e) { handle(res, e); }
};

export const saveGuestCustomerInfo = async (req, res) => {
  try {
    await OrderService.saveGuestCustomerInfo(req.params.uuid_pedido, req.body);
    res.json({ success: true, message: 'Datos del pedido guardados.' });
  } catch (e) { handle(res, e); }
};

export const saveGuestShippingAddress = async (req, res) => {
  try {
    const data = await OrderService.saveGuestShippingAddress(req.params.uuid_pedido, req.body);
    res.json({ success: true, message: 'Dirección guardada.', data });
  } catch (e) { handle(res, e); }
};

export const checkoutGuestCart = async (req, res) => {
  try {
    const data = await OrderService.checkoutGuestCart(req.params.uuid_pedido, req.body);
    res.json({ success: true, message: 'Pedido confirmado (pendiente).', data });
  } catch (e) { handle(res, e); }
};