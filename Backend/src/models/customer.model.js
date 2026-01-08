import { pool } from '../config/db.js';

export const CustomerModel = {

  // Buscar usuario por email o username
  findByEmailOrUsername: async (identifier) => {
    const [rows] = await pool.query(
      `SELECT * FROM UserCustomer WHERE stl_email = ? OR stl_username = ?`,
      [identifier, identifier]
    );
    return rows[0];
  },

  // Crear nuevo usuario cliente
  create: async (userData) => {
    const { username, email, password, nombre, apellido } = userData;
    const [result] = await pool.query(
      `INSERT INTO UserCustomer (stl_username, stl_email, stl_password, stl_nombre, stl_apellido) VALUES (?, ?, ?, ?, ?)`,
      [username, email, password, nombre, apellido]
    );
    return result.insertId;
  },

  // Obtener todos los usuarios clientes
  findAll: async () => {
    const [rows] = await pool.query(
      `SELECT uuid_customer, stl_username, stl_email, stl_nombre, stl_apellido FROM UserCustomer`
    );
    return rows;
  },

  // Obtener usuario cliente por ID
  findById: async (id) => {
    const [rows] = await pool.query(
      `SELECT uuid_customer, stl_username, stl_email, stl_nombre, stl_apellido, stl_telefono, stl_image_profile FROM UserCustomer WHERE uuid_customer = ?`,
      [id]
    );
    return rows[0];
  },

  // Actualizar usuario cliente
  update: async (id, userData) => {
    const { username, email, nombre, apellido, telefono, image_profile } = userData;
    const [result] = await pool.query(
      `UPDATE UserCustomer 
       SET stl_username = ?, stl_email = ?, stl_nombre = ?, stl_apellido = ?, stl_telefono = ?, stl_image_profile = ?
       WHERE uuid_customer = ?`,
      [username, email, nombre, apellido, telefono, image_profile, id]
    );
    return result.affectedRows > 0;
  },

  // Eliminar usuario cliente
  delete: async (id) => {
    const [result] = await pool.query(
      `DELETE FROM UserCustomer WHERE uuid_customer = ?`,
      [id]
    );
    return result.affectedRows;
  },

  // Actualizar contraseña del usuario cliente
  updatePassword: async (uuid_customer, hashedPassword) => {
    const [result] = await pool.query(
      `UPDATE UserCustomer SET stl_password = ? WHERE uuid_customer = ?`,
      [hashedPassword, uuid_customer]
    );
    return result.affectedRows;
  },

  // Buscar usuario por google_id
  findByGoogleId: async (googleId) => {
    const [rows] = await pool.query(
      `SELECT * FROM UserCustomer WHERE google_id = ?`,
      [googleId]
    );
    return rows[0];
  },

  // Crear usuario customer usando Google
  createGoogleUser: async (userData) => {
    const { username, email, nombre, apellido, image_profile, google_id } = userData;

    const [result] = await pool.query(
      `INSERT INTO UserCustomer 
      (stl_username, stl_email, stl_password, stl_nombre, stl_apellido, stl_image_profile, google_id)
      VALUES (?, ?, NULL, ?, ?, ?, ?)`,
      [username, email, nombre, apellido, image_profile, google_id]
    );

    return result.insertId;
  },

  // Vincular google_id a usuario existente
  setGoogleId: async (uuid_customer, google_id) => {
    const [result] = await pool.query(
      `UPDATE UserCustomer SET google_id = ? WHERE uuid_customer = ?`,
      [google_id, uuid_customer]
    );
    return result.affectedRows;
  },

};