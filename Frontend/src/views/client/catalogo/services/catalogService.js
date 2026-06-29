import api from "../../../../services/api";
import { buildQueryParams } from "../utils/buildQueryParams";

export const getCatalogProducts = (params) =>
  api.get("/products/catalog", { params: buildQueryParams(params) });

export const getEditorials = () => api.get("/catalogo/editorials");

export const getGenres = () => api.get("/catalogo/genres");
