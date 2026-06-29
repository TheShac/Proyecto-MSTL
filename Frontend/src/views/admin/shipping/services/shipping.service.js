import api from "../../../../services/api";

const BASE = "/admin/shipping";

export const shippingService = {
  list: () => api.get(BASE),
  create: (payload) => api.post(BASE, payload),
  update: (id, payload) => api.put(`${BASE}/${id}`, payload),
  remove: (id) => api.del(`${BASE}/${id}`),
};
