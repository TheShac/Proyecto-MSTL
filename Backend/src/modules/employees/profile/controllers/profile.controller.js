import * as ProfileService from '../services/profile.service.js';

const requireEmployee = (req, res) => {
  if (!req.user) {
    res.status(401).json({ message: 'No autenticado.' });
    return false;
  }
  if (req.user.userType !== 'employee') {
    res.status(403).json({ message: 'Este perfil es solo para empleados.' });
    return false;
  }
  return true;
};

export const getMyEmployeeProfile = async (req, res) => {
  if (!requireEmployee(req, res)) return;
  try {
    const data = await ProfileService.getMyProfile(req.user.id);
    res.json({ success: true, data });
  } catch (error) {
    console.error(error);
    res.status(error.status ?? 500).json({ success: false, message: error.message ?? 'Error al obtener perfil.' });
  }
};

export const updateMyEmployeeProfile = async (req, res) => {
  if (!requireEmployee(req, res)) return;
  try {
    await ProfileService.updateMyProfile(req.user.id, req.body);
    res.json({ success: true, message: 'Perfil actualizado correctamente.' });
  } catch (error) {
    console.error(error);
    if (error.code === 'ER_DUP_ENTRY')
      return res.status(409).json({ message: 'El email o username ya está en uso.' });
    res.status(error.status ?? 500).json({ success: false, message: error.message ?? 'Error al actualizar perfil.' });
  }
};

export const upsertMyEmployeeAddress = async (req, res) => {
  if (!requireEmployee(req, res)) return;
  try {
    const result = await ProfileService.upsertMyAddress(req.user.id, req.body);
    res.json({ success: true, message: 'Dirección actualizada.', data: result });
  } catch (error) {
    console.error(error);
    res.status(error.status ?? 500).json({ success: false, message: error.message ?? 'Error al guardar dirección.' });
  }
};

export const changeMyEmployeePassword = async (req, res) => {
  if (!requireEmployee(req, res)) return;
  try {
    await ProfileService.changeMyPassword(req.user.id, req.body);
    res.json({ success: true, message: 'Contraseña actualizada correctamente.' });
  } catch (error) {
    console.error(error);
    res.status(error.status ?? 500).json({ success: false, message: error.message ?? 'Error al cambiar contraseña.' });
  }
};