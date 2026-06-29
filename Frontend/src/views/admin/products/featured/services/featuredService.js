import api from "../../../../../services/api";

// Destacados — portal admin: /api/admin/featured
const BASE = "/admin/featured";

export const getFeaturedAdmin = () => api.get(`${BASE}/admin`);

export const addFeatured = (payload) => api.post(BASE, payload);

export const updateFeatured = (id_producto, payload) =>
  api.put(`${BASE}/${id_producto}`, payload);

export const removeFeatured = (id_producto) => api.del(`${BASE}/${id_producto}`);

export const reorderFeatured = (items) => api.put(`${BASE}/reorder`, { items });

// Buscador del modal — catálogo público
export const searchProductsForFeatured = ({ page = 1, limit = 8, search = "" }) =>
  api.get("/products/catalog", {
    params: { page, limit, search, sort: "newest" },
  });
