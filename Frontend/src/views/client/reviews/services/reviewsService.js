import api from "../../../../services/api";

export const reviewsService = {
  // Público
  recent: (limit = 12) => api.get("/reviews/recent", { params: { limit }, auth: false }),
  byProduct: (id) => api.get(`/reviews/product/${id}`, { auth: false }),

  // Cliente autenticado
  myReview: (id) => api.get(`/customer/reviews/product/${id}`),
  create: (payload) => api.post("/customer/reviews", payload),
};
