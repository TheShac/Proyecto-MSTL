import bcrypt from 'bcrypt';
import { EmployeeModel } from '../../models/employee.model.js';
import { AddressModel }  from '../../../users/models/address.model.js';
import { ProductModel }  from '../../../products/core/models/product.model.js';

export const getMyProfile = async (uuid) => {
  const emp = await EmployeeModel.findById(uuid);
  if (!emp) throw { status: 404, message: 'Empleado no encontrado.' };

  const address      = await AddressModel.findByEmployeeUuid(uuid);
  const createdCount = await ProductModel.countCreatedBy(uuid);

  return {
    uuid_emps:    emp.uuid_emps,
    nombre:       emp.emp_nombre,
    apellido:     emp.emp_apellido,
    username:     emp.emp_username,
    email:        emp.emp_email,
    telefono:     emp.emp_telefono,
    role:         emp.nombre_rol,
    image_profile: emp.emp_image_profile,
    last_login:   emp.last_login,
    address: address
      ? { direccion: address.direccion, ciudad: address.ciudad, pais: address.pais, codigo_postal: address.codigo_postal }
      : null,
    activity: {
      productos_creados: createdCount,
      ultima_conexion:   emp.last_login,
    },
  };
};

export const updateMyProfile = async (uuid, { username, email, telefono, nombre, apellido, image_profile }) => {
  if (!username || !email || !nombre || !apellido)
    throw { status: 400, message: 'username, email, nombre y apellido son obligatorios.' };

  const payload = {
    username:      String(username).trim(),
    email:         String(email).trim(),
    telefono:      telefono      ? String(telefono).trim()      : null,
    nombre:        String(nombre).trim(),
    apellido:      String(apellido).trim(),
    image_profile: image_profile ? String(image_profile)        : null,
  };

  const updatedRows = await EmployeeModel.updateProfile(uuid, payload);
  if (updatedRows === 0) throw { status: 404, message: 'Empleado no encontrado o sin cambios.' };
};

export const upsertMyAddress = async (uuid, { direccion, ciudad, pais, codigo_postal }) => {
  if (!direccion || !ciudad || !pais)
    throw { status: 400, message: 'direccion, ciudad y pais son obligatorios.' };

  return AddressModel.upsertForEmployee(uuid, {
    direccion:      String(direccion).trim(),
    ciudad:         String(ciudad).trim(),
    pais:           String(pais).trim(),
    codigo_postal:  codigo_postal ? String(codigo_postal).trim() : null,
  });
};

export const changeMyPassword = async (uuid, { currentPassword, newPassword }) => {
  if (!currentPassword || !newPassword)
    throw { status: 400, message: 'currentPassword y newPassword son obligatorios.' };

  if (String(newPassword).length < 6)
    throw { status: 400, message: 'La nueva contraseña debe tener al menos 6 caracteres.' };

  const emp = await EmployeeModel.findById(uuid);
  if (!emp) throw { status: 404, message: 'Empleado no encontrado.' };

  const ok = await bcrypt.compare(currentPassword, emp.emp_password);
  if (!ok) throw { status: 401, message: 'Contraseña actual incorrecta.' };

  const hashed = await bcrypt.hash(newPassword, 10);
  await EmployeeModel.updatePassword(uuid, hashed);
};