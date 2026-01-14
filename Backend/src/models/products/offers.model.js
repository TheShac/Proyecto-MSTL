import { pool } from "../../config/db.js";

export const OfferModel = {
  getProductBasePrice: async (id_producto) => {
    const [rows] = await pool.query(
      `SELECT precio FROM Producto WHERE id_producto = ? LIMIT 1`,
      [Number(id_producto)]
    );
    return rows[0]?.precio ?? null;
  },

  validateOfferPriceAgainstProducts: async (ids, precio_oferta) => {
    const cleanIds = [...new Set(ids.map(Number))].filter((x) => !Number.isNaN(x));
    if (cleanIds.length === 0) return [];

    const placeholders = cleanIds.map(() => "?").join(",");
    const [rows] = await pool.query(
      `SELECT id_producto, precio FROM Producto WHERE id_producto IN (${placeholders})`,
      cleanIds
    );

    const invalid = rows
      .filter((r) => Number(precio_oferta) >= Number(r.precio))
      .map((r) => ({ id_producto: r.id_producto, precio: r.precio }));

    return invalid;
  },

  getPublicOffers: async (limit = 12) => {
    const [rows] = await pool.query(
      `
      SELECT
        p.id_producto,
        p.nombre,
        p.estado,
        p.descripcion,
        p.precio,
        o.precio_oferta,
        o.activo,
        o.fecha_inicio,
        o.fecha_fin,
        p.imagen_url,
        p.stock,
        e.nombre_editorial AS editorial,
        g.nombre_genero AS genero
      FROM Producto_Oferta o
      INNER JOIN Producto p ON p.id_producto = o.id_producto
      LEFT JOIN Producto_Editorial pe ON p.id_producto = pe.id_producto
      LEFT JOIN Editorial e ON pe.id_editorial = e.id_editorial
      LEFT JOIN Producto_Genero pg ON p.id_producto = pg.id_producto
      LEFT JOIN Genero g ON pg.id_genero = g.id_genero
      WHERE o.activo = 1
        AND (o.fecha_inicio IS NULL OR o.fecha_inicio <= NOW())
        AND (o.fecha_fin IS NULL OR o.fecha_fin >= NOW())
      ORDER BY o.updated_at DESC, o.id_oferta DESC
      LIMIT ?
      `,
      [Number(limit)]
    );
    return rows;
  },

  getAdminOffers: async () => {
    const [rows] = await pool.query(
      `
      SELECT
        o.id_oferta,
        o.id_producto,
        o.precio_oferta,
        o.activo,
        o.fecha_inicio,
        o.fecha_fin,
        o.created_at,
        o.updated_at,

        p.nombre,
        p.precio,
        p.imagen_url,
        p.stock,
        e.nombre_editorial AS editorial,
        g.nombre_genero AS genero
      FROM Producto_Oferta o
      INNER JOIN Producto p ON p.id_producto = o.id_producto
      LEFT JOIN Producto_Editorial pe ON p.id_producto = pe.id_producto
      LEFT JOIN Editorial e ON pe.id_editorial = e.id_editorial
      LEFT JOIN Producto_Genero pg ON p.id_producto = pg.id_producto
      LEFT JOIN Genero g ON pg.id_genero = g.id_genero
      ORDER BY o.updated_at DESC, o.id_oferta DESC
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

  addOffer: async ({ id_producto, precio_oferta, activo = 1, fecha_inicio = null, fecha_fin = null }) => {
    const [result] = await pool.query(
      `
      INSERT INTO Producto_Oferta (id_producto, precio_oferta, activo, fecha_inicio, fecha_fin)
      VALUES (?, ?, ?, ?, ?)
      `,
      [Number(id_producto), Number(precio_oferta), Number(activo), fecha_inicio, fecha_fin]
    );
    return result.insertId;
  },

  updateOffer: async (id_producto, { precio_oferta, activo, fecha_inicio = null, fecha_fin = null }) => {
    const [result] = await pool.query(
      `
      UPDATE Producto_Oferta
      SET
        precio_oferta = COALESCE(?, precio_oferta),
        activo = COALESCE(?, activo),
        fecha_inicio = ?,
        fecha_fin = ?
      WHERE id_producto = ?
      `,
      [precio_oferta ?? null, activo ?? null, fecha_inicio ?? null, fecha_fin ?? null, Number(id_producto)]
    );
    return result.affectedRows > 0;
  },

  removeOffer: async (id_producto) => {
    const [result] = await pool.query(
      `DELETE FROM Producto_Oferta WHERE id_producto = ?`,
      [Number(id_producto)]
    );
    return result.affectedRows > 0;
  },

  addOfferBatch: async ({ ids, precio_oferta, activo = 1, fecha_inicio = null, fecha_fin = null, mode = "skip" }) => {
    const cleanIds = [...new Set(ids.map(Number))].filter((x) => !Number.isNaN(x));
    if (cleanIds.length === 0) return { inserted: 0, updated: 0, skipped: 0 };

    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      let inserted = 0;
      let updated = 0;
      let skipped = 0;

      for (const id_producto of cleanIds) {
        const [existsRows] = await conn.query(
          `SELECT id_oferta FROM Producto_Oferta WHERE id_producto = ? LIMIT 1`,
          [id_producto]
        );

        const exists = existsRows.length > 0;

        if (exists && mode === "skip") {
          skipped++;
          continue;
        }

        if (exists && mode === "upsert") {
          const [r] = await conn.query(
            `
            UPDATE Producto_Oferta
            SET precio_oferta = ?,
                activo = ?,
                fecha_inicio = ?,
                fecha_fin = ?
            WHERE id_producto = ?
            `,
            [Number(precio_oferta), Number(activo), fecha_inicio, fecha_fin, id_producto]
          );
          if (r.affectedRows > 0) updated++;
          continue;
        }

        const [r] = await conn.query(
          `
          INSERT INTO Producto_Oferta (id_producto, precio_oferta, activo, fecha_inicio, fecha_fin)
          VALUES (?, ?, ?, ?, ?)
          `,
          [id_producto, Number(precio_oferta), Number(activo), fecha_inicio, fecha_fin]
        );
        if (r.insertId) inserted++;
      }

      await conn.commit();
      return { inserted, updated, skipped };
    } catch (e) {
      await conn.rollback();
      throw e;
    } finally {
      conn.release();
    }
  },
};
