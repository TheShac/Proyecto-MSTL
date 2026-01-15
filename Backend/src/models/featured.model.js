import { pool } from "../config/db.js";

export const FeaturedModel = {
  // PUBLIC: destacados vigentes + (si existe) oferta activa vigente
  getPublicFeatured: async (limit = 12) => {
    const [rows] = await pool.query(
      `
      SELECT
        fd.id_destacado,
        fd.activo,
        fd.posicion,

        p.id_producto,
        p.nombre,
        p.estado,
        p.descripcion,
        p.precio,
        p.imagen_url,
        p.stock,

        e.nombre_editorial AS editorial,

        o.precio_oferta

      FROM Producto_Destacado fd
      INNER JOIN Producto p ON p.id_producto = fd.id_producto
      LEFT JOIN Producto_Editorial pe ON p.id_producto = pe.id_producto
      LEFT JOIN Editorial e ON pe.id_editorial = e.id_editorial

      LEFT JOIN Producto_Oferta o ON o.id_producto = p.id_producto
        AND o.activo = 1
        AND (o.fecha_inicio IS NULL OR o.fecha_inicio <= NOW())
        AND (o.fecha_fin IS NULL OR o.fecha_fin >= NOW())

      WHERE fd.activo = 1
        AND (fd.fecha_inicio IS NULL OR fd.fecha_inicio <= NOW())
        AND (fd.fecha_fin IS NULL OR fd.fecha_fin >= NOW())
      ORDER BY fd.posicion ASC, fd.id_destacado DESC
      LIMIT ?
      `,
      [Number(limit)]
    );

    return rows;
  },

  // ADMIN: lista todos los destacados + info de oferta
  getAdminFeatured: async () => {
    const [rows] = await pool.query(
      `
      SELECT
        fd.id_destacado,
        fd.id_producto,
        fd.activo,
        fd.posicion,
        fd.fecha_inicio,
        fd.fecha_fin,

        p.nombre,
        p.precio,
        p.imagen_url,
        p.stock,
        e.nombre_editorial AS editorial,

        -- oferta (sin filtrar por vigencia para admin)
        o.precio_oferta,
        o.activo AS oferta_activa,
        o.fecha_inicio AS oferta_inicio,
        o.fecha_fin AS oferta_fin

      FROM Producto_Destacado fd
      INNER JOIN Producto p ON p.id_producto = fd.id_producto
      LEFT JOIN Producto_Editorial pe ON p.id_producto = pe.id_producto
      LEFT JOIN Editorial e ON pe.id_editorial = e.id_editorial

      LEFT JOIN Producto_Oferta o ON o.id_producto = p.id_producto

      ORDER BY fd.posicion ASC, fd.id_destacado DESC
      `
    );
    return rows;
  },

  addFeatured: async ({
    id_producto,
    posicion = 0,
    activo = 1,
    fecha_inicio = null,
    fecha_fin = null,
  }) => {
    const [result] = await pool.query(
      `
      INSERT INTO Producto_Destacado (id_producto, posicion, activo, fecha_inicio, fecha_fin)
      VALUES (?, ?, ?, ?, ?)
      `,
      [id_producto, posicion, activo, fecha_inicio, fecha_fin]
    );
    return result.insertId;
  },

  updateFeatured: async (id_producto, { posicion, activo, fecha_inicio, fecha_fin }) => {
    const [result] = await pool.query(
      `
      UPDATE Producto_Destacado
      SET posicion = COALESCE(?, posicion),
          activo = COALESCE(?, activo),
          fecha_inicio = ?,
          fecha_fin = ?
      WHERE id_producto = ?
      `,
      [
        posicion ?? null,
        activo ?? null,
        fecha_inicio ?? null,
        fecha_fin ?? null,
        id_producto,
      ]
    );
    return result.affectedRows > 0;
  },

  removeFeatured: async (id_producto) => {
    const [result] = await pool.query(
      `DELETE FROM Producto_Destacado WHERE id_producto = ?`,
      [id_producto]
    );
    return result.affectedRows > 0;
  },

  reorderFeatured: async (items) => {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      for (const item of items) {
        await conn.query(
          `UPDATE Producto_Destacado SET posicion = ? WHERE id_producto = ?`,
          [Number(item.posicion), Number(item.id_producto)]
        );
      }

      await conn.commit();
      return true;
    } catch (e) {
      await conn.rollback();
      throw e;
    } finally {
      conn.release();
    }
  },

  exists: async (id_producto) => {
    const [rows] = await pool.query(
      `SELECT 1 FROM Producto_Destacado WHERE id_producto = ? LIMIT 1`,
      [id_producto]
    );
    return rows.length > 0;
  },
};
