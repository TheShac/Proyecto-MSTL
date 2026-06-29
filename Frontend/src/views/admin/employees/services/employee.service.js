import api from "../../../../services/api";

// Montado en el backend bajo /api/admin/employees
const BASE = "/admin/employees";

export const employeeService = {
  async list() {
    const data = await api.get(BASE);
    return data ?? [];
  },

  create: (payload) => api.post(BASE, payload),

  update: (id, payload) => api.put(`${BASE}/${id}`, payload),

  remove: (id) => api.del(`${BASE}/${id}`),
};
