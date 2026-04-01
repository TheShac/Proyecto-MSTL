import { CatalogModel } from '../models/catalogo.model.js';

export const getEditorials = async () => CatalogModel.getAllEditorials();
export const getGenres     = async () => CatalogModel.getAllGenres();