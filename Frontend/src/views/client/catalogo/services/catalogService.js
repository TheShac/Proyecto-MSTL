import axios from "axios";
import { buildQueryParams } from "../utils/buildQueryParams";

const API_PRODUCTS = "http://localhost:3000/api/products/catalog";
const API_CATALOGO = "http://localhost:3000/api/catalogo";

export const getCatalogProducts = async (params) => {
  const cleanParams = buildQueryParams(params);
  const { data } = await axios.get(API_PRODUCTS, { params: cleanParams });
  return data;
};

export const getEditorials = async () => {
  const { data } = await axios.get(`${API_CATALOGO}/editorials`);
  return data;
};

export const getGenres = async () => {
  const { data } = await axios.get(`${API_CATALOGO}/genres`);
  return data;
};