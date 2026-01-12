import { FeaturedModel } from "../models/featured.model.js";

export const getFeaturedPublic = async (req, res) => {
  try {
    const { limit = 12 } = req.query;
    const items = await FeaturedModel.getPublicFeatured(limit);
    return res.json({ success: true, data: items });
  } catch (error) {
    console.error("Error getFeaturedPublic:", error);
    return res.status(500).json({ success: false, message: "Error interno." });
  }
};

export const getFeaturedAdmin = async (req, res) => {
  try {
    const items = await FeaturedModel.getAdminFeatured();
    return res.json({ success: true, data: items });
  } catch (error) {
    console.error("Error getFeaturedAdmin:", error);
    return res.status(500).json({ success: false, message: "Error interno." });
  }
};

export const addFeatured = async (req, res) => {
  try {
    const { id_producto, posicion = 0, activo = 1, fecha_inicio = null, fecha_fin = null } = req.body;

    if (!id_producto) {
      return res.status(400).json({ success: false, message: "Falta id_producto" });
    }

    const exists = await FeaturedModel.exists(id_producto);
    if (exists) {
      return res.status(409).json({ success: false, message: "El producto ya está en destacados." });
    }

    const id = await FeaturedModel.addFeatured({ id_producto, posicion, activo, fecha_inicio, fecha_fin });
    return res.json({ success: true, message: "Agregado a destacados", id_destacado: id });
  } catch (error) {
    console.error("Error addFeatured:", error);
    return res.status(500).json({ success: false, message: "Error interno." });
  }
};

export const updateFeatured = async (req, res) => {
  try {
    const id_producto = Number(req.params.id_producto);
    if (Number.isNaN(id_producto)) {
      return res.status(400).json({ success: false, message: "id_producto inválido" });
    }

    const { posicion, activo, fecha_inicio = null, fecha_fin = null } = req.body;

    const ok = await FeaturedModel.updateFeatured(id_producto, { posicion, activo, fecha_inicio, fecha_fin });
    if (!ok) return res.status(404).json({ success: false, message: "No encontrado" });

    return res.json({ success: true, message: "Destacado actualizado" });
  } catch (error) {
    console.error("Error updateFeatured:", error);
    return res.status(500).json({ success: false, message: "Error interno." });
  }
};

export const removeFeatured = async (req, res) => {
  try {
    const id_producto = Number(req.params.id_producto);
    if (Number.isNaN(id_producto)) {
      return res.status(400).json({ success: false, message: "id_producto inválido" });
    }

    const ok = await FeaturedModel.removeFeatured(id_producto);
    if (!ok) return res.status(404).json({ success: false, message: "No encontrado" });

    return res.json({ success: true, message: "Producto removido de destacados" });
  } catch (error) {
    console.error("Error removeFeatured:", error);
    return res.status(500).json({ success: false, message: "Error interno." });
  }
};

export const reorderFeatured = async (req, res) => {
  try {
    const { items } = req.body; // [{id_producto, posicion}]
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: "items inválido" });
    }

    await FeaturedModel.reorderFeatured(items);
    return res.json({ success: true, message: "Orden actualizado" });
  } catch (error) {
    console.error("Error reorderFeatured:", error);
    return res.status(500).json({ success: false, message: "Error interno." });
  }
};
