import { pool } from "../../../config/db.js";

// Devuelve el precio efectivo: usa la oferta si es válida (>0 y menor al precio).
const resolveUnitPrice = (row) => {
  const base = Number(row.precio ?? 0);
  const offer = row.precio_oferta != null ? Number(row.precio_oferta) : null;
  return offer != null && offer > 0 && offer < base ? offer : base;
};

// Valida stock disponible y lo descuenta para cada item del pedido.
// Debe ejecutarse dentro de la transacción de checkout (conn).
export const descontarStock = async (conn, uuid_pedido) => {
  const [detItems] = await conn.query(
    `SELECT dp.id_producto, dp.cantidad, p.stock, p.nombre
     FROM Detalle_Pedido dp
     JOIN Producto p ON p.id_producto = dp.id_producto
     WHERE dp.uuid_pedido = ?
     FOR UPDATE`,
    [uuid_pedido]
  );

  for (const it of detItems) {
    if (Number(it.cantidad) > Number(it.stock)) {
      const err = new Error(`Stock insuficiente para "${it.nombre}". Disponible: ${it.stock}.`);
      err.status = 400;
      throw err;
    }
  }

  for (const it of detItems) {
    await conn.query(
      `UPDATE Producto SET stock = stock - ? WHERE id_producto = ?`,
      [it.cantidad, it.id_producto]
    );
  }
};

