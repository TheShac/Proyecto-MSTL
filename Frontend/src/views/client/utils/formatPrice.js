export const formatPrice = (value) => {
  if (value === null || value === undefined || value === "") return "$0";

  const number = Number(value);
  if (Number.isNaN(number)) return "$0";

  return number.toLocaleString("es-CL", {
    style: "currency",
    currency: "CLP",
    minimumFractionDigits: 0,
  });
};

export const hasOffer = (product) => {
  const v = product?.precio_oferta;
  return v !== null && v !== undefined && String(v).trim() !== "";
};

export const getDiscountPercent = (product) => {
  if (!hasOffer(product)) return null;

  const normal = Number(product?.precio);
  const offer = Number(product?.precio_oferta);

  if (!Number.isFinite(normal) || normal <= 0) return null;
  if (!Number.isFinite(offer) || offer < 0) return null;

  const pct = Math.round((1 - offer / normal) * 100);
  return pct > 0 ? pct : null;
};

export const getEffectivePrice = (product) => {
  return hasOffer(product) ? Number(product.precio_oferta) : Number(product.precio);
};