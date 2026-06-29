import api from "../../../../services/api";

export const getFeaturedProducts = ({ limit = 16 } = {}) =>
  api.get("/products/catalog", {
    params: { page: 1, limit, sort: "newest" },
  });
