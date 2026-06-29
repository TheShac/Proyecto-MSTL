import { pool } from '../../../config/db.js';

export const WishlistModel = {
  // Devuelve el id de la wishlist del cliente; la crea si no existe.
  getOrCreateWishlistId: async (uuid_customer) => {
    const [rows] = await pool.query(
      `SELECT id_wishlist FROM WishList WHERE uuid_customer = ? ORDER BY id_wishlist ASC LIMIT 1`,
      [uuid_customer]
    );
    if (rows.length) return rows[0].id_wishlist;

    const [res] = await pool.query(
      `INSERT INTO WishList (wishlist_nombre, uuid_customer) VALUES (?, ?)`,
      ['Mi lista de deseos', uuid_customer]
    );
    return res.insertId;
  },

  // Productos en la wishlist del cliente (con precio de oferta activa si existe).
  listByCustomer: async (uuid_customer) => {
    const [rows] = await pool.query(
      `SELECT
         p.id_producto,
         p.nombre,
         p.precio,
         p.imagen_url,
         p.estado,
         p.stock,
         (SELECT o.precio_oferta
            FROM Producto_Oferta o
           WHERE o.id_producto = p.id_producto
             AND o.activo = 1
             AND (o.fecha_inicio IS NULL OR o.fecha_inicio <= NOW())
             AND (o.fecha_fin    IS NULL OR o.fecha_fin    >= NOW())
           ORDER BY o.updated_at DESC LIMIT 1) AS precio_oferta,
         e.nombre_editorial AS editorial
       FROM WishList w
       INNER JOIN Detalle_WishList d ON d.id_wishlist = w.id_wishlist
       INNER JOIN Producto p ON p.id_producto = d.id_producto
       LEFT JOIN Producto_Editorial pe ON p.id_producto = pe.id_producto
       LEFT JOIN Editorial e ON pe.id_editorial = e.id_editorial
       WHERE w.uuid_customer = ?
       ORDER BY p.id_producto DESC`,
      [uuid_customer]
    );
    return rows;
  },

  listIds: async (uuid_customer) => {
    const [rows] = await pool.query(
      `SELECT d.id_producto
       FROM WishList w
       INNER JOIN Detalle_WishList d ON d.id_wishlist = w.id_wishlist
       WHERE w.uuid_customer = ?`,
      [uuid_customer]
    );
    return rows.map((r) => r.id_producto);
  },

  add: async (uuid_customer, id_producto) => {
    const id_wishlist = await WishlistModel.getOrCreateWishlistId(uuid_customer);
    await pool.query(
      `INSERT IGNORE INTO Detalle_WishList (id_wishlist, id_producto) VALUES (?, ?)`,
      [id_wishlist, id_producto]
    );
  },

  remove: async (uuid_customer, id_producto) => {
    const [rows] = await pool.query(
      `SELECT id_wishlist FROM WishList WHERE uuid_customer = ? LIMIT 1`,
      [uuid_customer]
    );
    if (!rows.length) return false;

    const [res] = await pool.query(
      `DELETE FROM Detalle_WishList WHERE id_wishlist = ? AND id_producto = ?`,
      [rows[0].id_wishlist, id_producto]
    );
    return res.affectedRows > 0;
  },
};
