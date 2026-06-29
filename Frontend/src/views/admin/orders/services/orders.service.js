import api from "../../../../services/api";

// Montado en el backend bajo /api/admin/orders
const BASE = "/admin/orders";

export const ordersService = {
  // GET /api/admin/orders → { success, data: [...] }
  list: () => api.get(BASE),

  // GET /api/admin/orders/:id → { success, data: { order, items, address } }
  getById: (uuid_pedido) => api.get(`${BASE}/${uuid_pedido}`),

  // PATCH /api/admin/orders/:id/status  body: { estado }
  updateStatus: (uuid_pedido, estado) =>
    api.patch(`${BASE}/${uuid_pedido}/status`, { estado }),
};
