import axios from 'axios';

const API_URL = 'http://localhost:3000/api/products';
const CATALOG_URL = 'http://localhost:3000/api/catalogo';

const authHeaders = (token) => ({
  Authorization: token ? `Bearer ${token}` : '',
});

export const productService = {
  async list(token) {
    const res = await axios.get(API_URL, { headers: authHeaders(token) });
    return res.data.data ?? [];
  },

  async create(payload, token) {
    const res = await axios.post(`${API_URL}/create`, payload, {
      headers: { ...authHeaders(token), 'Content-Type': 'application/json' },
    });
    return res.data;
  },

  async update(id, payload, token) {
    const res = await axios.put(`${API_URL}/${id}`, payload, {
      headers: { ...authHeaders(token), 'Content-Type': 'application/json' },
    });
    return res.data;
  },

  async remove(id, token) {
    const res = await axios.delete(`${API_URL}/${id}`, {
      headers: authHeaders(token),
    });
    return res.data;
  },

  async getEditorials() {
    const res = await axios.get(`${CATALOG_URL}/editorials`);
    return res.data.data ?? [];
  },

  async getGenres() {
    const res = await axios.get(`${CATALOG_URL}/genres`);
    return res.data.data ?? [];
  },
};
