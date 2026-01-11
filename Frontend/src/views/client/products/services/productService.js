import axios from "axios";
import { buildQueryParams } from "../../catalogo/utils/buildQueryParams";

const API_PRODUCTS = "http://localhost:3000/api/products";

export const getProductById = async (id) => {
  const { data } = await axios.get(`${API_PRODUCTS}/${id}`);
  return data;
};

export const getCatalogProducts = async (params) => {
  const cleanParams = buildQueryParams(params);
  const { data } = await axios.get(`${API_PRODUCTS}/catalog`, { params: cleanParams });
  return data;
};
