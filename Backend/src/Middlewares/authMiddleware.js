import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

import { EmployeeModel } from '../models/employee.model.js';
import { CustomerModel } from '../models/customer.model.js';

dotenv.config();

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      let user;
      if (decoded.userType === 'employee') {
        user = await EmployeeModel.findById(decoded.id);
      } else {
        user = await CustomerModel.findById(decoded.id);
      }

      if (!user) {
        return res.status(401).json({ message: 'Usuario no encontrado o inactivo.' });
      }

      req.user = {
        id: decoded.id,
        role: decoded.role,
        userType: decoded.userType,
        username: decoded.username,
        ...user,
      };

      return next();
    } catch (error) {
      console.error('Error de autenticación:', error);
      return res.status(401).json({ message: 'Token inválido o expirado' });
    }
  }

  return res.status(401).json({ message: 'No se proporcionó token de autenticación' });
};