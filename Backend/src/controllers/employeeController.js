import bcrypt from 'bcrypt';
import { EmployeeModel } from '../models/employee.model.js';

const ALLOWED_EMPLOYEE_CREATOR_ROLES = ['stl_administrador', 'stl_superadministrador'];

const generatePassword = (nombre, apellido) => {
  const n = (nombre || '').trim();
  const a = (apellido || '').trim().replace(/\s+/g, '');
  if (!n || !a) return '';
  return (n[0] + a).toLowerCase();
};

// Crear empleado (solo admin/superadmin)
export const createEmployee = async (req, res) => {
  if (!req.user || !ALLOWED_EMPLOYEE_CREATOR_ROLES.includes(req.user.role)) {
    return res.status(403).json({ message: 'Acceso denegado. Solo administradores pueden crear empleados.' });
  }

  try {
    const { username, email, nombre, apellido, telefono, image_profile, id_role } = req.body;

    if (!username || !email || !nombre || !apellido || !id_role) {
      return res.status(400).json({ message: 'Faltan campos obligatorios (username, email, nombre, apellido, id_role).' });
    }

    if (await EmployeeModel.findByEmailOrUsername(username) || await EmployeeModel.findByEmailOrUsername(email)) {
      return res.status(409).json({ message: 'El nombre de usuario o email ya están registrados.' });
    }

    const plainPassword = generatePassword(nombre, apellido);
    if (!plainPassword) {
      return res.status(400).json({ message: 'No se pudo generar la contraseña. Revisa nombre y apellido.' });
    }

    const hashedPassword = await bcrypt.hash(plainPassword, 10);
    const id = await EmployeeModel.create({ username, email, password: hashedPassword, nombre, apellido, telefono, image_profile, id_role });

    res.json({ message: 'Empleado creado correctamente', id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error en el servidor al crear empleado.' });
  }
};

// Obtener todos los empleados
export const getAllEmployees = async (req, res) => {
  if (!req.user || !ALLOWED_EMPLOYEE_CREATOR_ROLES.includes(req.user.role)) {
    return res.status(403).json({ message: 'Acceso denegado.' });
  }

  try {
    const employees = await EmployeeModel.findAll();
    res.json(employees);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error en el servidor al obtener empleados.' });
  }
};

// Obtener empleado por ID
export const getEmployeeById = async (req, res) => {
  const { id } = req.params;
  try {
    const employee = await EmployeeModel.findById(id);
    if (!employee) return res.status(404).json({ message: 'Empleado no encontrado.' });
    res.json(employee);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error en el servidor al obtener empleado.' });
  }
};

// Actualizar empleado
export const updateEmployee = async (req, res) => {
  if (!req.user || !ALLOWED_EMPLOYEE_CREATOR_ROLES.includes(req.user.role)) {
    return res.status(403).json({ message: 'Acceso denegado.' });
  }

  const { id } = req.params;
  const userData = req.body;

  try {
    const updatedRows = await EmployeeModel.update(id, userData);
    if (updatedRows === 0) return res.status(404).json({ message: 'Empleado no encontrado o sin cambios.' });
    res.json({ message: 'Empleado actualizado correctamente.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error en el servidor al actualizar empleado.' });
  }
};

// Eliminar empleado
export const deleteEmployee = async (req, res) => {
  if (!req.user || !ALLOWED_EMPLOYEE_CREATOR_ROLES.includes(req.user.role)) {
    return res.status(403).json({ message: 'Acceso denegado.' });
  }

  const { id } = req.params;

  try {
    const deletedRows = await EmployeeModel.delete(id);
    if (deletedRows === 0) return res.status(404).json({ message: 'Empleado no encontrado.' });
    res.json({ message: 'Empleado eliminado correctamente.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error en el servidor al eliminar empleado.' });
  }
};

// Actualizar contraseña de empleado
export const updateEmployeePassword = async (req, res) => {
  if (!req.user || !ALLOWED_EMPLOYEE_CREATOR_ROLES.includes(req.user.role)) {
    return res.status(403).json({ message: 'Acceso denegado.' });
  }

  const { id } = req.params;
  const { password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const updatedRows = await EmployeeModel.updatePassword(id, hashedPassword);
    if (updatedRows === 0) return res.status(404).json({ message: 'Empleado no encontrado o contraseña sin cambios.' });
    res.json({ message: 'Contraseña actualizada correctamente.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error en el servidor al actualizar la contraseña.' });
  }
};
