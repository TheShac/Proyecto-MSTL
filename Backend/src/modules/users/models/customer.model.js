import { pool } from '../../../config/db.js';

export const CustomerModel = {

  findByEmailOrUsername: async (identifier) => {
    const [rows] = await pool.query(
      `SELECT * FROM UserCustomer WHERE stl_email = ? OR stl_username = ?`,
      [identifier, identifier]
    );
    return rows[0] || null;
  },

  create: async ({ username, email, password, nombre, apellido, telefono, image_profile }) => {
    const [result] = await pool.query(
      `INSERT INTO UserCustomer 
        (stl_username, stl_email, stl_password, stl_nombre, stl_apellido, stl_telefono, stl_image_profile)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [username, email, password, nombre, apellido, telefono ?? null, image_profile ?? null]
    );
    return result.insertId;
  },

  findAll: async () => {
    const [rows] = await pool.query(
      `SELECT uuid_customer, stl_username, stl_email, stl_nombre, stl_apellido
       FROM UserCustomer`
    );
    return rows;
  },

  findById: async (id) => {
    const [rows] = await pool.query(
      `SELECT uuid_customer, stl_username, stl_email, stl_nombre, stl_apellido,
              stl_telefono, stl_image_profile
       FROM UserCustomer WHERE uuid_customer = ?`,
      [id]
    );
    return rows[0] || null;
  },

  update: async (id, { username, email, nombre, apellido, telefono, image_profile, password }) => {
    // Construir SET dinámico para no pisar campos que no llegan
    const fields = [];
    const values = [];

    if (username      !== undefined) { fields.push('stl_username = ?');      values.push(username); }
    if (email         !== undefined) { fields.push('stl_email = ?');         values.push(email); }
    if (nombre        !== undefined) { fields.push('stl_nombre = ?');        values.push(nombre); }
    if (apellido      !== undefined) { fields.push('stl_apellido = ?');      values.push(apellido); }
    if (telefono      !== undefined) { fields.push('stl_telefono = ?');      values.push(telefono); }
    if (image_profile !== undefined) { fields.push('stl_image_profile = ?'); values.push(image_profile); }
    if (password      !== undefined) { fields.push('stl_password = ?');      values.push(password); }

    if (fields.length === 0) return 0;

    values.push(id);
    const [result] = await pool.query(
      `UPDATE UserCustomer SET ${fields.join(', ')} WHERE uuid_customer = ?`,
      values
    );
    return result.affectedRows;
  },

  delete: async (id) => {
    const [result] = await pool.query(
      `DELETE FROM UserCustomer WHERE uuid_customer = ?`,
      [id]
    );
    return result.affectedRows;
  },

  updatePassword: async (uuid_customer, hashedPassword) => {
    const [result] = await pool.query(
      `UPDATE UserCustomer SET stl_password = ? WHERE uuid_customer = ?`,
      [hashedPassword, uuid_customer]
    );
    return result.affectedRows;
  },

  findByGoogleId: async (googleId) => {
    const [rows] = await pool.query(
      `SELECT * FROM UserCustomer WHERE google_id = ?`,
      [googleId]
    );
    return rows[0] || null;
  },

  createGoogleUser: async ({ username, email, nombre, apellido, image_profile, google_id }) => {
    const [result] = await pool.query(
      `INSERT INTO UserCustomer
        (stl_username, stl_email, stl_password, stl_nombre, stl_apellido, stl_image_profile, google_id)
       VALUES (?, ?, NULL, ?, ?, ?, ?)`,
      [username, email, nombre, apellido, image_profile ?? null, google_id]
    );
    return result.insertId;
  },

  setGoogleId: async (uuid_customer, google_id) => {
    const [result] = await pool.query(
      `UPDATE UserCustomer SET google_id = ? WHERE uuid_customer = ?`,
      [google_id, uuid_customer]
    );
    return result.affectedRows;
  },
};