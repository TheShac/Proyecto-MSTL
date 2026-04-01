import { pool } from '../../../config/db.js';

export const EmployeeModel = {

  findByEmailOrUsername: async (identifier) => {
    const [rows] = await pool.query(
      `SELECT e.*, r.nombre_rol FROM UserEmps_STL e 
       LEFT JOIN Role r ON e.id_role = r.id_role
       WHERE e.emp_email = ? OR e.emp_username = ?`,
      [identifier, identifier]
    );
    return rows[0] || null;
  },

  create: async ({ username, email, password, nombre, apellido, telefono, image_profile, id_role }) => {
    const [result] = await pool.query(
      `INSERT INTO UserEmps_STL 
        (emp_username, emp_email, emp_password, emp_nombre, emp_apellido, emp_telefono, emp_image_profile, id_role)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [username, email, password, nombre, apellido, telefono ?? null, image_profile ?? null, id_role]
    );
    const [newEmployee] = await pool.query(
      `SELECT uuid_emps FROM UserEmps_STL WHERE emp_username = ?`,
      [username]
    );
    return newEmployee[0].uuid_emps;
  },

  findAll: async () => {
    const [rows] = await pool.query(
      `SELECT e.uuid_emps, e.emp_nombre, e.emp_apellido, e.emp_telefono,
              e.emp_email, e.emp_username, e.id_role, r.nombre_rol
       FROM UserEmps_STL e
       LEFT JOIN Role r ON e.id_role = r.id_role`
    );
    return rows;
  },

  findById: async (id) => {
    const [rows] = await pool.query(
      `SELECT e.*, r.nombre_rol
       FROM UserEmps_STL e
       LEFT JOIN Role r ON e.id_role = r.id_role
       WHERE e.uuid_emps = ?`,
      [id]
    );
    return rows[0] || null;
  },

  // Actualización completa (admin) — incluye id_role
  update: async (id, { username, email, telefono, nombre, apellido, image_profile, id_role }) => {
    const fields = [];
    const values = [];

    if (username      !== undefined) { fields.push('emp_username = ?');      values.push(username); }
    if (email         !== undefined) { fields.push('emp_email = ?');         values.push(email); }
    if (nombre        !== undefined) { fields.push('emp_nombre = ?');        values.push(nombre); }
    if (apellido      !== undefined) { fields.push('emp_apellido = ?');      values.push(apellido); }
    if (telefono      !== undefined) { fields.push('emp_telefono = ?');      values.push(telefono); }
    if (image_profile !== undefined) { fields.push('emp_image_profile = ?'); values.push(image_profile); }
    if (id_role       !== undefined) { fields.push('id_role = ?');           values.push(id_role); }

    if (fields.length === 0) return 0;

    values.push(id);
    const [result] = await pool.query(
      `UPDATE UserEmps_STL SET ${fields.join(', ')} WHERE uuid_emps = ?`,
      values
    );
    return result.affectedRows;
  },

  // Actualización de perfil propio — nunca toca id_role
  updateProfile: async (id, { username, email, telefono, nombre, apellido, image_profile }) => {
    const fields = [];
    const values = [];

    if (username      !== undefined) { fields.push('emp_username = ?');      values.push(username); }
    if (email         !== undefined) { fields.push('emp_email = ?');         values.push(email); }
    if (nombre        !== undefined) { fields.push('emp_nombre = ?');        values.push(nombre); }
    if (apellido      !== undefined) { fields.push('emp_apellido = ?');      values.push(apellido); }
    if (telefono      !== undefined) { fields.push('emp_telefono = ?');      values.push(telefono); }
    if (image_profile !== undefined) { fields.push('emp_image_profile = ?'); values.push(image_profile); }

    if (fields.length === 0) return 0;

    values.push(id);
    const [result] = await pool.query(
      `UPDATE UserEmps_STL SET ${fields.join(', ')} WHERE uuid_emps = ?`,
      values
    );
    return result.affectedRows;
  },

  delete: async (id) => {
    const [result] = await pool.query(
      `DELETE FROM UserEmps_STL WHERE uuid_emps = ?`,
      [id]
    );
    return result.affectedRows;
  },

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

  findByGoogleId: async (googleId) => {
    const [rows] = await pool.query(
      `SELECT e.*, r.nombre_rol FROM UserEmps_STL e
       LEFT JOIN Role r ON e.id_role = r.id_role
       WHERE e.google_id = ?`,
      [googleId]
    );
    return rows[0] || null;
  },

  setGoogleId: async (uuid_emps, google_id) => {
    const [result] = await pool.query(
      `UPDATE UserEmps_STL SET google_id = ? WHERE uuid_emps = ?`,
      [google_id, uuid_emps]
    );
    return result.affectedRows;
  },
};