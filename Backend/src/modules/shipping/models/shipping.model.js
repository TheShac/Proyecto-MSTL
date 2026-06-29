import { pool } from '../../../config/db.js';

export const ShippingModel = {
  listActive: async () => {
    const [rows] = await pool.query(
      `SELECT id_tarifa, nombre, precio FROM Tarifa_Envio WHERE activo = 1 ORDER BY precio ASC`
    );
    return rows;
  },

  listAll: async () => {
    const [rows] = await pool.query(
      `SELECT id_tarifa, nombre, precio, activo FROM Tarifa_Envio ORDER BY id_tarifa DESC`
    );
    return rows;
  },

  findById: async (id) => {
    const [[row]] = await pool.query(
      `SELECT id_tarifa, nombre, precio, activo FROM Tarifa_Envio WHERE id_tarifa = ?`,
      [id]
    );
    return row || null;
  },

  create: async ({ nombre, precio, activo = 1 }) => {
    const [res] = await pool.query(
      `INSERT INTO Tarifa_Envio (nombre, precio, activo) VALUES (?, ?, ?)`,
      [nombre, precio, activo]
    );
    return res.insertId;
  },

  update: async (id, { nombre, precio, activo }) => {
    const [res] = await pool.query(
      `UPDATE Tarifa_Envio SET nombre = ?, precio = ?, activo = ? WHERE id_tarifa = ?`,
      [nombre, precio, activo, id]
    );
    return res.affectedRows > 0;
  },

  remove: async (id) => {
    const [res] = await pool.query(`DELETE FROM Tarifa_Envio WHERE id_tarifa = ?`, [id]);
    return res.affectedRows > 0;
  },
};
