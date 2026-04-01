import * as OfferService from '../services/offers.service.js';

const parseProductId = (raw) => {
  const id = Number(raw);
  if (Number.isNaN(id)) throw { status: 400, message: 'id_producto inválido.' };
  return id;
};

export const getOffersPublic = async (req, res) => {
  try {
    const data = await OfferService.getOffersPublic(req.query.limit);
    res.json({ success: true, data });
  } catch (error) {
    console.error(error);
    res.status(error.status ?? 500).json({ success: false, message: error.message ?? 'Error interno.' });
  }
};

export const getOffersAdmin = async (req, res) => {
  try {
    const data = await OfferService.getOffersAdmin();
    res.json({ success: true, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error interno.' });
  }
};

export const addOffer = async (req, res) => {
  try {
    const id = await OfferService.addOffer(req.body);
    res.json({ success: true, message: 'Oferta creada.', id_oferta: id });
  } catch (error) {
    console.error(error);
    res.status(error.status ?? 500).json({ success: false, message: error.message ?? 'Error interno.', ...(error.invalid && { invalid: error.invalid }) });
  }
};

export const updateOffer = async (req, res) => {
  try {
    const id_producto = parseProductId(req.params.id_producto);
    await OfferService.updateOffer(id_producto, req.body);
    res.json({ success: true, message: 'Oferta actualizada.' });
  } catch (error) {
    console.error(error);
    res.status(error.status ?? 500).json({ success: false, message: error.message ?? 'Error interno.' });
  }
};

export const removeOffer = async (req, res) => {
  try {
    const id_producto = parseProductId(req.params.id_producto);
    await OfferService.removeOffer(id_producto);
    res.json({ success: true, message: 'Oferta eliminada.' });
  } catch (error) {
    console.error(error);
    res.status(error.status ?? 500).json({ success: false, message: error.message ?? 'Error interno.' });
  }
};

export const addOfferBatch = async (req, res) => {
  try {
    const result = await OfferService.addOfferBatch(req.body);
    res.json({ success: true, ...result });
  } catch (error) {
    console.error(error);
    res.status(error.status ?? 500).json({ success: false, message: error.message ?? 'Error interno.', ...(error.invalid && { invalid: error.invalid }) });
  }
};