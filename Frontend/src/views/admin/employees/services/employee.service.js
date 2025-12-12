import axios from "axios";

const API_URL = "http://localhost:3000/api/employees";

const authHeaders = (token) => ({
  Authorization: token ? `Bearer ${token}` : "",
});

export const employeeService = {
  async list(token) {
    const res = await axios.get(API_URL, { headers: authHeaders(token) });
    return res.data ?? [];
  },

  async create(payload, token) {
    const res = await axios.post(API_URL, payload, {
      headers: { ...authHeaders(token), "Content-Type": "application/json" },
    });
    return res.data;
  },

  async update(id, payload, token) {
    const res = await axios.put(`${API_URL}/${id}`, payload, {
      headers: { ...authHeaders(token), "Content-Type": "application/json" },
    });
    return res.data;
  },

  async remove(id, token) {
    const res = await axios.delete(`${API_URL}/${id}`, {
      headers: authHeaders(token),
    });
    return res.data;
  },
};
