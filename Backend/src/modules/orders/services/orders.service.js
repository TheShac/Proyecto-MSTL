import { OrderModel }         from '../models/order.model.js';
import { OrderCustomerModel } from '../models/orders.customer.model.js';
import { OrderGuestModel }    from '../models/orders.guest.model.js';
import { ShippingModel }      from '../../shipping/models/shipping.model.js';

const VALID_STATUSES  = ['pendiente', 'pagado', 'enviado', 'entregado', 'cancelado'];
const isValidEmail    = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || '').trim());

// Calcula el costo de envío según método y tarifa seleccionada (si aplica).
const resolveShippingCost = async (metodo_entrega, id_tarifa) => {
  if (metodo_entrega !== 'envio' || !id_tarifa) return 0;
  const tarifa = await ShippingModel.findById(Number(id_tarifa));
  return tarifa ? Number(tarifa.precio) : 0;
};

// ── Admin ─────────────────────────────────────────────────────────────────────

export const getAllOrders = async () => OrderModel.findAll();

export const getOrderTracking = async (uuid_pedido) => {
  const tracking = await OrderModel.findTracking(uuid_pedido);
  if (!tracking) throw { status: 404, message: 'No se encontró un pedido con ese código.' };
  return tracking;
};

export const getOrderById = async (id) => {
  const order = await OrderModel.findById(id);
  if (!order) throw { status: 404, message: 'Pedido no encontrado.' };
  return order;
};

export const updateOrderStatus = async (id, estado) => {
  if (!VALID_STATUSES.includes(estado))
    throw { status: 400, message: 'Estado inválido.' };

  const ok = await OrderModel.updateStatus(id, estado);
  if (!ok) throw { status: 404, message: 'Pedido no encontrado.' };
};

// ── Customer orders ─────────────────────────────────────────────────────────

export const getMyOrders = async (uuid_customer) =>
  OrderCustomerModel.findOrdersByCustomer(uuid_customer);

export const payCustomerOrder = async (uuid_customer, uuid_pedido) => {
  const ok = await OrderCustomerModel.markOrderPaid(uuid_customer, uuid_pedido);
  if (!ok) throw { status: 400, message: 'No se pudo procesar el pago. El pedido no existe, no es tuyo o ya fue pagado.' };
};

export const payGuestOrder = async (uuid_pedido) => {
  const ok = await OrderGuestModel.markOrderPaid(uuid_pedido);
  if (!ok) throw { status: 400, message: 'No se pudo procesar el pago. El pedido no existe o ya fue pagado.' };
};

// ── Customer cart ─────────────────────────────────────────────────────────────

export const getMyCart = async (uuid_customer) => {
  const cart = await OrderCustomerModel.findCartByCustomer(uuid_customer);
  if (!cart) return null;
  const items = await OrderCustomerModel.listCartItems(cart.uuid_pedido);
  return { order: cart, items };
};

export const addOrUpdateCartItem = async (uuid_customer, { id_producto, cantidad }) => {
  const id  = Number(id_producto);
  const qty = Number(cantidad);

  if (!id || Number.isNaN(id))
    throw { status: 400, message: 'id_producto inválido.' };
  if (!Number.isFinite(qty) || !Number.isInteger(qty) || qty < 0)
    throw { status: 400, message: 'cantidad inválida. Debe ser entero >= 0.' };

  let cart = await OrderCustomerModel.findCartByCustomer(uuid_customer);
  if (!cart) cart = await OrderCustomerModel.createCart(uuid_customer);

  const result = await OrderCustomerModel.upsertCartItem({ uuid_pedido: cart.uuid_pedido, id_producto: id, cantidad: qty });
  const items  = await OrderCustomerModel.listCartItems(cart.uuid_pedido);

  return { uuid_pedido: cart.uuid_pedido, subtotal: result.subtotal, items };
};

export const removeCartItem = async (uuid_customer, id_producto) => {
  const id = Number(id_producto);
  if (!id || Number.isNaN(id)) throw { status: 400, message: 'id_producto inválido.' };

  const cart = await OrderCustomerModel.findCartByCustomer(uuid_customer);
  if (!cart) throw { status: 404, message: 'No hay carrito activo.' };

  const result = await OrderCustomerModel.upsertCartItem({ uuid_pedido: cart.uuid_pedido, id_producto: id, cantidad: 0 });
  const items  = await OrderCustomerModel.listCartItems(cart.uuid_pedido);

  return { uuid_pedido: cart.uuid_pedido, subtotal: result.subtotal, items };
};

export const saveCustomerInfo = async (uuid_customer, { nombre, apellido, email, telefono }) => {
  if (!nombre || !apellido || !email)
    throw { status: 400, message: 'nombre, apellido y email son obligatorios.' };
  if (!isValidEmail(email))
    throw { status: 400, message: 'Email inválido.' };

  const cart = await OrderCustomerModel.findCartByCustomer(uuid_customer);
  if (!cart) throw { status: 404, message: 'No hay carrito activo.' };

  await OrderCustomerModel.updateCustomerInfo({
    uuid_pedido: cart.uuid_pedido,
    nombre:      String(nombre).trim(),
    apellido:    String(apellido).trim(),
    email:       String(email).trim(),
    telefono:    telefono ? String(telefono).trim() : '',
  });
};

