CREATE DATABASE DBtienda;

DROP DATABASE DBtienda;
USE DBtienda;

DROP TABLE USUARIO;
DROP TABLE USEREMPSTL;

SELECT * FROM genero;

INSERT INTO Genero VALUES(3, 'Seinen');

-- ============================
-- TABLAS DE USUARIOS --
-- ============================

-- ============================
-- Usuario principal
-- ============================
CREATE TABLE Usuario_STL (
	uuid_user CHAR(36) PRIMARY KEY DEFAULT (UUID()),
	nombre VARCHAR(100) NOT NULL,
	apellido VARCHAR(100) NOT NULL,
	email VARCHAR(150) NOT NULL UNIQUE
)ENGINE = InnoDB
DEFAULT CHARSET = utf8mb4
COLLATE = utf8mb4_unicode_ci;

-- ============================
-- Usuario cliente registrado
-- ============================
CREATE TABLE UserCustomer (
	uuid_user CHAR(36) PRIMARY KEY,
	stl_username VARCHAR(100) NOT NULL UNIQUE,
	image_perfil VARCHAR(225),
	stl_password VARCHAR(255) NOT NULL,
	telefono VARCHAR(20),
	FOREIGN KEY (uuid_user) REFERENCES Usuario_STL(uuid_user) ON DELETE CASCADE
)ENGINE = InnoDB
DEFAULT CHARSET = utf8mb4
COLLATE = utf8mb4_unicode_ci;

-- ============================
-- Usuario cliente anonimo
-- ============================
CREATE TABLE UnknownCustomer (
    uuid_user CHAR(36) PRIMARY KEY,
    fecha_ultima_compra DATE,
    FOREIGN KEY (uuid_user) REFERENCES Usuario_STL(uuid_user) ON DELETE CASCADE
)ENGINE = InnoDB
DEFAULT CHARSET = utf8mb4
COLLATE = utf8mb4_unicode_ci;

-- ====================================
-- Usuario empleado o administrador
-- ====================================
CREATE TABLE UserEmpsTL (
    uuid_user CHAR(36) PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    telefono VARCHAR(100),
    image_perfil VARCHAR(255),
    role ENUM('stl_emps','stl_administrador','stl_super_administrador') NOT NULL DEFAULT 'stl_emps',
    FOREIGN KEY (uuid_user) REFERENCES Usuario_STL(uuid_user) ON DELETE CASCADE
)ENGINE = InnoDB
DEFAULT CHARSET = utf8mb4
COLLATE = utf8mb4_unicode_ci;
-- ============================
-- TABLAS DE USUARIOS --
-- ============================

-- ============================
-- TABLA DE DIRECCION --
-- ============================
CREATE TABLE Address
(
	id_address INT AUTO_INCREMENT PRIMARY KEY,
	pais VARCHAR(100) NOT NULL,
	codigo_postal VARCHAR(15),
	ciudad VARCHAR(100) NOT NULL,
	direccion VARCHAR(150) NOT NULL,
	uuid_user CHAR(36),
	FOREIGN KEY (uuid_user) REFERENCES Usuario_STL(uuid_user) ON DELETE CASCADE
)ENGINE = InnoDB
DEFAULT CHARSET = utf8mb4
COLLATE = utf8mb4_unicode_ci;

-- ============================
-- TABLA PEDIDO - DETALLE
-- ============================
CREATE TABLE Pedido
(
	uuid_pedido VARCHAR(25) PRIMARY KEY,
	total DECIMAL(10,2) NOT NULL,
	fecha_pedido DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	estado ENUM('pendiente','pagado','enviado','entregado','cancelado') DEFAULT 'pendiente',
	uuid_user CHAR(36),
	FOREIGN KEY (uuid_user) REFERENCES Usuario_STL(uuid_user) ON DELETE SET NULL
)ENGINE = InnoDB
DEFAULT CHARSET = utf8mb4
COLLATE = utf8mb4_unicode_ci;

DELIMITER $$
CREATE TRIGGER generar_id_pedido
BEFORE INSERT ON Pedido
FOR EACH ROW
BEGIN
    DECLARE random_letter CHAR(1);
    DECLARE random_number VARCHAR(4);

    -- Genera una letra aleatoria entre A y Z
    SET random_letter = CHAR(FLOOR(RAND() * 26) + 65);

    -- Genera un número aleatorio de 4 dígitos (0000 a 9999)
    SET random_number = LPAD(FLOOR(RAND() * 10000), 4, '0');

    -- Arma el ID con formato: PED-YYYYMMDD-X1234
    SET NEW.uuid_pedido = CONCAT(
        'PED-',
        DATE_FORMAT(NOW(), '%Y%m%d'),
        '-',
        random_letter,
        random_number
    );
END$$
DELIMITER ;

