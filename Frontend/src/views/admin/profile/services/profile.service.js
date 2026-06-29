import api from "../../../../services/api";

// Montado en el backend bajo /api/admin/profile
const BASE = "/admin/profile";

export const profileService = {
  me: () => api.get(BASE),

  updateMe: (payload) => api.put(BASE, payload),

  saveAddress: (payload) => api.put(`${BASE}/address`, payload),

  changePassword: (payload) => api.patch(`${BASE}/password`, payload),
};
