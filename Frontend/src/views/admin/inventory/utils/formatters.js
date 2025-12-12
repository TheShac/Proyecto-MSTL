export const formatCLP = (value) => {
  const n = Number(value ?? 0);
  return n.toLocaleString('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
  });
};
