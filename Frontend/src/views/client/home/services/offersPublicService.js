import axios from "axios";

const API_PRODUCTS = "http://localhost:3000/api/products/catalog";

// Trae solo ofertas: page 1, limit 12, newest
export const getOffersPublic = async () => {
  const { data } = await axios.get(API_PRODUCTS, {
    params: { page: 1, limit: 12, sort: "newest", onlyOffers: true },
  });
  return data; // { success, data, totalPages... }
};
