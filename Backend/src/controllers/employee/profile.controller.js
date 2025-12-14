import bcrypt from "bcrypt";
import { EmployeeModel } from "../../models/employee.model.js";
import { AddressModel } from "../../models/address.model.js";
import { ProductModel } from "../../models/product.model.js";

// helpers
const requireEmployee = (req, res) => {
  if (!req.user) {
    res.status(401).json({ message: "No autenticado." });
    return false;
  }
  if (req.user.userType !== "employee") {
    res.status(403).json({ message: "Este perfil es solo para empleados." });
    return false;
  }
  return true;
};

// GET /api/profile/me
export const getMyEmployeeProfile = async (req, res) => {
  if (!requireEmployee(req, res)) return;

  try {
    const uuid = req.user.id;

    // 1) datos employee (asegúrate que findById trae nombre_rol y last_login)
    const emp = await EmployeeModel.findById(uuid);
    if (!emp) return res.status(404).json({ message: "Empleado no encontrado." });

    // 2) address (si no existe, null)
    const address = await AddressModel.findByEmployeeUuid(uuid);

    // 3) actividad: productos creados (count)
    const createdCount = await ProductModel.countCreatedBy(uuid);

    return res.json({
      success: true,
      data: {
        uuid_emps: emp.uuid_emps,
        nombre: emp.emp_nombre,
        apellido: emp.emp_apellido,
        username: emp.emp_username,
        email: emp.emp_email,
        telefono: emp.emp_telefono,
        role: emp.nombre_rol,          // stl_emp, etc (front lo mapea)
        image_profile: emp.emp_image_profile,
        last_login: emp.last_login,

        address: address
          ? {
              direccion: address.direccion,
              ciudad: address.ciudad,
              pais: address.pais,
              codigo_postal: address.codigo_postal,
            }
          : null,

        activity: {
          productos_creados: createdCount,
          ultima_conexion: emp.last_login,
        },
      },
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ success: false, message: "Error interno al obtener perfil." });
  }
};

// PUT /api/profile/me/address  (upsert)
export const upsertMyEmployeeAddress = async (req, res) => {
  if (!requireEmployee(req, res)) return;

  try {
    const uuid = req.user.id;
    const { direccion, ciudad, pais, codigo_postal } = req.body;

    if (!direccion || !ciudad || !pais) {
      return res.status(400).json({ message: "direccion, ciudad y pais son obligatorios." });
    }

    const result = await AddressModel.upsertForEmployee(uuid, {
      direccion: String(direccion).trim(),
      ciudad: String(ciudad).trim(),
      pais: String(pais).trim(),
      codigo_postal: codigo_postal ? String(codigo_postal).trim() : null,
    });

    return res.json({ success: true, message: "Dirección actualizada.", data: result });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ success: false, message: "Error interno al guardar dirección." });
  }
};

// PATCH /api/profile/me/password
export const changeMyEmployeePassword = async (req, res) => {
  if (!requireEmployee(req, res)) return;

  try {
    const uuid = req.user.id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "currentPassword y newPassword son obligatorios." });
    }
    if (String(newPassword).length < 6) {
      return res.status(400).json({ message: "La nueva contraseña debe tener al menos 6 caracteres." });
    }

    const emp = await EmployeeModel.findById(uuid);
    if (!emp) return res.status(404).json({ message: "Empleado no encontrado." });

    const ok = await bcrypt.compare(currentPassword, emp.emp_password);
    if (!ok) return res.status(401).json({ message: "Contraseña actual incorrecta." });

    const hashed = await bcrypt.hash(newPassword, 10);
    await EmployeeModel.updatePassword(uuid, hashed);

    return res.json({ success: true, message: "Contraseña actualizada correctamente." });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ success: false, message: "Error interno al cambiar contraseña." });
  }
};
