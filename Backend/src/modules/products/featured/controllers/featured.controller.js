import * as FeaturedService from '../services/featured.service.js';

const parseProductId = (raw) => {
  const id = Number(raw);
  if (Number.isNaN(id)) throw { status: 400, message: 'id_producto inválido.' };
  return id;
};

export const getFeaturedPublic = async (req, res) => {
  try {
    const data = await FeaturedService.getFeaturedPublic(req.query.limit);
    res.json({ success: true, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error interno.' });
  }
};

export const getFeaturedAdmin = async (req, res) => {
  try {
    const data = await FeaturedService.getFeaturedAdmin();
    res.json({ success: true, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error interno.' });
  }
};

export const addFeatured = async (req, res) => {
  try {
    const id = await FeaturedService.addFeatured(req.body);
    res.json({ success: true, message: 'Agregado a destacados.', id_destacado: id });
  } catch (error) {
    console.error(error);
    res.status(error.status ?? 500).json({ success: false, message: error.message ?? 'Error interno.' });
  }
};

export const updateFeatured = async (req, res) => {
  try {
    const id_producto = parseProductId(req.params.id_producto);
    await FeaturedService.updateFeatured(id_producto, req.body);
    res.json({ success: true, message: 'Destacado actualizado.' });
  } catch (error) {
    console.error(error);
    res.status(error.status ?? 500).json({ success: false, message: error.message ?? 'Error interno.' });
  }
};

export const removeFeatured = async (req, res) => {
  try {
    const id_producto = parseProductId(req.params.id_producto);
    await FeaturedService.removeFeatured(id_producto);
    res.json({ success: true, message: 'Producto removido de destacados.' });
  } catch (error) {
    console.error(error);
    res.status(error.status ?? 500).json({ success: false, message: error.message ?? 'Error interno.' });
  }
};

export const reorderFeatured = async (req, res) => {
  try {
    await FeaturedService.reorderFeatured(req.body.items);
    res.json({ success: true, message: 'Orden actualizado.' });
  } catch (error) {
    console.error(error);
    res.status(error.status ?? 500).json({ success: false, message: error.message ?? 'Error interno.' });
  }
};