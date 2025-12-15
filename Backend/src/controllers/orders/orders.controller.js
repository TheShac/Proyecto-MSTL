import { OrderModel } from "../../models/orders/order.model.js";

const ALLOWED_EMPLOYEE = ["stl_administrador", "stl_superadministrador"];

const requireAdmin = (req, res) => {
  if (!req.user || req.user.userType !== "employee") {
    res.status(403).json({ message: "Solo empleados." });
    return false;
  }
  if (!ALLOWED_EMPLOYEE.includes(req.user.role)) {
    res.status(403).json({ message: "Acceso restringido." });
    return false;
  }
  return true;
};

// GET /api/orders
export const getAllOrders = async (req, res) => {
  if (!requireAdmin(req, res)) return;

  try {
    const orders = await OrderModel.findAll();
    res.json({ success: true, data: orders });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Error al listar pedidos." });
  }
};

// GET /api/orders/:id
export const getOrderById = async (req, res) => {
  if (!requireAdmin(req, res)) return;

  try {
    const order = await OrderModel.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Pedido no encontrado." });
    }
    res.json({ success: true, data: order });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Error al obtener pedido." });
  }
};

// PATCH /api/orders/:id/status
export const updateOrderStatus = async (req, res) => {
  if (!requireAdmin(req, res)) return;

  const { estado } = req.body;
  const allowed = ["pendiente", "pagado", "enviado", "entregado", "cancelado"];

  if (!allowed.includes(estado)) {
    return res.status(400).json({ message: "Estado inválido." });
  }

  try {
    const ok = await OrderModel.updateStatus(req.params.id, estado);
    if (!ok) {
      return res.status(404).json({ message: "Pedido no encontrado." });
    }

    res.json({ success: true, message: "Estado actualizado." });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Error al actualizar estado." });
  }
};
