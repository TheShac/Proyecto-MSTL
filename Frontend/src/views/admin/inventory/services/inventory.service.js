// src/views/admin/inventory/services/inventory.service.js
import axios from "axios";

const API = "http://localhost:3000/api/inventory";

export const inventoryService = {
  listProducts: async (token) => {
    const res = await axios.get(`${API}/products`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },

  adjustStock: async (payload, token) => {
    const res = await axios.post(`${API}/adjust`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return res.data;
  },

  listMovements: async (token) => {
    const res = await axios.get(`${API}/movements`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },
};
