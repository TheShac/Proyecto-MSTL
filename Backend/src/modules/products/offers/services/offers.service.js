import { OfferModel } from '../models/offers.model.js';

export const getOffersPublic = async (limit = 12) => OfferModel.getPublicOffers(limit);
export const getOffersAdmin  = async ()           => OfferModel.getAdminOffers();

export const addOffer = async ({ id_producto, precio_oferta, activo = 1, fecha_inicio = null, fecha_fin = null }) => {
  if (!id_producto || precio_oferta === undefined || precio_oferta === null)
    throw { status: 400, message: 'Falta id_producto o precio_oferta.' };

  if (Number(precio_oferta) <= 0)
    throw { status: 400, message: 'precio_oferta inválido.' };

  const basePrice = await OfferModel.getProductBasePrice(id_producto);
  if (basePrice && Number(precio_oferta) >= Number(basePrice))
    throw { status: 400, message: 'precio_oferta debe ser menor al precio normal.' };

  if (await OfferModel.exists(id_producto))
    throw { status: 409, message: 'El producto ya tiene oferta.' };

  return OfferModel.addOffer({ id_producto, precio_oferta, activo, fecha_inicio, fecha_fin });
};

export const updateOffer = async (id_producto, { precio_oferta, activo, fecha_inicio = null, fecha_fin = null }) => {
  if (precio_oferta !== undefined && precio_oferta !== null) {
    if (Number(precio_oferta) <= 0)
      throw { status: 400, message: 'precio_oferta inválido.' };

    const basePrice = await OfferModel.getProductBasePrice(id_producto);
    if (basePrice && Number(precio_oferta) >= Number(basePrice))
      throw { status: 400, message: 'precio_oferta debe ser menor al precio normal.' };
  }

  const ok = await OfferModel.updateOffer(id_producto, { precio_oferta, activo, fecha_inicio, fecha_fin });
  if (!ok) throw { status: 404, message: 'Oferta no encontrada.' };
};

export const removeOffer = async (id_producto) => {
  const ok = await OfferModel.removeOffer(id_producto);
  if (!ok) throw { status: 404, message: 'Oferta no encontrada.' };
};

export const addOfferBatch = async ({ ids, precio_oferta, activo = 1, fecha_inicio = null, fecha_fin = null, mode = 'skip' }) => {
  if (!Array.isArray(ids) || ids.length === 0)
    throw { status: 400, message: 'ids inválido.' };

  if (precio_oferta === undefined || precio_oferta === null || Number(precio_oferta) <= 0)
    throw { status: 400, message: 'precio_oferta inválido.' };

  const invalid = await OfferModel.validateOfferPriceAgainstProducts(ids, precio_oferta);
  if (invalid.length > 0)
    throw { status: 400, message: 'precio_oferta debe ser menor al precio normal.', invalid };

  return OfferModel.addOfferBatch({ ids, precio_oferta, activo, fecha_inicio, fecha_fin, mode });
};