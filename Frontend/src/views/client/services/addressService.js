import api from "../../../services/api";

export const addressService = {
  getMine: () => api.get("/customer/address"),
  saveMine: (payload) => api.put("/customer/address", payload),
};
