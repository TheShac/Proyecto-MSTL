import { pool } from "../config/db.js";

export const AddressModel = {
  findByEmployeeUuid: async (uuid_emps) => {
    const [rows] = await pool.query(
      `SELECT id_address, direccion, ciudad, pais, codigo_postal
       FROM Address
       WHERE uuid_emps = ?
       ORDER BY id_address DESC
       LIMIT 1`,
      [uuid_emps]
    );
    return rows[0] || null;
  },

  upsertForEmployee: async (uuid_emps, { direccion, ciudad, pais, codigo_postal }) => {
    const existing = await AddressModel.findByEmployeeUuid(uuid_emps);

    if (!existing) {
      const [res] = await pool.query(
        `INSERT INTO Address (direccion, ciudad, pais, codigo_postal, uuid_emps)
         VALUES (?, ?, ?, ?, ?)`,
        [direccion, ciudad, pais, codigo_postal, uuid_emps]
      );
      return { id_address: res.insertId };
    }

    await pool.query(
      `UPDATE Address
       SET direccion = ?, ciudad = ?, pais = ?, codigo_postal = ?
       WHERE id_address = ?`,
      [direccion, ciudad, pais, codigo_postal, existing.id_address]
    );

    return { id_address: existing.id_address };
  },
};
