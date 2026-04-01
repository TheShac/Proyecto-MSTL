import * as EmployeeService from '../services/employee.service.js';

const isAdmin = (req, res) => {
  if (!req.user || !EmployeeService.isAllowedCreator(req.user.role)) {
    res.status(403).json({ message: 'Acceso denegado. Solo administradores pueden realizar esta acción.' });
    return false;
  }
  return true;
};

export const createEmployee = async (req, res) => {
  if (!isAdmin(req, res)) return;
  try {
    const { username, email, nombre, apellido, telefono, image_profile, id_role } = req.body;

    if (!username || !email || !nombre || !apellido || !id_role)
      return res.status(400).json({ message: 'Faltan campos obligatorios (username, email, nombre, apellido, id_role).' });

    const id = await EmployeeService.createEmployee({ username, email, nombre, apellido, telefono, image_profile, id_role });
    res.json({ message: 'Empleado creado correctamente', id });
  } catch (error) {
    console.error(error);
    res.status(error.status ?? 500).json({ error: error.message ?? 'Error al crear empleado.' });
  }
};

export const getAllEmployees = async (req, res) => {
  if (!isAdmin(req, res)) return;
  try {
    const employees = await EmployeeService.getAllEmployees();
    res.json(employees);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener empleados.' });
  }
};

export const getEmployeeById = async (req, res) => {
  try {
    const employee = await EmployeeService.getEmployeeById(req.params.id);
    res.json(employee);
  } catch (error) {
    console.error(error);
    res.status(error.status ?? 500).json({ error: error.message ?? 'Error al obtener empleado.' });
  }
};

export const updateEmployee = async (req, res) => {
  if (!isAdmin(req, res)) return;
  try {
    await EmployeeService.updateEmployee(req.params.id, req.body);
    res.json({ message: 'Empleado actualizado correctamente.' });
  } catch (error) {
    console.error(error);
    res.status(error.status ?? 500).json({ error: error.message ?? 'Error al actualizar empleado.' });
  }
};

export const deleteEmployee = async (req, res) => {
  if (!isAdmin(req, res)) return;
  try {
    await EmployeeService.deleteEmployee(req.params.id);
    res.json({ message: 'Empleado eliminado correctamente.' });
  } catch (error) {
    console.error(error);
    res.status(error.status ?? 500).json({ error: error.message ?? 'Error al eliminar empleado.' });
  }
};

export const updateEmployeePassword = async (req, res) => {
  if (!isAdmin(req, res)) return;
  try {
    await EmployeeService.updateEmployeePassword(req.params.id, req.body.password);
    res.json({ message: 'Contraseña actualizada correctamente.' });
  } catch (error) {
    console.error(error);
    res.status(error.status ?? 500).json({ error: error.message ?? 'Error al actualizar contraseña.' });
  }
};