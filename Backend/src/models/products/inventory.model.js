import { pool } from '../../config/db.js';

export const InventoryModel = {
  listProducts: async () => {
    const [rows] = await pool.query(`
      SELECT 
        p.id_producto,
        p.nombre,
        p.estado,
        p.precio,
        p.stock,
        e.nombre_editorial AS editorial,
        g.nombre_genero AS genero
      FROM Producto p
      LEFT JOIN Producto_Editorial pe ON p.id_producto = pe.id_producto
      LEFT JOIN Editorial e ON pe.id_editorial = e.id_editorial
      LEFT JOIN Producto_Genero pg ON p.id_producto = pg.id_producto
      LEFT JOIN Genero g ON pg.id_genero = g.id_genero
      ORDER BY p.id_producto DESC
    `);
    return rows;
  },

  listMovements: async () => {
    const [rows] = await pool.query(`
      SELECT
        mi.id_movimiento,
        mi.fecha_movimiento,
        p.nombre AS producto,
        mi.tipo,
        mi.cantidad,
        mi.stock_anterior,
        mi.stock_nuevo,
        mi.motivo,
        ue.emp_username AS usuario,

        CASE
          WHEN mi.tipo = 'entrada' THEN mi.cantidad
          WHEN mi.tipo = 'salida' THEN -mi.cantidad
          WHEN mi.tipo = 'ajuste' THEN (mi.stock_nuevo - mi.stock_anterior)
        END AS delta
      FROM Movimiento_Inventario mi
      LEFT JOIN Producto p ON mi.id_producto = p.id_producto
      LEFT JOIN UserEmps_STL ue ON mi.uuid_emps = ue.uuid_emps
      ORDER BY mi.fecha_movimiento DESC, mi.id_movimiento DESC
    `);

    return rows;
  },

  // Ajuste de stock con auditoría
  adjustStock: async ({ id_producto, uuid_emps, tipo, cantidad, motivo }) => {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      // Bloquea la fila para evitar condición de carrera
      const [prodRows] = await conn.query(
        `SELECT id_producto, stock FROM Producto WHERE id_producto = ? FOR UPDATE`,
        [id_producto]
      );

      if (prodRows.length === 0) {
        const err = new Error('Producto no encontrado.');
        err.status = 404;
        throw err;
      }

      const stockAnterior = Number(prodRows[0].stock ?? 0);

      let stockNuevo = stockAnterior;

      if (tipo === 'entrada') {
        stockNuevo = stockAnterior + cantidad;
      } else if (tipo === 'salida') {
        stockNuevo = stockAnterior - cantidad;
      } else if (tipo === 'ajuste') {
        stockNuevo = cantidad;
      }

      if (stockNuevo < 0) {
        const err = new Error('Stock insuficiente: el stock no puede quedar negativo.');
        err.status = 400;
        throw err;
      }

      // Actualiza stock y registra quién modificó
      await conn.query(
        `UPDATE Producto SET stock = ?, uuid_emp_modify = ? WHERE id_producto = ?`,
        [stockNuevo, uuid_emps, id_producto]
      );

      // Inserta movimiento
      const [movRes] = await conn.query(
        `INSERT INTO Movimiento_Inventario
          (id_producto, uuid_emps, tipo, cantidad, stock_anterior, stock_nuevo, motivo)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [id_producto, uuid_emps, tipo, cantidad, stockAnterior, stockNuevo, motivo || null]
      );

      await conn.commit();

      return {
        id_movimiento: movRes.insertId,
        id_producto,
        stock_anterior: stockAnterior,
        stock_nuevo: stockNuevo,
      };
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      conn.release();
    }
  },
};
