import axios from "axios";

const API = "http://localhost:3000/api/orders";

export const ordersService = {
  // GET /api/orders
  list: async (token) => {
    const res = await axios.get(`${API}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data; // { success, data: [...] }
  },

  // GET /api/orders/:id
  getById: async (uuid_pedido, token) => {
    const res = await axios.get(`${API}/${uuid_pedido}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data; // { success, data: { order, items, address } }
  },

  // PUT /api/orders/:id/status  body: { estado }
  updateStatus: async (uuid_pedido, estado, token) => {
    const res = await axios.put(
      `${API}/${uuid_pedido}/status`,
      { estado },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
  },
};
