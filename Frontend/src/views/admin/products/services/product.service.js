import api from "../../../../services/api";

// Lectura pública de productos/catálogo; escritura por el portal admin.
const PRODUCTS = "/products";          // GET público (listado)
const ADMIN_PRODUCTS = "/admin/products"; // POST/PUT/DELETE (admin)
const CATALOG = "/catalogo";           // GET público (editoriales/géneros)

export const productService = {
  async list() {
    const data = await api.get(PRODUCTS);
    return data.data ?? [];
  },

  create: (payload) => api.post(ADMIN_PRODUCTS, payload),

  update: (id, payload) => api.put(`${ADMIN_PRODUCTS}/${id}`, payload),

  remove: (id) => api.del(`${ADMIN_PRODUCTS}/${id}`),

  async getEditorials() {
    const data = await api.get(`${CATALOG}/editorials`);
    return data.data ?? [];
  },

  async getGenres() {
    const data = await api.get(`${CATALOG}/genres`);
    return data.data ?? [];
  },
};
