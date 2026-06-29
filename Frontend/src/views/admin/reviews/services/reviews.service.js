import api from "../../../../services/api";

const BASE = "/admin/reviews";

export const adminReviewsService = {
  list: () => api.get(BASE),
  remove: (id) => api.del(`${BASE}/${id}`),
};
