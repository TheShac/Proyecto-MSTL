import axios from 'axios';

const API = 'http://localhost:3000/api/profile';

export const profileService = {
  me: async (token) => {
    const res = await axios.get(`${API}/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },

  updateMe: async (payload, token) => {
    const res = await axios.put(`${API}/me`, payload, {
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

  // OJO: tu backend es PATCH /me/password
  changePassword: async (payload, token) => {
    const res = await axios.patch(`${API}/me/password`, payload, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },
};
