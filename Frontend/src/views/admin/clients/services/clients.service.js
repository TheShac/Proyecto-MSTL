import api from "../../../../services/api";

// Montado en el backend bajo /api/admin/users
const BASE = "/admin/users";

export const clientsService = {
  list: () => api.get(BASE),
  getById: (id) => api.get(`${BASE}/${id}`),
  remove: (id) => api.del(`${BASE}/${id}`),
};
