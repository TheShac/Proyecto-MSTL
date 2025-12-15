import { pool } from "../../config/db.js";

export const OrderModel = {

  // LISTADO DE PEDIDOS VISTA ADMIN
  findAll: async () => {
    const [rows] = await pool.query(`
      SELECT
        p.uuid_pedido,
        p.fecha_pedido,
        p.estado,
        p.precio,
        p.nombre_pedido,
        p.apellido_pedido,
        p.email_pedido,

        COUNT(dp.id_detalle_pedido) AS items
      FROM Pedido p
      LEFT JOIN Detalle_Pedido dp ON p.uuid_pedido = dp.uuid_pedido
      GROUP BY p.uuid_pedido
      ORDER BY p.fecha_pedido DESC
    `);

    return rows;
  },

  // DETALLO COMPLETO DEL PEDIDO
  findById: async (uuid_pedido) => {
    const [[pedido]] = await pool.query(
      `SELECT * FROM Pedido WHERE uuid_pedido = ?`,
      [uuid_pedido]
    );

    if (!pedido) return null;

    const [items] = await pool.query(`
      SELECT
        dp.cantidad,
        dp.precio_unitario,
        pr.nombre,
        pr.imagen_url
      FROM Detalle_Pedido dp
      JOIN Producto pr ON dp.id_producto = pr.id_producto
      WHERE dp.uuid_pedido = ?
    `, [uuid_pedido]);

    const [[address]] = await pool.query(`
      SELECT direccion, ciudad, pais, codigo_postal
      FROM Address
      WHERE id_address = ?
    `, [pedido.id_address]);

    return {
      ...pedido,
      items,
      address
    };
  },

  // CAMBIAR ESTADO DEL PEDIDO
  updateStatus: async (uuid_pedido, estado) => {
    const [res] = await pool.query(
      `UPDATE Pedido SET estado = ? WHERE uuid_pedido = ?`,
      [estado, uuid_pedido]
    );
    return res.affectedRows > 0;
  },

};
