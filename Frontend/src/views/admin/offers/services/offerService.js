import api from "../../../../services/api";

// ======= OFFERS (portal admin: /api/admin/offers) =======
export const getOffersAdmin = () => api.get("/admin/offers/admin");

export const addOffer = (payload) => api.post("/admin/offers", payload);

export const updateOffer = (id_producto, payload) =>
  api.put(`/admin/offers/${id_producto}`, payload);

export const removeOffer = (id_producto) =>
  api.del(`/admin/offers/${id_producto}`);

// ======= PRODUCTS (buscador del modal — listado público) =======
export const getAllProductsForOffer = () => api.get("/products");
