import { pool } from "../../config/db.js";

export const OrderGuestModel = {
  findCartById: async (uuid_pedido) => {
    const [rows] = await pool.query(
      `SELECT * FROM Pedido WHERE uuid_pedido = ? LIMIT 1`,
      [uuid_pedido]
    );
    return rows[0] || null;
  },

  createCart: async () => {
    // uuid_customer NULL, id_address NULL
    await pool.query(
      `INSERT INTO Pedido
        (precio, estado, metodo_entrega, costo_envio, nombre_pedido, apellido_pedido, email_pedido, telefono_pedido, uuid_customer, id_address)
       VALUES
        (0, 'carrito', NULL, 0, '', '', '', '', NULL, NULL)`
    );

    // Recupera el último carrito creado (como uuid_pedido lo genera trigger)
    const [rows] = await pool.query(
      `SELECT * FROM Pedido WHERE estado='carrito' AND uuid_customer IS NULL
       ORDER BY fecha_pedido DESC
       LIMIT 1`
    );
    return rows[0] || null;
  },

  listCartItems: async (uuid_pedido) => {
    const [rows] = await pool.query(
      `SELECT
        dp.id_detalle_pedido,
        dp.uuid_pedido,
        dp.id_producto,
        dp.cantidad,
        dp.precio_unitario,
        (dp.cantidad * dp.precio_unitario) AS total_item,
        p.nombre,
        p.imagen_url,
        p.stock
      FROM Detalle_Pedido dp
      LEFT JOIN Producto p ON dp.id_producto = p.id_producto
      WHERE dp.uuid_pedido = ?
      ORDER BY dp.id_detalle_pedido DESC`,
      [uuid_pedido]
    );
    return rows;
  },

  upsertCartItem: async ({ uuid_pedido, id_producto, cantidad }) => {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      const [prodRows] = await conn.query(
        `SELECT id_producto, precio, stock FROM Producto WHERE id_producto = ?`,
        [id_producto]
      );
      if (prodRows.length === 0) {
        const err = new Error("Producto no encontrado.");
        err.status = 404;
        throw err;
      }

      if (cantidad <= 0) {
        await conn.query(
          `DELETE FROM Detalle_Pedido WHERE uuid_pedido = ? AND id_producto = ?`,
          [uuid_pedido, id_producto]
        );
      } else {
        const precio_unitario = Number(prodRows[0].precio ?? 0);

        await conn.query(
          `INSERT INTO Detalle_Pedido (precio_unitario, cantidad, uuid_pedido, id_producto)
           VALUES (?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE
             cantidad = VALUES(cantidad),
             precio_unitario = VALUES(precio_unitario)`,
          [precio_unitario, cantidad, uuid_pedido, id_producto]
        );
      }

      const subtotal = await OrderGuestModel._recalcOrderSubtotal(conn, uuid_pedido);

      await conn.commit();
      return { uuid_pedido, subtotal };
    } catch (e) {
      await conn.rollback();
      throw e;
    } finally {
      conn.release();
    }
  },

  updateCustomerInfo: async ({ uuid_pedido, nombre, apellido, email, telefono }) => {
    const [result] = await pool.query(
      `UPDATE Pedido
       SET nombre_pedido=?, apellido_pedido=?, email_pedido=?, telefono_pedido=?
       WHERE uuid_pedido=?`,
      [nombre, apellido, email, telefono, uuid_pedido]
    );
    return result.affectedRows;
  },

  // Dirección guest: guardamos address sin uuid_customer ni uuid_emps
  createAddressGuest: async ({ direccion, ciudad, pais, codigo_postal }) => {
    const [ins] = await pool.query(
      `INSERT INTO Address (direccion, ciudad, pais, codigo_postal, uuid_customer, uuid_emps)
       VALUES (?, ?, ?, ?, NULL, NULL)`,
      [direccion, ciudad, pais, codigo_postal || null]
    );
    return { id_address: ins.insertId };
  },

  attachAddressToOrder: async ({ uuid_pedido, id_address }) => {
    const [result] = await pool.query(
      `UPDATE Pedido SET id_address=? WHERE uuid_pedido=?`,
      [id_address, uuid_pedido]
    );
    return result.affectedRows;
  },

  checkoutCart: async ({ uuid_pedido, metodo_entrega, costo_envio = 0 }) => {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      const [orderRows] = await conn.query(
        `SELECT uuid_pedido, estado, id_address, nombre_pedido, apellido_pedido, email_pedido
         FROM Pedido
         WHERE uuid_pedido = ?
         FOR UPDATE`,
        [uuid_pedido]
      );
      if (orderRows.length === 0) {
        const err = new Error("Pedido no encontrado.");
        err.status = 404;
        throw err;
      }

      const order = orderRows[0];

      if (order.estado !== "carrito") {
        const err = new Error("Este pedido no está en estado carrito.");
        err.status = 400;
        throw err;
      }

      const [itemRows] = await conn.query(
        `SELECT COUNT(*) AS total FROM Detalle_Pedido WHERE uuid_pedido=?`,
        [uuid_pedido]
      );
      if ((itemRows[0]?.total ?? 0) <= 0) {
        const err = new Error("No puedes confirmar un pedido sin productos.");
        err.status = 400;
        throw err;
      }

      if (!order.nombre_pedido || !order.apellido_pedido || !order.email_pedido) {
        const err = new Error("Faltan datos del pedido (nombre, apellido, email).");
        err.status = 400;
        throw err;
      }

      if (metodo_entrega === "envio" && !order.id_address) {
        const err = new Error("Para envío, debes registrar dirección antes de confirmar.");
        err.status = 400;
        throw err;
      }

      const subtotal = await OrderGuestModel._recalcOrderSubtotal(conn, uuid_pedido);
      const total = Number(subtotal) + Number(costo_envio || 0);

      await conn.query(
        `UPDATE Pedido
         SET metodo_entrega=?, costo_envio=?, precio=?, estado='pendiente'
         WHERE uuid_pedido=?`,
        [metodo_entrega, Number(costo_envio || 0), total, uuid_pedido]
      );

      await conn.commit();
      return { uuid_pedido, subtotal, costo_envio: Number(costo_envio || 0), total };
    } catch (e) {
      await conn.rollback();
      throw e;
    } finally {
      conn.release();
    }
  },

  _recalcOrderSubtotal: async (conn, uuid_pedido) => {
    const [sumRows] = await conn.query(
      `SELECT COALESCE(SUM(cantidad * precio_unitario), 0) AS subtotal
       FROM Detalle_Pedido WHERE uuid_pedido=?`,
      [uuid_pedido]
    );
    const subtotal = Number(sumRows[0]?.subtotal ?? 0);

    await conn.query(`UPDATE Pedido SET precio=? WHERE uuid_pedido=?`, [subtotal, uuid_pedido]);
    return subtotal;
  },
};
