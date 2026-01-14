// src/views/client/utils/formatPrice.js

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
