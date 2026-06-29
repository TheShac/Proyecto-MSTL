import api from "../../../../services/api";
import { buildQueryParams } from "../../catalogo/utils/buildQueryParams";

export const getProductById = (id) => api.get(`/products/${id}`);

export const getCatalogProducts = (params) =>
  api.get("/products/catalog", { params: buildQueryParams(params) });
