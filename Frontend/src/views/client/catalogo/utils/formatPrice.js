export const formatPrice = (value) => {
  const number = Number(value);

  return number.toLocaleString("es-CL", {
    style: "currency",
    currency: "CLP",
    minimumFractionDigits: 0,
  });
};
