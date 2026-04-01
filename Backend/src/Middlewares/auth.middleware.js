import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { EmployeeModel } from '../modules/employees/models/employee.model.js';
import { CustomerModel }  from '../modules/users/models/customer.model.js';

dotenv.config();

// ── Verifica JWT y adjunta req.user ───────────────────────────────────────────

export const verifyToken = async (req, res, next) => {
  const header = req.headers.authorization;

  if (!header?.startsWith('Bearer '))
    return res.status(401).json({ message: 'No se proporcionó token de autenticación.' });

  const token = header.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = decoded.userType === 'employee'
      ? await EmployeeModel.findById(decoded.id)
      : await CustomerModel.findById(decoded.id);

    if (!user)
      return res.status(401).json({ message: 'Usuario no encontrado o inactivo.' });

    req.user = {
      id:       decoded.id,
      role:     decoded.role,
      userType: decoded.userType,
      username: decoded.username,
      ...user,
    };

    return next();
  } catch (error) {
    console.error('Error de autenticación:', error);
    return res.status(401).json({ message: 'Token inválido o expirado.' });
  }
};

// ── Verifica que req.user tenga uno de los roles permitidos ───────────────────

export const requireRole = (...roles) => (req, res, next) => {
  if (!req.user)
    return res.status(401).json({ message: 'No autenticado.' });

  if (!roles.includes(req.user.role) && !roles.includes(req.user.userType))
    return res.status(403).json({ message: 'Acceso denegado. No tienes permisos para esta acción.' });

  return next();
};