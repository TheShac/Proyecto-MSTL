import axios from "axios";

const API_FEATURED = "http://localhost:3000/api/featured";
const API_PRODUCTS = "http://localhost:3000/api/products";

const authHeaders = (token) => ({
  Authorization: token ? `Bearer ${token}` : "",
});

export const getFeaturedAdmin = async (token) => {
  const { data } = await axios.get(`${API_FEATURED}/admin`, {
    headers: authHeaders(token),
  });
  return data;
};

export const addFeatured = async (payload, token) => {
  const { data } = await axios.post(`${API_FEATURED}`, payload, {
    headers: { ...authHeaders(token), "Content-Type": "application/json" },
  });
  return data;
};

export const updateFeatured = async (id_producto, payload, token) => {
  const { data } = await axios.put(`${API_FEATURED}/${id_producto}`, payload, {
    headers: { ...authHeaders(token), "Content-Type": "application/json" },
  });
  return data;
};

export const removeFeatured = async (id_producto, token) => {
  const { data } = await axios.delete(`${API_FEATURED}/${id_producto}`, {
    headers: authHeaders(token),
  });
  return data;
};

export const reorderFeatured = async (items, token) => {
  const { data } = await axios.put(
    `${API_FEATURED}/reorder`,
    { items },
    { headers: { ...authHeaders(token), "Content-Type": "application/json" } }
  );
  return data;
};

export const searchProductsForFeatured = async ({ page = 1, limit = 8, search = "" }) => {
  const { data } = await axios.get(`${API_PRODUCTS}/catalog`, {
    params: { page, limit, search, sort: "newest" },
  });
  return data;
};
