import { pool } from "../../config/db.js";

export const OffersModel = {
  // Ofertas válidas para mostrar
  getPublicOffers: async (limit = 50) => {
    const [rows] = await pool.query(
      `
      SELECT
        po.id_oferta,
        po.id_producto,
        po.precio_oferta,
        po.activo,
        po.fecha_inicio,
        po.fecha_fin,
        p.nombre,
        p.precio,
        p.imagen_url,
        p.stock,
        p.estado,
        e.nombre_editorial AS editorial
      FROM Producto_Oferta po
      INNER JOIN Producto p ON p.id_producto = po.id_producto
      LEFT JOIN Producto_Editorial pe ON p.id_producto = pe.id_producto
      LEFT JOIN Editorial e ON pe.id_editorial = e.id_editorial
      WHERE po.activo = 1
        AND (po.fecha_inicio IS NULL OR po.fecha_inicio <= NOW())
        AND (po.fecha_fin IS NULL OR po.fecha_fin >= NOW())
      ORDER BY po.updated_at DESC, po.id_oferta DESC
      LIMIT ?
      `,
      [Number(limit)]
    );
    return rows;
  },

  // Admin: todas
  getAdminOffers: async () => {
    const [rows] = await pool.query(
      `
      SELECT
        po.id_oferta,
        po.id_producto,
        po.precio_oferta,
        po.activo,
        po.fecha_inicio,
        po.fecha_fin,
        po.created_at,
        po.updated_at,

        p.nombre,
        p.precio,
        p.imagen_url,
        p.stock,
        p.estado,
        e.nombre_editorial AS editorial
      FROM Producto_Oferta po
      INNER JOIN Producto p ON p.id_producto = po.id_producto
      LEFT JOIN Producto_Editorial pe ON p.id_producto = pe.id_producto
      LEFT JOIN Editorial e ON pe.id_editorial = e.id_editorial
      ORDER BY po.updated_at DESC, po.id_oferta DESC
      `
    );
    return rows;
  },

  exists: async (id_producto) => {
    const [rows] = await pool.query(
      `SELECT 1 FROM Producto_Oferta WHERE id_producto = ? LIMIT 1`,
      [Number(id_producto)]
    );
    return rows.length > 0;
  },

  // Upsert (crear o actualizar)
  upsert: async ({
    id_producto,
    precio_oferta,
    activo = 1,
    fecha_inicio = null,
    fecha_fin = null,
  }) => {
    const [result] = await pool.query(
      `
      INSERT INTO Producto_Oferta (id_producto, precio_oferta, activo, fecha_inicio, fecha_fin)
      VALUES (?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        precio_oferta = VALUES(precio_oferta),
        activo = VALUES(activo),
        fecha_inicio = VALUES(fecha_inicio),
        fecha_fin = VALUES(fecha_fin),
        updated_at = NOW()
      `,
      [Number(id_producto), Number(precio_oferta), Number(activo), fecha_inicio, fecha_fin]
    );

    return result.affectedRows > 0;
  },

  remove: async (id_producto) => {
    const [result] = await pool.query(
      `DELETE FROM Producto_Oferta WHERE id_producto = ?`,
      [Number(id_producto)]
    );
    return result.affectedRows > 0;
  },

  bulkUpsert: async ({ productIds, template }) => {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      for (const id of productIds) {
        await conn.query(
          `
          INSERT INTO Producto_Oferta (id_producto, precio_oferta, activo, fecha_inicio, fecha_fin)
          VALUES (?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE
            precio_oferta = VALUES(precio_oferta),
            activo = VALUES(activo),
            fecha_inicio = VALUES(fecha_inicio),
            fecha_fin = VALUES(fecha_fin),
            updated_at = NOW()
          `,
          [
            Number(id),
            Number(template.precio_oferta),
            Number(template.activo ?? 1),
            template.fecha_inicio ?? null,
            template.fecha_fin ?? null,
          ]
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
};
