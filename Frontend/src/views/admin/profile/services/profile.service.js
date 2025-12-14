import axios from 'axios';

const API = 'http://localhost:3000/api/profile';

export const profileService = {
  me: async (token) => {
    const res = await axios.get(`${API}/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },

  saveAddress: async (payload, token) => {
    const res = await axios.put(`${API}/me/address`, payload, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },

  changePassword: async (payload, token) => {
    const res = await axios.put(`${API}/me/password`, payload, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },
};
