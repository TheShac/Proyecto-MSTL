import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { CustomerModel } from '../../users/models/customer.model.js';
import { EmployeeModel } from '../../employees/models/employee.model.js';

// ── Helpers internos ──────────────────────────────────────────────────────────

const buildUserPayload = (user, userType) => {
  const id       = userType === 'employee' ? user.uuid_emps     : user.uuid_customer;
  const username = userType === 'employee' ? user.emp_username  : user.stl_username;
  const role     = userType === 'employee' ? user.nombre_rol    : 'customer';
  return { id, username, role, userType };
};

// ── Exports ───────────────────────────────────────────────────────────────────

export const signToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '3h',
  });

export const findUserByIdentifier = async (identifier) => {
  let user = await CustomerModel.findByEmailOrUsername(identifier);
  if (user) return { user, userType: 'customer' };

  user = await EmployeeModel.findByEmailOrUsername(identifier);
  if (user) return { user, userType: 'employee' };

  return null;
};

export const validatePassword = async (plain, hash) =>
  bcrypt.compare(plain, hash);

export const hashPassword = (plain) => bcrypt.hash(plain, 10);

export const resolveOrCreateGoogleUser = async ({ email, googleId, name, lastName, photo }) => {
  // 1. Buscar por google_id
  let user = await CustomerModel.findByGoogleId(googleId);
  let userType = 'customer';

  if (!user) {
    user = await EmployeeModel.findByGoogleId(googleId);
    if (user) userType = 'employee';
  }

  // 2. Si no aparece por google_id, buscar por email
  if (!user) {
    user = await CustomerModel.findByEmailOrUsername(email);
    userType = 'customer';
  }
  if (!user) {
    user = await EmployeeModel.findByEmailOrUsername(email);
    if (user) userType = 'employee';
  }

  // 3. Vincular google_id si el usuario existe pero no lo tiene
  if (user) {
    if (userType === 'customer' && !user.google_id)
      await CustomerModel.setGoogleId(user.uuid_customer, googleId);
    if (userType === 'employee' && !user.google_id)
      await EmployeeModel.setGoogleId(user.uuid_emps, googleId);
  }

  // 4. Crear customer nuevo si no existe en ningún lado
  if (!user) {
    const username = email.split('@')[0];
    await CustomerModel.createGoogleUser({ username, email, nombre: name, apellido: lastName, image_profile: photo, google_id: googleId });
    user = await CustomerModel.findByEmailOrUsername(email);
    userType = 'customer';
  }

  return buildUserPayload(user, userType);
};