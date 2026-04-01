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

export const sanitize = (req, res, next) => {
  if (req.body)   req.body   = sanitizeObject(req.body);
  if (req.query)  req.query  = sanitizeObject(req.query);
  if (req.params) req.params = sanitizeObject(req.params);
  next();
};