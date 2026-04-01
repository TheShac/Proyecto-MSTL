import { z } from 'zod';

// Middleware genérico — recibe un schema Zod
export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    const errors = result.error.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));
    return res.status(400).json({ success: false, message: 'Datos inválidos.', errors });
  }
  req.body = result.data; // datos limpios y tipados
  return next();
};