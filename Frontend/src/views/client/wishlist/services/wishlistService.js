import api from "../../../../services/api";

const BASE = "/customer/wishlist";

export const wishlistService = {
  list: () => api.get(BASE),
  add: (id_producto) => api.post(BASE, { id_producto }),
  remove: (id_producto) => api.del(`${BASE}/${id_producto}`),
};
