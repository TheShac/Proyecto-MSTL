import api from "../../../../services/api";

// Montado en el backend bajo /api/admin/inventory
const BASE = "/admin/inventory";

export const inventoryService = {
  listProducts: () => api.get(`${BASE}/products`),

  adjustStock: (payload) => api.post(`${BASE}/adjust`, payload),

  listMovements: () => api.get(`${BASE}/movements`),
};
