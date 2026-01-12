// src/views/admin/products/offers/services/offersService.js
import axios from "axios";

const API_OFFERS = "http://localhost:3000/api/offers";
const API_PRODUCTS = "http://localhost:3000/api/products";

const authHeaders = (token) => ({
  Authorization: token ? `Bearer ${token}` : "",
});

// Admin
export const getOffersAdmin = async (token) => {
  const { data } = await axios.get(`${API_OFFERS}/admin`, {
    headers: authHeaders(token),
  });
  return data; // {success, data}
};

// Crear/actualizar oferta por producto
export const upsertOffer = async (id_producto, payload, token) => {
  // payload: { precio_oferta, activo, fecha_inicio, fecha_fin }
  const { data } = await axios.post(`${API_OFFERS}/${id_producto}`, payload, {
    headers: { ...authHeaders(token), "Content-Type": "application/json" },
  });
  return data;
};

export const removeOffer = async (id_producto, token) => {
  const { data } = await axios.delete(`${API_OFFERS}/${id_producto}`, {
    headers: authHeaders(token),
  });
  return data;
};

// Masivo (aplicar a varios)
export const applyOfferBulk = async (payload, token) => {
  // payload: { productIds: [1,2], template: { precio_oferta, activo, fecha_inicio, fecha_fin } }
  const { data } = await axios.post(`${API_OFFERS}/bulk`, payload, {
    headers: { ...authHeaders(token), "Content-Type": "application/json" },
  });
  return data;
};

// Buscar productos (reutiliza tu catalog)
export const searchProductsForOffers = async ({ page = 1, limit = 8, search = "" }) => {
  const { data } = await axios.get(`${API_PRODUCTS}/catalog`, {
    params: { page, limit, search, sort: "newest" },
  });
  return data;
};
