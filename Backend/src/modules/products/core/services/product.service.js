import { ProductModel } from '../models/product.model.js';

export const getAllProducts = async () => ProductModel.findAll();

export const getProductById = async (id) => {
  const product = await ProductModel.findById(id);
  if (!product) throw { status: 404, message: 'Producto no encontrado.' };
  return product;
};

export const createProduct = async ({ nombre, estado, descripcion, precio, imagen_url, stock, id_editorial, id_genero, uuid_emp_create }) => {
  if (!nombre || !precio || !estado)
    throw { status: 400, message: 'Faltan campos obligatorios: nombre, estado, precio.' };

  return ProductModel.create({ nombre, estado, descripcion, precio, imagen_url, stock, id_editorial, id_genero, uuid_emp_create });
};

export const updateProduct = async (id, { nombre, estado, descripcion, precio, imagen_url, stock, id_editorial, id_genero, uuid_emp_modify }) => {
  const success = await ProductModel.update(id, { nombre, estado, descripcion, precio, imagen_url, stock, id_editorial, id_genero, uuid_emp_modify });
  if (!success) throw { status: 404, message: 'Producto no encontrado o sin cambios.' };
};

export const deleteProduct = async (id) => {
  const success = await ProductModel.delete(id);
  if (!success) throw { status: 404, message: 'Producto no encontrado.' };
};

export const getCatalog = async ({ page = 1, limit = 12, search = '', editorial = '', genre = '', minPrice = '', maxPrice = '', sort = 'newest', onlyOffers = false }) => {
  return ProductModel.catalog({
    page: Number(page),
    limit: Number(limit),
    search,
    editorial,
    genre,
    minPrice,
    maxPrice,
    sort,
    onlyOffers: String(onlyOffers) === '1' || String(onlyOffers).toLowerCase() === 'true',
  });
};