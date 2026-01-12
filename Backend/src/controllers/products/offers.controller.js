import { OffersModel } from "../../models/products/offers.model.js";

const parseDateOrNull = (v) => {
  if (!v) return null;
  return v;
};

export const getOffersPublic = async (req, res) => {
  try {
    const { limit = 50 } = req.query;
    const items = await OffersModel.getPublicOffers(limit);
    return res.json({ success: true, data: items });
  } catch (error) {
    console.error("Error getOffersPublic:", error);
    return res.status(500).json({ success: false, message: "Error interno." });
  }
};

export const getOffersAdmin = async (req, res) => {
  try {
    const items = await OffersModel.getAdminOffers();
    return res.json({ success: true, data: items });
  } catch (error) {
    console.error("Error getOffersAdmin:", error);
    return res.status(500).json({ success: false, message: "Error interno." });
  }
};

// POST /api/offers/:id_producto  (create/update)
export const upsertOffer = async (req, res) => {
  try {
    const id_producto = Number(req.params.id_producto);
    if (Number.isNaN(id_producto)) {
      return res.status(400).json({ success: false, message: "id_producto inválido" });
    }

    const { precio_oferta, activo = 1, fecha_inicio = null, fecha_fin = null } = req.body;

    if (precio_oferta === undefined || precio_oferta === null || precio_oferta === "") {
      return res.status(400).json({ success: false, message: "Falta precio_oferta" });
    }

    if (Number(precio_oferta) <= 0) {
      return res.status(400).json({ success: false, message: "precio_oferta inválido" });
    }

    const ok = await OffersModel.upsert({
      id_producto,
      precio_oferta,
      activo: activo ? 1 : 0,
      fecha_inicio: parseDateOrNull(fecha_inicio),
      fecha_fin: parseDateOrNull(fecha_fin),
    });

    return res.json({ success: true, message: "Oferta guardada", updated: ok });
  } catch (error) {
    console.error("Error upsertOffer:", error);
    return res.status(500).json({ success: false, message: "Error interno." });
  }
};

export const removeOffer = async (req, res) => {
  try {
    const id_producto = Number(req.params.id_producto);
    if (Number.isNaN(id_producto)) {
      return res.status(400).json({ success: false, message: "id_producto inválido" });
    }

    const ok = await OffersModel.remove(id_producto);
    if (!ok) return res.status(404).json({ success: false, message: "No encontrado" });

    return res.json({ success: true, message: "Oferta eliminada" });
  } catch (error) {
    console.error("Error removeOffer:", error);
    return res.status(500).json({ success: false, message: "Error interno." });
  }
};

// POST /api/offers/bulk
export const applyOfferBulk = async (req, res) => {
  try {
    const { productIds, template } = req.body;

    if (!Array.isArray(productIds) || productIds.length === 0) {
      return res.status(400).json({ success: false, message: "productIds inválido" });
    }
    if (!template || template.precio_oferta === undefined) {
      return res.status(400).json({ success: false, message: "template inválido" });
    }

    if (Number(template.precio_oferta) <= 0) {
      return res.status(400).json({ success: false, message: "precio_oferta inválido" });
    }

    await OffersModel.bulkUpsert({
      productIds,
      template: {
        precio_oferta: Number(template.precio_oferta),
        activo: template.activo ? 1 : 0,
        fecha_inicio: parseDateOrNull(template.fecha_inicio),
        fecha_fin: parseDateOrNull(template.fecha_fin),
      },
    });

    return res.json({ success: true, message: "Oferta aplicada masivamente" });
  } catch (error) {
    console.error("Error applyOfferBulk:", error);
    return res.status(500).json({ success: false, message: "Error interno." });
  }
};
