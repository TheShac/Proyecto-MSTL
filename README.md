# Manga Store TL

E-commerce de manga, figuras y artículos de anime. Proyecto **demo** full-stack con
catálogo público, carrito (cliente registrado e invitado), checkout con **pago
simulado**, reseñas, panel de administración y más.

> Proyecto de demostración: el pago es simulado (no se cobra nada real) y la
> recuperación de contraseña funciona en "modo demo" sin servidor de correo.

---

## Funcionalidades

**Tienda (cliente / invitado)**

- Catálogo con búsqueda, filtros (editorial, género, precio, solo ofertas), orden y paginación.
- Detalle de producto con promedio de reseñas, recomendaciones y carrusel.
- Carrito lateral (drawer) para cliente registrado **e invitado**.
- Checkout tipo wizard (Detalle → Dirección → Pago) con resumen tipo boleta
  (precio original, descuento por oferta, ahorro y costo de envío).
- Pago **simulado** que deja el pedido en estado *pagado*.
- **Reseñas**: estrellas + comentario por producto (solo quien lo compró); carrusel
  de reseñas en home y catálogo; promedio en las tarjetas.
- Wishlist / favoritos (con badge en el navbar), perfil con datos y dirección,
  historial de pedidos.
- Seguimiento de pedido por código.
- Login / registro (incl. **Google OAuth**) y recuperación de contraseña.
- Menú lateral de categorías (editoriales y géneros reales) y modo claro / oscuro.

**Administración**

- Dashboard con métricas reales (productos, stock bajo, pedidos, ingresos).
- CRUD de productos (con carga de imagen drag & drop), inventario (movimientos y ajustes de stock).
- Pedidos, clientes, ofertas, destacados, empleados, perfil.
- Moderación de **reseñas** y gestión de **tarifas de envío**.
- Analíticas de ventas por estado.

---

## Stack

| Capa          | Tecnologías                                                                                          |
| ------------- | ----------------------------------------------------------------------------------------------------- |
| Backend       | Node.js, Express 5, MySQL (`mysql2`), JWT, Passport (Google), Zod, bcrypt, Helmet, CORS, rate-limit |
| Frontend      | React 19, React Router 7, Vite, Bootstrap 5, SweetAlert2 (`fetch`, sin axios)                       |
| Base de datos | MySQL                                                                                                 |

---

## Estructura

```
Backend/
  src/
    app.js                # Express app (CORS, helmet, rutas)
    server.js           
    config/               # db.js, passport.js
    Middlewares/          # auth, rateLimit, sanitize, validate
    modules/              # auth, products, orders, employees, users,
                          # wishlist, reviews, shipping
    routes/portals/       # admin / customer / guest
Frontend/
  src/
    services/api.js       # cliente fetch centralizado (+ token.js)
    stores/               # AuthContext, ThemeContext, CartContext, WishlistContext
    components/           # Navbar, CartDrawer, AuthModal, Footer, ...
    views/
      client/             # catálogo, producto, carrito, perfil, seguimiento, reseñas
      admin/              # dashboard, products, inventory, orders, reviews, shipping, ...
      shared/             # login, registro, recuperación de contraseña
```

El backend usa **arquitectura modular por features** y portales con control de rol
(`admin`, `customer`, `guest`). Las vistas admin se cargan con *code-splitting* (lazy).

---

## Puesta en marcha

### 1. Base de datos

Crea la base de datos MySQL e importa los scripts de la carpeta `database/`.

> Las reseñas usan la tabla `Reseña_STL` (incluida en los scripts de `database/`).

### 2. Backend

```bash
cd Backend
npm install
# crea el archivo .env (ver variables abajo)
npm run dev      # nodemon (desarrollo)  |  npm start (producción)
```

Variables de entorno (`Backend/.env`):

```env
PORT=3000
FRONTEND_URL=http://localhost:5173

# MySQL
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=database_name

# JWT
JWT_SECRET=un_secreto_largo_y_aleatorio
JWT_EXPIRES_IN=3h

# Google OAuth
GOOGLE_CLIENT_ID=xxxx
GOOGLE_CLIENT_SECRET=xxxx
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback

# Roles que pueden crear empleados (opcional)
ALLOWED_EMPLOYEE_CREATOR_ROLES=stl_administrador,stl_superadministrador
```

### 3. Frontend

```bash
cd Frontend
npm install
# crea el archivo .env (ver abajo)
npm run dev      # Vite
```

Variables de entorno (`Frontend/.env`):

```env
# Debe incluir el prefijo /api
VITE_API_URL=http://localhost:3000/api
```

La app queda en `http://localhost:5173`.

---

## Scripts

**Backend**: `npm run dev` (nodemon) · `npm start`
**Frontend**: `npm run dev` · `npm run build` · `npm run preview` · `npm run lint`

---

## API (resumen)

| Portal   | Prefijo           | Ejemplos                                                                                                                                                    |
| -------- | ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Auth     | `/api/auth`     | `login`, `register`, `profile`, `forgot-password`, `reset-password`, `google`                                                                   |
| Público | `/api`          | `products`, `catalogo`, `featured`, `offers`, `reviews/recent`, `reviews/product/:id`, `shipping`, `orders/track/:id`, `orders/guest/...` |
| Cliente  | `/api/customer` | `orders`, `orders/cart`, `orders/:id/pay`, `address`, `wishlist`, `reviews`                                                                     |
| Admin    | `/api/admin`    | `products`, `inventory`, `orders`, `users`, `offers`, `featured`, `employees`, `profile`, `reviews`, `shipping`                         |

---

## Notas de la demo

- **Pago simulado**: usa una tarjeta con formato válido (ej. `4242 4242 4242 4242`, `12/30`, `123`).
- **Recuperación de contraseña**: como no hay SMTP, el endpoint devuelve el enlace de
  restablecimiento directamente para poder probar el flujo.
- **Stock**: al confirmar una compra se valida y descuenta el stock de cada producto.
- **Envío**: el costo se calcula en el servidor según la tarifa seleccionada
  (administrable en Admin → Envíos); "retiro en tienda" es gratis.
- **Reseñas**: solo puede reseñar quien compró el producto (pedido pagado/enviado/entregado).

