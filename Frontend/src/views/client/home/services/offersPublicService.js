import axios from "axios";

const API_OFFERS = "http://localhost:3000/api/offers";

export const getOffersPublic = async (limit = 12) => {
  const { data } = await axios.get(API_OFFERS, { params: { limit } });
  return data; // { success, data }
};