CREATE TABLE DetallePedido
(
	id_detalle INT AUTO_INCREMENT PRIMARY KEY,
	cantidad INT NOT NULL,
	precio_unitario DECIMAL(10,2) NOT NULL,
	subtotal DECIMAL(10,2) AS (cantidad * precio_unitario) STORED,
	uuid_pedido VARCHAR(25) NOT NULL,
	id_producto CHAR(36) NOT NULL,
	FOREIGN KEY (uuid_pedido) REFERENCES Pedido(uuid_pedido) ON DELETE CASCADE,
	FOREIGN KEY (id_producto) REFERENCES Producto(id_producto)
)ENGINE = InnoDB
DEFAULT CHARSET = utf8mb4
COLLATE = utf8mb4_unicode_ci;


-- ===============================
-- PRODUCTO, EDITORIAL, GENERO
-- ===============================
CREATE TABLE Producto
(
	id_producto CHAR(36) PRIMARY KEY DEFAULT (UUID()),
	nombre VARCHAR(100) NOT NULL,
	descripcion TEXT,
	precio DECIMAL(10,2) NOT NULL,
	stock INT DEFAULT 0,
	imagen_url VARCHAR(225) NOT NULL,
	estado ENUM('disponible', 'inactivo') DEFAULT 'disponible'
)ENGINE = InnoDB
DEFAULT CHARSET = utf8mb4
COLLATE = utf8mb4_unicode_ci;


CREATE TABLE Editorial
(
	id_editorial  INT AUTO_INCREMENT PRIMARY KEY,
	nombre VARCHAR(100) NOT NULL UNIQUE
)ENGINE = InnoDB
DEFAULT CHARSET = utf8mb4
COLLATE = utf8mb4_unicode_ci;

CREATE TABLE Producto_Editorial 
(
	id_producto CHAR(36),
	id_editorial INT,
	PRIMARY KEY (id_producto, id_editorial),
	FOREIGN KEY (id_producto) REFERENCES Producto(id_producto) ON DELETE CASCADE,
	FOREIGN KEY (id_editorial) REFERENCES Editorial(id_editorial) ON DELETE CASCADE
)ENGINE = InnoDB
DEFAULT CHARSET = utf8mb4
COLLATE = utf8mb4_unicode_ci;

CREATE TABLE Genero 
(
	id_genero INT AUTO_INCREMENT PRIMARY KEY,
	nombre VARCHAR(100) NOT NULL UNIQUE
)ENGINE = InnoDB
DEFAULT CHARSET = utf8mb4
COLLATE = utf8mb4_unicode_ci;

CREATE TABLE ProductoGenero 
(
	id_producto CHAR(36),
	id_genero INT,
	PRIMARY KEY (id_producto, id_genero),
	FOREIGN KEY (id_producto) REFERENCES Producto(id_producto) ON DELETE CASCADE,
	FOREIGN KEY (id_genero) REFERENCES Genero(id_genero) ON DELETE CASCADE
)ENGINE = InnoDB
DEFAULT CHARSET = utf8mb4
COLLATE = utf8mb4_unicode_ci;

-- ============================
-- RESEÑAS
-- ============================
CREATE TABLE Reseña_STL (
  id_reseña INT AUTO_INCREMENT PRIMARY KEY,
  comentario VARCHAR(225),
  fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
  calificacion INT CHECK (calificacion BETWEEN 1 AND 5),
  uuid_user CHAR(36) NOT NULL,
  id_producto CHAR(36) NOT NULL,
  FOREIGN KEY (uuid_user) REFERENCES Usuario_STL(uuid_user) ON DELETE CASCADE,
  FOREIGN KEY (id_producto) REFERENCES Producto(id_producto) ON DELETE CASCADE
)ENGINE = InnoDB
DEFAULT CHARSET = utf8mb4
COLLATE = utf8mb4_unicode_ci;

-- ============================addresspedido
-- WISHLIST
-- ============================
CREATE TABLE WishList (
  id_wishlist INT AUTO_INCREMENT PRIMARY KEY,
  wishlist_nombre VARCHAR(100) NOT NULL,
  fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
  uuid_user CHAR(36) NOT NULL,
  FOREIGN KEY (uuid_user) REFERENCES UserCustomer(uuid_user) ON DELETE CASCADE
)ENGINE = InnoDB
DEFAULT CHARSET = utf8mb4
COLLATE = utf8mb4_unicode_ci;

CREATE TABLE Detalle_WishList (
  id_wishlist INT,
  id_producto CHAR(36),
  PRIMARY KEY (id_wishlist, id_producto),
  FOREIGN KEY (id_wishlist) REFERENCES WishList(id_wishlist) ON DELETE CASCADE,
  FOREIGN KEY (id_producto) REFERENCES Producto(id_producto) ON DELETE CASCADE
)ENGINE = InnoDB
DEFAULT CHARSET = utf8mb4
COLLATE = utf8mb4_unicode_ci;
