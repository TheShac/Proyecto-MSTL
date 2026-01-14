import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:3000";

// ======= OFFERS =======
export const getOffersAdmin = async (token) => {
  const { data } = await axios.get(`${API}/api/offers/admin`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export const addOffer = async (payload, token) => {
  const { data } = await axios.post(`${API}/api/offers`, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export const updateOffer = async (id_producto, payload, token) => {
  const { data } = await axios.put(`${API}/api/offers/${id_producto}`, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export const removeOffer = async (id_producto, token) => {
  const { data } = await axios.delete(`${API}/api/offers/${id_producto}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

// ======= PRODUCTS (para el buscador del modal) =======
// Usamos /api/products que tú ya tienes en backend
export const getAllProductsForOffer = async (token) => {
  const { data } = await axios.get(`${API}/api/products`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data; // {success, data:[...]}
};
