import { pool } from '../config/db.js';

export const ProductModel = {

    // OBTENER TODOS LOS PRODUCTOS
    findAll: async() => {
        const [rows] = await pool.query(
            `SELECT 
                p.id_producto,
                p.nombre,
                p.estado,
                p.descripcion,
                p.precio,
                p.imagen_url,
                p.stock,

                pe.id_editorial,
                e.nombre_editorial AS editorial,

                pg.id_genero,
                g.nombre_genero AS genero,

                c.emp_nombre AS creado_por,
                m.emp_nombre AS modificado_por
            FROM Producto p
            LEFT JOIN Producto_Editorial pe ON p.id_producto = pe.id_producto
            LEFT JOIN Editorial e ON pe.id_editorial = e.id_editorial
            LEFT JOIN Producto_Genero pg ON p.id_producto = pg.id_producto
            LEFT JOIN Genero g ON pg.id_genero = g.id_genero
            LEFT JOIN UserEmps_STL c ON p.uuid_emp_create = c.uuid_emps
            LEFT JOIN UserEmps_STL m ON p.uuid_emp_modify = m.uuid_emps
            ORDER BY p.id_producto DESC`
        );
        return rows;
    },

    // OBTENER PRODUCTO POR ID
    findById: async (id) => {
        const [rows] = await pool.query(
            `SELECT 
                p.id_producto,
                p.nombre,
                p.estado,
                p.descripcion,
                p.precio,
                p.imagen_url,
                p.stock,

                pe.id_editorial,
                e.nombre_editorial AS editorial,

                pg.id_genero,
                g.nombre_genero AS genero,

                c.emp_nombre AS creado_por,
                m.emp_nombre AS modificado_por,

                CASE
                WHEN po.id_oferta IS NOT NULL
                    AND po.activo = 1
                    AND (po.fecha_inicio IS NULL OR po.fecha_inicio <= NOW())
                    AND (po.fecha_fin IS NULL OR po.fecha_fin >= NOW())
                THEN po.precio_oferta
                ELSE NULL
                END AS precio_oferta,

                -- (opcionales)
                po.activo AS oferta_activa,
                po.fecha_inicio AS oferta_inicio,
                po.fecha_fin AS oferta_fin

            FROM Producto p
            LEFT JOIN Producto_Editorial pe ON p.id_producto = pe.id_producto
            LEFT JOIN Editorial e ON pe.id_editorial = e.id_editorial
            LEFT JOIN Producto_Genero pg ON p.id_producto = pg.id_producto
            LEFT JOIN Genero g ON pg.id_genero = g.id_genero
            LEFT JOIN UserEmps_STL c ON p.uuid_emp_create = c.uuid_emps
            LEFT JOIN UserEmps_STL m ON p.uuid_emp_modify = m.uuid_emps

            LEFT JOIN Producto_Oferta po ON po.id_producto = p.id_producto

            WHERE p.id_producto = ?`,
            [id]
        );
        return rows[0];
    },


    // CREAR NUEVO PRODUCTO
    create: async (productData) => {
        const { nombre, estado, descripcion, precio, imagen_url, stock, id_editorial, id_genero, uuid_emp_create } = productData;

        const [result] = await pool.query(
            `INSERT INTO Producto (nombre, estado, descripcion, precio, imagen_url, stock, uuid_emp_create)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [nombre, estado, descripcion, precio, imagen_url || '', stock, uuid_emp_create]
        );

        const id_producto = result.insertId;

        if (id_editorial)
            await pool.query('INSERT INTO Producto_Editorial (id_producto, id_editorial) VALUES (?, ?)', [id_producto, id_editorial]);
        if (id_genero)
            await pool.query('INSERT INTO Producto_Genero (id_producto, id_genero) VALUES (?, ?)', [id_producto, id_genero]);

        return { id_producto };
    },

    // ACTUALIZAR PRODUCTO
    update: async (id, productData) => {
        const { nombre, estado, descripcion, precio, imagen_url, stock, id_editorial, id_genero, uuid_emp_modify } = productData;

        const [result] = await pool.query(
            `UPDATE Producto SET 
                nombre = ?, estado = ?, descripcion = ?, precio = ?, imagen_url = ?, stock = ?, uuid_emp_modify = ?
             WHERE id_producto = ?`,
            [nombre, estado, descripcion, precio, imagen_url, stock, uuid_emp_modify, id]
        );

        await pool.query('DELETE FROM Producto_Editorial WHERE id_producto = ?', [id]);
        await pool.query('DELETE FROM Producto_Genero WHERE id_producto = ?', [id]);

        if (id_editorial)
            await pool.query('INSERT INTO Producto_Editorial (id_producto, id_editorial) VALUES (?, ?)', [id, id_editorial]);
        if (id_genero)
            await pool.query('INSERT INTO Producto_Genero (id_producto, id_genero) VALUES (?, ?)', [id, id_genero]);

        return result.affectedRows > 0;
    },

    // ELIMINAR PRODUCTO
    delete: async (id) => {
        const [result] = await pool.query('DELETE FROM Producto WHERE id_producto = ?', [id]);
        return result.affectedRows > 0;
    },

    countCreatedBy: async (uuid_emps) => {
        const [rows] = await pool.query(
            `SELECT COUNT(*) AS total
            FROM Producto
            WHERE uuid_emp_create = ?`,
            [uuid_emps]
        );
        return rows[0]?.total ?? 0;
    },

    // CATÁLOGO DE PRODUCTOS CON FILTROS, BÚSQUEDA Y PAGINACIÓN
    catalog: async ({ page, limit, search, editorial, genre, minPrice, maxPrice, sort }) => {
        const offset = (page - 1) * limit;

        let whereClauses = [];
        let params = [];

        if (search) {
            whereClauses.push(`(p.nombre LIKE ? OR e.nombre_editorial LIKE ? OR g.nombre_genero LIKE ?)`);
            params.push(`%${search}%`, `%${search}%`, `%${search}%`);
        }

        if (editorial) {
            whereClauses.push(`e.nombre_editorial = ?`);
            params.push(editorial);
        }

        if (genre) {
            whereClauses.push(`g.nombre_genero = ?`);
            params.push(genre);
        }

        if (minPrice) {
            whereClauses.push(`p.precio >= ?`);
            params.push(minPrice);
        }

        if (maxPrice) {
            whereClauses.push(`p.precio <= ?`);
            params.push(maxPrice);
        }

        const whereSQL = whereClauses.length ? `WHERE ${whereClauses.join(" AND ")}` : "";

        // Ordenamiento
        let orderSQL = "ORDER BY p.id_producto DESC"; // newest default
        if (sort === "az") orderSQL = "ORDER BY p.nombre ASC";
        if (sort === "za") orderSQL = "ORDER BY p.nombre DESC";
        if (sort === "priceAsc") orderSQL = "ORDER BY p.precio ASC";
        if (sort === "priceDesc") orderSQL = "ORDER BY p.precio DESC";

        // Query principal
        const [rows] = await pool.query(
            `
            SELECT 
                p.id_producto,
                p.nombre,
                p.estado,
                p.descripcion,
                p.precio,
                p.imagen_url,
                p.stock,
                e.nombre_editorial AS editorial,
                g.nombre_genero AS genero,

                CASE
                WHEN po.id_oferta IS NOT NULL
                    AND po.activo = 1
                    AND (po.fecha_inicio IS NULL OR po.fecha_inicio <= NOW())
                    AND (po.fecha_fin IS NULL OR po.fecha_fin >= NOW())
                THEN po.precio_oferta
                ELSE NULL
                END AS precio_oferta

            FROM Producto p
            LEFT JOIN Producto_Editorial pe ON p.id_producto = pe.id_producto
            LEFT JOIN Editorial e ON pe.id_editorial = e.id_editorial
            LEFT JOIN Producto_Genero pg ON p.id_producto = pg.id_producto
            LEFT JOIN Genero g ON pg.id_genero = g.id_genero

            LEFT JOIN Producto_Oferta po ON po.id_producto = p.id_producto

            ${whereSQL}
            ${orderSQL}
            LIMIT ? OFFSET ?
            `,
            [...params, Number(limit), Number(offset)]
        );

        // Query para total (paginación)
        const [countResult] = await pool.query(
            `
            SELECT COUNT(DISTINCT p.id_producto) AS total
            FROM Producto p
            LEFT JOIN Producto_Editorial pe ON p.id_producto = pe.id_producto
            LEFT JOIN Editorial e ON pe.id_editorial = e.id_editorial
            LEFT JOIN Producto_Genero pg ON p.id_producto = pg.id_producto
            LEFT JOIN Genero g ON pg.id_genero = g.id_genero
            ${whereSQL}
            `,
            params
        );
        return { products: rows, total: countResult[0].total };
    },
};