export const saveShippingAddress = async (uuid_customer, { direccion, ciudad, pais, codigo_postal }) => {
  if (!direccion || !ciudad || !pais)
    throw { status: 400, message: 'direccion, ciudad y pais son obligatorios.' };

  const cart = await OrderCustomerModel.findCartByCustomer(uuid_customer);
  if (!cart) throw { status: 404, message: 'No hay carrito activo.' };

  const addr = await OrderCustomerModel.upsertAddressForCustomer({
    uuid_customer,
    direccion:      String(direccion).trim(),
    ciudad:         String(ciudad).trim(),
    pais:           String(pais).trim(),
    codigo_postal:  codigo_postal ? String(codigo_postal).trim() : null,
  });

  await OrderCustomerModel.attachAddressToOrder({ uuid_pedido: cart.uuid_pedido, id_address: addr.id_address });
  return addr;
};

export const checkoutCustomerCart = async (uuid_customer, { metodo_entrega, id_tarifa }) => {
  if (!metodo_entrega || !['retiro', 'envio'].includes(metodo_entrega))
    throw { status: 400, message: 'metodo_entrega inválido. Use retiro o envio.' };

  const cart = await OrderCustomerModel.findCartByCustomer(uuid_customer);
  if (!cart) throw { status: 404, message: 'No hay carrito activo.' };

  const costo_envio = await resolveShippingCost(metodo_entrega, id_tarifa);
  return OrderCustomerModel.checkoutCart({ uuid_pedido: cart.uuid_pedido, metodo_entrega, costo_envio });
};

// ── Guest cart ────────────────────────────────────────────────────────────────

export const createGuestCart = async () => OrderGuestModel.createCart();

export const getGuestCart = async (uuid_pedido) => {
  const order = await OrderGuestModel.findCartById(uuid_pedido);
  if (!order) throw { status: 404, message: 'Carrito no encontrado.' };
  const items = await OrderGuestModel.listCartItems(uuid_pedido);
  return { order, items };
};

export const addOrUpdateGuestCartItem = async (uuid_pedido, { id_producto, cantidad }) => {
  const id  = Number(id_producto);
  const qty = Number(cantidad);

  if (!id || Number.isNaN(id))
    throw { status: 400, message: 'id_producto inválido.' };
  if (!Number.isFinite(qty) || !Number.isInteger(qty) || qty < 0)
    throw { status: 400, message: 'cantidad inválida. Debe ser entero >= 0.' };

  const order = await OrderGuestModel.findCartById(uuid_pedido);
  if (!order) throw { status: 404, message: 'Carrito no encontrado.' };

  const result = await OrderGuestModel.upsertCartItem({ uuid_pedido, id_producto: id, cantidad: qty });
  const items  = await OrderGuestModel.listCartItems(uuid_pedido);

  return { uuid_pedido, subtotal: result.subtotal, items };
};

export const removeGuestCartItem = async (uuid_pedido, id_producto) => {
  const id = Number(id_producto);
  if (!id || Number.isNaN(id)) throw { status: 400, message: 'id_producto inválido.' };

  const result = await OrderGuestModel.upsertCartItem({ uuid_pedido, id_producto: id, cantidad: 0 });
  const items  = await OrderGuestModel.listCartItems(uuid_pedido);

  return { uuid_pedido, subtotal: result.subtotal, items };
};

export const saveGuestCustomerInfo = async (uuid_pedido, { nombre, apellido, email, telefono }) => {
  if (!nombre || !apellido || !email)
    throw { status: 400, message: 'nombre, apellido y email son obligatorios.' };
  if (!isValidEmail(email))
    throw { status: 400, message: 'Email inválido.' };

  await OrderGuestModel.updateCustomerInfo({
    uuid_pedido,
    nombre:   String(nombre).trim(),
    apellido: String(apellido).trim(),
    email:    String(email).trim(),
    telefono: telefono ? String(telefono).trim() : '',
  });
};

export const saveGuestShippingAddress = async (uuid_pedido, { direccion, ciudad, pais, codigo_postal }) => {
  if (!direccion || !ciudad || !pais)
    throw { status: 400, message: 'direccion, ciudad y pais son obligatorios.' };

  const addr = await OrderGuestModel.createAddressGuest({
    direccion:     String(direccion).trim(),
    ciudad:        String(ciudad).trim(),
    pais:          String(pais).trim(),
    codigo_postal: codigo_postal ? String(codigo_postal).trim() : null,
  });

  await OrderGuestModel.attachAddressToOrder({ uuid_pedido, id_address: addr.id_address });
  return addr;
};

export const checkoutGuestCart = async (uuid_pedido, { metodo_entrega, id_tarifa }) => {
  if (!metodo_entrega || !['retiro', 'envio'].includes(metodo_entrega))
    throw { status: 400, message: 'metodo_entrega inválido. Use retiro o envio.' };

  const costo_envio = await resolveShippingCost(metodo_entrega, id_tarifa);
  return OrderGuestModel.checkoutCart({ uuid_pedido, metodo_entrega, costo_envio });
};