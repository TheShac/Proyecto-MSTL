import dotenv from 'dotenv';
import { CustomerModel } from '../../users/models/customer.model.js';
import { EmployeeModel } from '../../employees/models/employee.model.js';
import {
  findUserByIdentifier,
  validatePassword,
  hashPassword,
  signToken,
} from '../services/auth.service.js';

dotenv.config();

const ALLOWED_EMPLOYEE_CREATOR_ROLES = process.env.ALLOWED_EMPLOYEE_CREATOR_ROLES
  ? process.env.ALLOWED_EMPLOYEE_CREATOR_ROLES.split(',').map((r) => r.trim())
  : ['stl_administrador', 'stl_superadministrador'];

// ── Login ─────────────────────────────────────────────────────────────────────

export const Login = async (req, res) => {
  const { identifier, password } = req.body;
  try {
    const found = await findUserByIdentifier(identifier);
    if (!found) return res.status(404).json({ message: 'Usuario no encontrado' });

    const { user, userType } = found;
    const storedHash = userType === 'employee' ? user.emp_password : user.stl_password;

    if (!storedHash)
      return res.status(500).json({ message: 'Error de configuración: contraseña no recuperada.' });

    const isValid = await validatePassword(password, storedHash);
    if (!isValid) return res.status(401).json({ message: 'Contraseña incorrecta' });

    const id       = userType === 'employee' ? user.uuid_emps    : user.uuid_customer;
    const username = userType === 'employee' ? user.emp_username : user.stl_username;
    const role     = userType === 'employee' ? user.nombre_rol   : 'customer';

    if (userType === 'employee') await EmployeeModel.updateLastLogin(id);

    const token = signToken({ id, username, role, userType });
    res.json({ message: 'Login exitoso', token, userType, role, id, username });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// ── Registro customer ─────────────────────────────────────────────────────────

export const registerCustomer = async (req, res) => {
  try {
    const { username, email, password, nombre, apellido, telefono, image_profile } = req.body;

    const emailTaken    = await CustomerModel.findByEmailOrUsername(email);
    const usernameTaken = await CustomerModel.findByEmailOrUsername(username);
    if (emailTaken || usernameTaken)
      return res.status(409).json({ message: 'El nombre de usuario o email ya están registrados.' });

    const hashedPassword = await hashPassword(password);
    const id = await CustomerModel.create({ username, email, password: hashedPassword, nombre, apellido, telefono, image_profile });
    res.json({ message: 'Cliente registrado correctamente', id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// ── Registro employee (solo admins) ───────────────────────────────────────────

export const registerEmployee = async (req, res) => {
  if (!req.user)
    return res.status(403).json({ message: 'Acceso denegado. Se requiere autenticación.' });

  if (!ALLOWED_EMPLOYEE_CREATOR_ROLES.includes(req.user.role))
    return res.status(403).json({ message: 'Acceso denegado. Solo administradores pueden registrar empleados.' });

  try {
    const { username, email, password, nombre, apellido, telefono, image_profile, id_role } = req.body;

    const emailTaken    = await EmployeeModel.findByEmailOrUsername(email);
    const usernameTaken = await EmployeeModel.findByEmailOrUsername(username);
    if (emailTaken || usernameTaken)
      return res.status(409).json({ message: 'El nombre de usuario o email ya están registrados.' });

    const hashedPassword = await hashPassword(password);
    const id = await EmployeeModel.create({ username, email, password: hashedPassword, nombre, apellido, telefono, image_profile, id_role });
    res.json({ message: 'Empleado registrado correctamente', id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// ── Perfil ────────────────────────────────────────────────────────────────────

export const getProfile = async (req, res) => {
  if (!req.user)
    return res.status(404).json({ message: 'Perfil de usuario no encontrado.' });

  res.json({
    id:           req.user.uuid_customer || req.user.uuid_emps,
    nombre:       req.user.stl_nombre    || req.user.emp_nombre,
    apellido:     req.user.stl_apellido  || req.user.emp_apellido,
    userType:     req.user.userType,
    stl_email:    req.user.stl_email     || null,
    stl_username: req.user.stl_username  || null,
    stl_telefono: req.user.stl_telefono  || null,
    emp_email:    req.user.emp_email     || null,
    emp_username: req.user.emp_username  || null,
    emp_telefono: req.user.emp_telefono  || null,
    role:         req.user.nombre_rol    || null,
    image_profile: req.user.stl_image_profile || req.user.emp_image_profile || null,
  });
};

// ── Editar perfil ─────────────────────────────────────────────────────────────

export const editProfile = async (req, res) => {
  if (!req.user) return res.status(401).json({ message: 'No autenticado.' });

  const { id, userType } = req.user;
  const userData = { ...req.body };

  try {
    if (userData.password) userData.password = await hashPassword(userData.password);

    const fields = {
      username:      userData.username,
      email:         userData.email,
      telefono:      userData.telefono,
      nombre:        userData.nombre,
      apellido:      userData.apellido,
      image_profile: userData.image_profile,
      password:      userData.password,
    };

    const Model = userType === 'customer' ? CustomerModel : EmployeeModel;
    const updatedRows = await Model.update(id, fields);

    if (updatedRows === 0)
      return res.status(404).json({ message: 'Usuario no encontrado o no hubo cambios.' });

    res.json({ message: 'Perfil actualizado correctamente.' });
  } catch (error) {
    console.error(error);
    if (error.code === 'ER_DUP_ENTRY')
      return res.status(409).json({ message: 'El nuevo email o nombre de usuario ya está en uso.' });
    res.status(500).json({ error: 'Error en el servidor al actualizar el perfil.' });
  }
};