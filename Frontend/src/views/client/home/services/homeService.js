import axios from "axios";

const API_PRODUCTS = "http://localhost:3000/api/products/catalog";

export const getFeaturedProducts = async ({ limit = 16 } = {}) => {
  const { data } = await axios.get(API_PRODUCTS, {
    params: {
      page: 1,
      limit,
      sort: "newest",
    },
  });

  return data;
};
