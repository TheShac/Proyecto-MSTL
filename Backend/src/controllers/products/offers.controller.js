import { OfferModel } from "../../models/products/offers.model.js";

// Público: últimas ofertas activas
export const getOffersPublic = async (req, res) => {
  try {
    const { limit = 12 } = req.query;
    const items = await OfferModel.getPublicOffers(limit);
    return res.json({ success: true, data: items });
  } catch (error) {
    console.error("Error getOffersPublic:", error);
    return res.status(500).json({ success: false, message: "Error interno." });
  }
};

// Admin: lista todas las ofertas
export const getOffersAdmin = async (req, res) => {
  try {
    const items = await OfferModel.getAdminOffers();
    return res.json({ success: true, data: items });
  } catch (error) {
    console.error("Error getOffersAdmin:", error);
    return res.status(500).json({ success: false, message: "Error interno." });
  }
};

// Admin: crear oferta (1 producto) — si existe, devuelve 409
export const addOffer = async (req, res) => {
  try {
    const { id_producto, precio_oferta, activo = 1, fecha_inicio = null, fecha_fin = null } = req.body;

    if (!id_producto || precio_oferta === undefined || precio_oferta === null) {
      return res.status(400).json({ success: false, message: "Falta id_producto o precio_oferta" });
    }

    if (Number(precio_oferta) <= 0) {
      return res.status(400).json({ success: false, message: "precio_oferta inválido" });
    }

    // opcional: evitar que oferta sea mayor/equal al precio normal
    const basePrice = await OfferModel.getProductBasePrice(id_producto);
    if (basePrice && Number(precio_oferta) >= Number(basePrice)) {
      return res.status(400).json({ success: false, message: "precio_oferta debe ser menor al precio normal" });
    }

    const exists = await OfferModel.exists(id_producto);
    if (exists) {
      return res.status(409).json({ success: false, message: "El producto ya tiene oferta." });
    }

    const id = await OfferModel.addOffer({ id_producto, precio_oferta, activo, fecha_inicio, fecha_fin });
    return res.json({ success: true, message: "Oferta creada", id_oferta: id });
  } catch (error) {
    console.error("Error addOffer:", error);
    return res.status(500).json({ success: false, message: "Error interno." });
  }
};

// Admin: actualizar oferta (1 producto)
export const updateOffer = async (req, res) => {
  try {
    const id_producto = Number(req.params.id_producto);
    if (Number.isNaN(id_producto)) {
      return res.status(400).json({ success: false, message: "id_producto inválido" });
    }

    const { precio_oferta, activo, fecha_inicio = null, fecha_fin = null } = req.body;

    if (precio_oferta !== undefined && precio_oferta !== null) {
      if (Number(precio_oferta) <= 0) {
        return res.status(400).json({ success: false, message: "precio_oferta inválido" });
      }
      const basePrice = await OfferModel.getProductBasePrice(id_producto);
      if (basePrice && Number(precio_oferta) >= Number(basePrice)) {
        return res.status(400).json({ success: false, message: "precio_oferta debe ser menor al precio normal" });
      }
    }

    const ok = await OfferModel.updateOffer(id_producto, { precio_oferta, activo, fecha_inicio, fecha_fin });
    if (!ok) return res.status(404).json({ success: false, message: "No encontrado" });

    return res.json({ success: true, message: "Oferta actualizada" });
  } catch (error) {
    console.error("Error updateOffer:", error);
    return res.status(500).json({ success: false, message: "Error interno." });
  }
};

// Admin: eliminar oferta
export const removeOffer = async (req, res) => {
  try {
    const id_producto = Number(req.params.id_producto);
    if (Number.isNaN(id_producto)) {
      return res.status(400).json({ success: false, message: "id_producto inválido" });
    }

    const ok = await OfferModel.removeOffer(id_producto);
    if (!ok) return res.status(404).json({ success: false, message: "No encontrado" });

    return res.json({ success: true, message: "Oferta eliminada" });
  } catch (error) {
    console.error("Error removeOffer:", error);
    return res.status(500).json({ success: false, message: "Error interno." });
  }
};

// Admin: crear ofertas en lote (varios productos)
export const addOfferBatch = async (req, res) => {
  try {
    const {
      ids,
      precio_oferta,
      activo = 1,
      fecha_inicio = null,
      fecha_fin = null,
      mode = "skip",
    } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ success: false, message: "ids inválido" });
    }
    if (precio_oferta === undefined || precio_oferta === null || Number(precio_oferta) <= 0) {
      return res.status(400).json({ success: false, message: "precio_oferta inválido" });
    }

    // validación base: precio_oferta < precio de cada producto
    const invalid = await OfferModel.validateOfferPriceAgainstProducts(ids, precio_oferta);
    if (invalid.length > 0) {
      return res.status(400).json({
        success: false,
        message: "precio_oferta debe ser menor al precio normal",
        invalid,
      });
    }

    const result = await OfferModel.addOfferBatch({
      ids,
      precio_oferta,
      activo,
      fecha_inicio,
      fecha_fin,
      mode,
    });

    return res.json({ success: true, ...result });
  } catch (error) {
    console.error("Error addOfferBatch:", error);
    return res.status(500).json({ success: false, message: "Error interno." });
  }
};
