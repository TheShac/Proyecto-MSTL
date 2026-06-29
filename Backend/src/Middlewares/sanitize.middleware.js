import xss from 'xss';

const sanitizeValue = (value) => {
  if (typeof value === 'string') return xss(value.trim());
  if (typeof value === 'object' && value !== null) return sanitizeObject(value);
  return value;
};

const sanitizeObject = (obj) => {
  return Object.fromEntries(
    Object.entries(obj).map(([key, val]) => [key, sanitizeValue(val)])
  );
};

// En Express 5 req.query y req.params son solo-lectura (getters sin setter),
// por eso se mutan en su lugar en vez de reasignarlos.
const sanitizeInPlace = (obj) => {
  if (!obj || typeof obj !== 'object') return;
  for (const key of Object.keys(obj)) {
    obj[key] = sanitizeValue(obj[key]);
  }
};

export const sanitize = (req, res, next) => {
  if (req.body) req.body = sanitizeObject(req.body);
  sanitizeInPlace(req.query);
  sanitizeInPlace(req.params);
  next();
};