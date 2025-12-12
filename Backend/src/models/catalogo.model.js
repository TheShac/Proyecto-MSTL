import { pool } from '../config/db.js';

export const CatalogModel = {
  // Editoriales
  getAllEditorials: async () => {
    const [rows] = await pool.query(
      `SELECT id_editorial, nombre_editorial
       FROM Editorial
       ORDER BY nombre_editorial ASC`
    );
    return rows;
  },

  // Géneros
  getAllGenres: async () => {
    const [rows] = await pool.query(
      `SELECT id_genero, nombre_genero
       FROM Genero
       ORDER BY nombre_genero ASC`
    );
    return rows;
  },
};
