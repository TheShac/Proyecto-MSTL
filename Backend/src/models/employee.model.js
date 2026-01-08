import { pool } from '../config/db.js';

export const EmployeeModel = {
  // Buscar usuario por email o username
  findByEmailOrUsername: async (identifier) => {
    const [rows] = await pool.query(
      `SELECT e.*, r.nombre_rol FROM UserEmps_STL e 
       LEFT JOIN Role r ON e.id_role = r.id_role
       WHERE e.emp_email = ? OR e.emp_username = ?`,
      [identifier, identifier]
    );  
    return rows[0];
  },

  // Crear nuevo usuario empleado
  create: async (userData) => {
    const { username, email, password, nombre, apellido, telefono, image_profile, id_role } = userData;
    const [result] = await pool.query(
      `INSERT INTO UserEmps_STL (emp_username, emp_email, emp_password, emp_nombre, emp_apellido, emp_telefono, emp_image_profile, id_role) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [username, email, password, nombre, apellido, telefono, image_profile, id_role]
    );
    const [newEmployee] = await pool.query(
      `SELECT uuid_emps FROM UserEmps_STL WHERE emp_username = ?`,
      [username]
    );
    return newEmployee[0].uuid_emps;
  },

  // Obtener todos los usuarios empleados
  findAll: async () => {
    const [rows] = await pool.query(
      `SELECT e.uuid_emps, e.emp_nombre, e.emp_apellido, e.emp_telefono,
       e.emp_email, e.emp_username, e.id_role, r.nombre_rol
      FROM UserEmps_STL e
      LEFT JOIN Role r ON e.id_role = r.id_role`
    );
    return rows;
  },

  // Obtener usuario empleado por ID
  findById: async (id) => {
    const [rows] = await pool.query(
      `SELECT e.*, r.nombre_rol 
      FROM UserEmps_STL e 
      LEFT JOIN Role r ON e.id_role = r.id_role
      WHERE e.uuid_emps = ?`,
      [id]
    );
    return rows[0];
  },

  // Actualizar usuario empleado
  update: async (id, userData) => {
    const { username, email, telefono, nombre, apellido, image_profile, id_role } = userData;
    const [result] = await pool.query(
      `UPDATE UserEmps_STL SET 
      emp_username = ?, emp_email = ?, emp_telefono = ?, emp_nombre = ?, 
      emp_apellido = ?, emp_image_profile = ?, id_role = ?
      WHERE uuid_emps = ?`,
      [username, email, telefono, nombre, apellido, image_profile, id_role, id]
    );
    return result.affectedRows;
  },

  // Eliminar usuario empleado
  delete: async (id) => {
    const [result] = await pool.query(
      `DELETE FROM UserEmps_STL WHERE uuid_emps = ?`,
      [id]
    );
    return result.affectedRows;
  },
  
  // Actualizar contraseña del usuario empleado
  updatePassword: async (uuid_emps, hashedPassword) => {
    const [result] = await pool.query(
      `UPDATE UserEmps_STL SET emp_password = ? WHERE uuid_emps = ?`,
      [hashedPassword, uuid_emps]
    );
    return result.affectedRows;
  },

  updateLastLogin: async (uuid_emps) => {
    const [result] = await pool.query(
      `UPDATE UserEmps_STL SET last_login = NOW() WHERE uuid_emps = ?`,
      [uuid_emps]
    );
    return result.affectedRows;
  },

  // Actualizar SOLO perfil (sin tocar id_role)
  updateProfile: async (id, userData) => {
    const { username, email, telefono, nombre, apellido, image_profile } = userData;

    const [result] = await pool.query(
      `UPDATE UserEmps_STL SET
        emp_username = ?,
        emp_email = ?,
        emp_telefono = ?,
        emp_nombre = ?,
        emp_apellido = ?,
        emp_image_profile = ?
      WHERE uuid_emps = ?`,
      [username, email, telefono, nombre, apellido, image_profile, id]
    );

    return result.affectedRows;
  },

  // Buscar empleado por google_id
  findByGoogleId: async (googleId) => {
    const [rows] = await pool.query(
      `SELECT e.*, r.nombre_rol FROM UserEmps_STL e
      LEFT JOIN Role r ON e.id_role = r.id_role
      WHERE e.google_id = ?`,
      [googleId]
    );
    return rows[0];
  },

  // Vincular google_id a empleado existente
  setGoogleId: async (uuid_emps, google_id) => {
    const [result] = await pool.query(
      `UPDATE UserEmps_STL SET google_id = ? WHERE uuid_emps = ?`,
      [google_id, uuid_emps]
    );
    return result.affectedRows;
  },

};
