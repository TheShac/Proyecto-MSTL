import bcrypt from 'bcrypt';
import { EmployeeModel } from '../models/employee.model.js';

const ALLOWED_ROLES = process.env.ALLOWED_EMPLOYEE_CREATOR_ROLES
  ? process.env.ALLOWED_EMPLOYEE_CREATOR_ROLES.split(',').map((r) => r.trim())
  : ['stl_administrador', 'stl_superadministrador'];

export const isAllowedCreator = (role) => ALLOWED_ROLES.includes(role);

const generatePassword = (nombre, apellido) => {
  const n = (nombre || '').trim();
  const a = (apellido || '').trim().replace(/\s+/g, '');
  if (!n || !a) return null;
  return (n[0] + a).toLowerCase();
};

export const createEmployee = async ({ username, email, nombre, apellido, telefono, image_profile, id_role }) => {
  const usernameTaken = await EmployeeModel.findByEmailOrUsername(username);
  const emailTaken    = await EmployeeModel.findByEmailOrUsername(email);
  if (usernameTaken || emailTaken)
    throw { status: 409, message: 'El nombre de usuario o email ya están registrados.' };

  const plainPassword = generatePassword(nombre, apellido);
  if (!plainPassword)
    throw { status: 400, message: 'No se pudo generar la contraseña. Revisa nombre y apellido.' };

  const hashedPassword = await bcrypt.hash(plainPassword, 10);
  const id = await EmployeeModel.create({ username, email, password: hashedPassword, nombre, apellido, telefono, image_profile, id_role });
  return id;
};

export const getAllEmployees = async () => EmployeeModel.findAll();

export const getEmployeeById = async (id) => {
  const employee = await EmployeeModel.findById(id);
  if (!employee) throw { status: 404, message: 'Empleado no encontrado.' };
  return employee;
};

export const updateEmployee = async (id, userData) => {
  const updatedRows = await EmployeeModel.update(id, userData);
  if (updatedRows === 0) throw { status: 404, message: 'Empleado no encontrado o sin cambios.' };
};

export const deleteEmployee = async (id) => {
  const deletedRows = await EmployeeModel.delete(id);
  if (deletedRows === 0) throw { status: 404, message: 'Empleado no encontrado.' };
};

export const updateEmployeePassword = async (id, password) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const updatedRows = await EmployeeModel.updatePassword(id, hashedPassword);
  if (updatedRows === 0) throw { status: 404, message: 'Empleado no encontrado o contraseña sin cambios.' };
};