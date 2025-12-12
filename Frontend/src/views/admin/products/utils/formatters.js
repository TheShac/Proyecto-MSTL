export const formatCLP = (value) => {
  const n = Number(value);
  if (!Number.isFinite(n)) return '$0';
  return n.toLocaleString('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
  });
};

export const normalizeNumberInput = (raw) => {
  const onlyDigits = String(raw ?? '').replace(/\D/g, '');
  if (onlyDigits === '') return '';
  return String(Number(onlyDigits));
};

export const normalizeText = (s) =>
  (s ?? "")
    .toString()
    .normalize("NFD")                
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
