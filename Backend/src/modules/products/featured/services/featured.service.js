import { FeaturedModel } from '../models/featured.model.js';

export const getFeaturedPublic = async (limit = 12) => FeaturedModel.getPublicFeatured(limit);
export const getFeaturedAdmin  = async ()           => FeaturedModel.getAdminFeatured();

export const addFeatured = async ({ id_producto, posicion = 0, activo = 1, fecha_inicio = null, fecha_fin = null }) => {
  if (!id_producto) throw { status: 400, message: 'Falta id_producto.' };
  if (await FeaturedModel.exists(id_producto))
    throw { status: 409, message: 'El producto ya está en destacados.' };

  return FeaturedModel.addFeatured({ id_producto, posicion, activo, fecha_inicio, fecha_fin });
};

export const updateFeatured = async (id_producto, { posicion, activo, fecha_inicio = null, fecha_fin = null }) => {
  const ok = await FeaturedModel.updateFeatured(id_producto, { posicion, activo, fecha_inicio, fecha_fin });
  if (!ok) throw { status: 404, message: 'Destacado no encontrado.' };
};

export const removeFeatured = async (id_producto) => {
  const ok = await FeaturedModel.removeFeatured(id_producto);
  if (!ok) throw { status: 404, message: 'Destacado no encontrado.' };
};

export const reorderFeatured = async (items) => {
  if (!Array.isArray(items) || items.length === 0)
    throw { status: 400, message: 'items inválido.' };
  return FeaturedModel.reorderFeatured(items);
};