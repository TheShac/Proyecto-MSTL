import { pool } from '../../../config/db.js';

export const ReviewModel = {
  // Reseñas recientes (para el carrusel del home / catálogo)
  recent: async (limit = 12) => {
    const [rows] = await pool.query(
      `SELECT
         r.id_reseña    AS id,
         r.comentario,
         r.fecha,
         r.calificacion,
         c.stl_nombre   AS nombre,
         c.stl_apellido AS apellido,
         c.stl_image_profile AS image,
         p.id_producto,
         p.nombre       AS producto
       FROM Reseña_STL r
       JOIN UserCustomer c ON c.uuid_customer = r.uuid_customer
       JOIN Producto p     ON p.id_producto   = r.id_producto
       ORDER BY r.fecha DESC
       LIMIT ?`,
      [Number(limit)]
    );
    return rows;
  },

  // Reseñas de un producto
  byProduct: async (id_producto) => {
    const [rows] = await pool.query(
      `SELECT
         r.id_reseña    AS id,
         r.comentario,
         r.fecha,
         r.calificacion,
         c.stl_nombre   AS nombre,
         c.stl_apellido AS apellido,
         c.stl_image_profile AS image
       FROM Reseña_STL r
       JOIN UserCustomer c ON c.uuid_customer = r.uuid_customer
       WHERE r.id_producto = ?
       ORDER BY r.fecha DESC`,
      [id_producto]
    );
    return rows;
  },

  // Promedio y total de un producto
  summaryByProduct: async (id_producto) => {
    const [[row]] = await pool.query(
      `SELECT COUNT(*) AS total, COALESCE(AVG(calificacion), 0) AS promedio
       FROM Reseña_STL
       WHERE id_producto = ?`,
      [id_producto]
    );
    return { total: Number(row.total), promedio: Number(row.promedio) };
  },

  // ¿El cliente compró este producto? (pedido pagado/enviado/entregado)
  hasPurchased: async (uuid_customer, id_producto) => {
    const [[row]] = await pool.query(
      `SELECT COUNT(*) AS c
       FROM Pedido pe
       JOIN Detalle_Pedido dp ON dp.uuid_pedido = pe.uuid_pedido
       WHERE pe.uuid_customer = ?
         AND dp.id_producto = ?
         AND pe.estado IN ('pagado', 'enviado', 'entregado')`,
      [uuid_customer, id_producto]
    );
    return Number(row.c) > 0;
  },

  // Reseña existente del cliente para un producto (para precargar el form)
  myReview: async (uuid_customer, id_producto) => {
    const [[row]] = await pool.query(
      `SELECT id_reseña AS id, calificacion, comentario
       FROM Reseña_STL
       WHERE uuid_customer = ? AND id_producto = ?`,
      [uuid_customer, id_producto]
    );
    return row || null;
  },

  // ── Admin ───────────────────────────────────────────────────────────────
  adminList: async () => {
    const [rows] = await pool.query(
      `SELECT
         r.id_reseña    AS id,
         r.comentario,
         r.fecha,
         r.calificacion,
         c.stl_nombre   AS nombre,
         c.stl_apellido AS apellido,
         c.stl_email    AS email,
         p.id_producto,
         p.nombre       AS producto
       FROM Reseña_STL r
       JOIN UserCustomer c ON c.uuid_customer = r.uuid_customer
       JOIN Producto p     ON p.id_producto   = r.id_producto
       ORDER BY r.fecha DESC`
    );
    return rows;
  },

  remove: async (id_reseña) => {
    const [res] = await pool.query(`DELETE FROM Reseña_STL WHERE id_reseña = ?`, [id_reseña]);
    return res.affectedRows > 0;
  },

  // Crear o actualizar la reseña (una por cliente/producto)
  upsert: async (uuid_customer, id_producto, calificacion, comentario) => {
    await pool.query(
      `INSERT INTO Reseña_STL (uuid_customer, id_producto, calificacion, comentario)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         calificacion = VALUES(calificacion),
         comentario   = VALUES(comentario),
         fecha        = NOW()`,
      [uuid_customer, id_producto, calificacion, comentario || null]
    );
  },
};
