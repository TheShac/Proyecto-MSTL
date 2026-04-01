import * as ProductService from '../services/product.service.js';

export const getAllProducts = async (req, res) => {
  try {
    const products = await ProductService.getAllProducts();
    res.json({ success: true, data: products });
  } catch (error) {
    console.error(error);
    res.status(error.status ?? 500).json({ success: false, message: error.message ?? 'Error al obtener productos.' });
  }
};

export const getProductById = async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ success: false, message: 'ID de producto inválido.' });

  try {
    const product = await ProductService.getProductById(id);
    res.json({ success: true, data: product });
  } catch (error) {
    console.error(error);
    res.status(error.status ?? 500).json({ success: false, message: error.message ?? 'Error al obtener producto.' });
  }
};

export const createProduct = async (req, res) => {
  try {
    const result = await ProductService.createProduct({
      ...req.body,
      uuid_emp_create: req.user.id,
    });
    res.json({ message: 'Producto creado correctamente', id: result.id_producto });
  } catch (error) {
    console.error(error);
    res.status(error.status ?? 500).json({ success: false, message: error.message ?? 'Error al crear producto.' });
  }
};

export const updateProduct = async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ success: false, message: 'ID de producto inválido.' });

  try {
    await ProductService.updateProduct(id, { ...req.body, uuid_emp_modify: req.user.id });
    res.json({ success: true, message: 'Producto actualizado exitosamente.' });
  } catch (error) {
    console.error(error);
    res.status(error.status ?? 500).json({ success: false, message: error.message ?? 'Error al actualizar producto.' });
  }
};

export const deleteProduct = async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ success: false, message: 'ID de producto inválido.' });

  try {
    await ProductService.deleteProduct(id);
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(error.status ?? 500).json({ success: false, message: error.message ?? 'Error al eliminar producto.' });
  }
};

export const getCatalog = async (req, res) => {
  try {
    const result = await ProductService.getCatalog(req.query);
    res.json({
      success: true,
      data: result.products,
      total: result.total,
      page: Number(req.query.page ?? 1),
      totalPages: Math.ceil(result.total / (req.query.limit ?? 12)),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error interno.' });
  }
};