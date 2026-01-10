import axios from "axios";

const API_PRODUCTS = "http://localhost:3000/api/products";

export const getProductById = async (id) => {
  const { data } = await axios.get(`${API_PRODUCTS}/${id}`);
  return data;
};