export const OrderCustomerModel = {
  // Buscar carrito actual del cliente
  findCartByCustomer: async (uuid_customer) => {
    const [rows] = await pool.query(
      `SELECT *
       FROM Pedido
       WHERE uuid_customer = ? AND estado = 'carrito'
       ORDER BY fecha_pedido DESC
       LIMIT 1`,
      [uuid_customer]
    );
    return rows[0] || null;
  },

  // Crear carrito vacío
  createCart: async (uuid_customer) => {
    const [result] = await pool.query(
      `INSERT INTO Pedido
        (precio, estado, metodo_entrega, costo_envio, nombre_pedido, apellido_pedido, email_pedido, telefono_pedido, uuid_customer, id_address)
       VALUES
        (0, 'carrito', NULL, 0, '', '', '', '', ?, NULL)`,
      [uuid_customer]
    );

    const cart = await OrderCustomerModel.findCartByCustomer(uuid_customer);
    return cart;
  },

  // Marca un pedido pendiente del cliente como pagado (pago simulado).
  markOrderPaid: async (uuid_customer, uuid_pedido) => {
    const [result] = await pool.query(
      `UPDATE Pedido
       SET estado = 'pagado'
       WHERE uuid_pedido = ? AND uuid_customer = ? AND estado = 'pendiente'`,
      [uuid_pedido, uuid_customer]
    );
    return result.affectedRows > 0;
  },

  // Historial de pedidos del cliente (todo lo que ya no es carrito)
  findOrdersByCustomer: async (uuid_customer) => {
    const [rows] = await pool.query(
      `SELECT
        p.uuid_pedido,
        p.fecha_pedido,
        p.estado,
        p.precio,
        p.metodo_entrega,
        COUNT(dp.id_detalle_pedido) AS items
      FROM Pedido p
      LEFT JOIN Detalle_Pedido dp ON p.uuid_pedido = dp.uuid_pedido
      WHERE p.uuid_customer = ? AND p.estado <> 'carrito'
      GROUP BY p.uuid_pedido
      ORDER BY p.fecha_pedido DESC`,
      [uuid_customer]
    );
    return rows;
  },

  // Obtener items del carrito
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
        p.stock,
        p.precio AS precio_original
      FROM Detalle_Pedido dp
      LEFT JOIN Producto p ON dp.id_producto = p.id_producto
      WHERE dp.uuid_pedido = ?
      ORDER BY dp.id_detalle_pedido DESC`,
      [uuid_pedido]
    );
    return rows;
  },

  // Upsert item (cantidad = 0 => eliminar)
  upsertCartItem: async ({ uuid_pedido, id_producto, cantidad }) => {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      // producto existe? (incluye precio de oferta activa si la hay)
      const [prodRows] = await conn.query(
        `SELECT p.id_producto, p.precio, p.stock,
           (SELECT o.precio_oferta
              FROM Producto_Oferta o
             WHERE o.id_producto = p.id_producto
               AND o.activo = 1
               AND (o.fecha_inicio IS NULL OR o.fecha_inicio <= NOW())
               AND (o.fecha_fin    IS NULL OR o.fecha_fin    >= NOW())
             ORDER BY o.updated_at DESC
             LIMIT 1) AS precio_oferta
         FROM Producto p
         WHERE p.id_producto = ?`,
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
        const precio_unitario = resolveUnitPrice(prodRows[0]);

        // UNIQUE KEY (uuid_pedido, id_producto)
        await conn.query(
          `INSERT INTO Detalle_Pedido (precio_unitario, cantidad, uuid_pedido, id_producto)
           VALUES (?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE
             cantidad = VALUES(cantidad),
             precio_unitario = VALUES(precio_unitario)`,
          [precio_unitario, cantidad, uuid_pedido, id_producto]
        );
      }

      const subtotal = await OrderCustomerModel._recalcOrderSubtotal(conn, uuid_pedido);

      await conn.commit();
      return { uuid_pedido, subtotal };
    } catch (e) {
      await conn.rollback();
      throw e;
    } finally {
      conn.release();
    }
  },

  // Guardar datos de pedido
  updateCustomerInfo: async ({ uuid_pedido, nombre, apellido, email, telefono }) => {
    const [result] = await pool.query(
      `UPDATE Pedido
       SET nombre_pedido = ?, apellido_pedido = ?, email_pedido = ?, telefono_pedido = ?
       WHERE uuid_pedido = ?`,
      [nombre, apellido, email, telefono, uuid_pedido]
    );
    return result.affectedRows;
  },

  // Upsert dirección para cliente (última address)
  upsertAddressForCustomer: async ({ uuid_customer, direccion, ciudad, pais, codigo_postal }) => {
    const [rows] = await pool.query(
      `SELECT id_address
       FROM Address
       WHERE uuid_customer = ?
       ORDER BY id_address DESC
       LIMIT 1`,
      [uuid_customer]
    );

    if (rows.length === 0) {
      const [ins] = await pool.query(
        `INSERT INTO Address (direccion, ciudad, pais, codigo_postal, uuid_customer, uuid_emps)
         VALUES (?, ?, ?, ?, ?, NULL)`,
        [direccion, ciudad, pais, codigo_postal || null, uuid_customer]
      );
      return { id_address: ins.insertId };
    }

    const id_address = rows[0].id_address;

    await pool.query(
      `UPDATE Address
       SET direccion = ?, ciudad = ?, pais = ?, codigo_postal = ?
       WHERE id_address = ?`,
      [direccion, ciudad, pais, codigo_postal || null, id_address]
    );

    return { id_address };
  },

  // Asociar address al pedido
  attachAddressToOrder: async ({ uuid_pedido, id_address }) => {
    const [result] = await pool.query(
      `UPDATE Pedido SET id_address = ? WHERE uuid_pedido = ?`,
      [id_address, uuid_pedido]
    );
    return result.affectedRows;
  },

  // Traer pedido (para validar datos en checkout)
  findOrderById: async (uuid_pedido) => {
    const [rows] = await pool.query(
      `SELECT *
       FROM Pedido
       WHERE uuid_pedido = ?
       LIMIT 1`,
      [uuid_pedido]
    );
    return rows[0] || null;
  },

  // Checkout
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

      // validar items
      const [itemRows] = await conn.query(
        `SELECT COUNT(*) AS total
         FROM Detalle_Pedido
         WHERE uuid_pedido = ?`,
        [uuid_pedido]
      );
      const itemsCount = itemRows[0]?.total ?? 0;
      if (itemsCount <= 0) {
        const err = new Error("No puedes confirmar un pedido sin productos.");
        err.status = 400;
        throw err;
      }

      // validar datos del pedido
      if (!order.nombre_pedido || !order.apellido_pedido || !order.email_pedido) {
        const err = new Error("Faltan datos del pedido (nombre, apellido, email).");
        err.status = 400;
        throw err;
      }

      // validar dirección si envío
      if (metodo_entrega === "envio" && !order.id_address) {
        const err = new Error("Para envío, debes registrar dirección antes de confirmar.");
        err.status = 400;
        throw err;
      }

      // Descontar stock validando disponibilidad
      await descontarStock(conn, uuid_pedido);

      // recalcular subtotal y total
      const subtotal = await OrderCustomerModel._recalcOrderSubtotal(conn, uuid_pedido);
      const total = Number(subtotal) + Number(costo_envio || 0);

      await conn.query(
        `UPDATE Pedido
         SET metodo_entrega = ?, costo_envio = ?, precio = ?, estado = 'pendiente'
         WHERE uuid_pedido = ?`,
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

  // helper: recalcula subtotal (precio sin envío) mientras es carrito
  _recalcOrderSubtotal: async (conn, uuid_pedido) => {
    const [sumRows] = await conn.query(
      `SELECT COALESCE(SUM(cantidad * precio_unitario), 0) AS subtotal
       FROM Detalle_Pedido
       WHERE uuid_pedido = ?`,
      [uuid_pedido]
    );

    const subtotal = Number(sumRows[0]?.subtotal ?? 0);

    // mientras es carrito, dejamos precio = subtotal (total se ajusta en checkout)
    await conn.query(
      `UPDATE Pedido SET precio = ? WHERE uuid_pedido = ?`,
      [subtotal, uuid_pedido]
    );

    return subtotal;
  },
};
