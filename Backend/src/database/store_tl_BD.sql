CREATE DATABASE store_tl;

USE store_tl;

CREATE TABLE Genero (
  id_genero INT AUTO_INCREMENT PRIMARY KEY,
  nombre_genero VARCHAR(100) NOT NULL UNIQUE
)ENGINE = InnoDB
DEFAULT CHARSET = utf8mb4
COLLATE = utf8mb4_unicode_ci;
SELECT * FROM Genero;

CREATE TABLE Editorial (
  id_editorial INT AUTO_INCREMENT PRIMARY KEY,
  nombre_editorial VARCHAR(100) NOT NULL UNIQUE
)ENGINE = InnoDB
DEFAULT CHARSET = utf8mb4
COLLATE = utf8mb4_unicode_ci;
SELECT * FROM Editorial;

INSERT INTO Role (nombre_rol) VALUES
('stl_emp'),
('stl_administrador'),
('stl_superadministrador');
CREATE TABLE Role (
  id_role INT AUTO_INCREMENT PRIMARY KEY,
  nombre_rol VARCHAR(50) NOT NULL UNIQUE
)ENGINE = InnoDB
DEFAULT CHARSET = utf8mb4
COLLATE = utf8mb4_unicode_ci;
SELECT * FROM Role;

-- TABLAS DE USUARIOS

SELECT * FROM UserCustomer;
CREATE TABLE UserCustomer (
  uuid_customer CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  stl_username VARCHAR(50) NOT NULL UNIQUE,
  stl_password VARCHAR(255) NOT NULL,
  stl_telefono VARCHAR(20),
  stl_email VARCHAR(100) NOT NULL UNIQUE,
  stl_nombre VARCHAR(100) NOT NULL,
  stl_apellido VARCHAR(100) NOT NULL,
  stl_image_profile VARCHAR(255)
)ENGINE = InnoDB
DEFAULT CHARSET = utf8mb4
COLLATE = utf8mb4_unicode_ci;

SELECT * FROM UserEmps_STL;
ALTER TABLE UserEmps_STL MODIFY emp_image_profile LONGTEXT;
CREATE TABLE UserEmps_STL (
  uuid_emps CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  emp_email VARCHAR(100) NOT NULL UNIQUE,
  emp_nombre VARCHAR(100) NOT NULL,
  emp_apellido VARCHAR(100) NOT NULL,
  emp_username VARCHAR(50) NOT NULL UNIQUE,
  emp_password VARCHAR(255) NOT NULL,
  emp_image_profile VARCHAR(255),
  emp_telefono VARCHAR(20),
  id_role INT NOT NULL,
  FOREIGN KEY (id_role) REFERENCES Role(id_role)
)ENGINE = InnoDB
DEFAULT CHARSET = utf8mb4
COLLATE = utf8mb4_unicode_ci;

CREATE TABLE Address (
  id_address INT AUTO_INCREMENT PRIMARY KEY,
  direccion VARCHAR(255) NOT NULL,
  ciudad VARCHAR(100) NOT NULL,
  pais VARCHAR(100) NOT NULL,
  codigo_postal VARCHAR(20),
  uuid_customer CHAR(36),
  uuid_emps CHAR(36),
  FOREIGN KEY (uuid_customer) REFERENCES UserCustomer(uuid_customer),
  FOREIGN KEY (uuid_emps) REFERENCES UserEmps_STL(uuid_emps)
)ENGINE = InnoDB
DEFAULT CHARSET = utf8mb4
COLLATE = utf8mb4_unicode_ci;

SELECT * FROM Producto;
ALTER TABLE producto MODIFY imagen_url LONGTEXT;
CREATE TABLE Producto (
  id_producto INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  estado VARCHAR(50) NOT NULL,
  descripcion TEXT,
  precio DECIMAL(10, 2) NOT NULL,
  imagen_url VARCHAR(255),
  stock INT NOT NULL DEFAULT 0,
  uuid_emp_create CHAR(36) NOT NULL,
  uuid_emp_modify CHAR(36),
  FOREIGN KEY (uuid_emp_create) REFERENCES UserEmps_STL(uuid_emps),
  FOREIGN KEY (uuid_emp_modify) REFERENCES UserEmps_STL(uuid_emps)
)ENGINE = InnoDB
DEFAULT CHARSET = utf8mb4
COLLATE = utf8mb4_unicode_ci;

CREATE TABLE Pedido (
  uuid_pedido VARCHAR(20) PRIMARY KEY,
  precio DECIMAL(10, 2) NOT NULL,
  fecha_pedido DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  estado ENUM('pendiente', 'pagado', 'enviado', 'entregado', 'cancelado') NOT NULL DEFAULT 'pendiente',
  nombre_pedido VARCHAR(100) NOT NULL,
  apellido_pedido VARCHAR(100) NOT NULL,
  email_pedido VARCHAR(100) NOT NULL,
  telefono_pedido VARCHAR(20),
  uuid_customer CHAR(36),
  id_address INT NOT NULL,
  FOREIGN KEY (uuid_customer) REFERENCES UserCustomer(uuid_customer),
  FOREIGN KEY (id_address) REFERENCES Address(id_address)
)ENGINE = InnoDB
DEFAULT CHARSET = utf8mb4
COLLATE = utf8mb4_unicode_ci;

CREATE TABLE WishList (
  id_wishlist INT AUTO_INCREMENT PRIMARY KEY,
  wishlist_nombre VARCHAR(100) NOT NULL,
  fecha_creacion DATE NOT NULL DEFAULT (CURRENT_DATE),
  uuid_customer CHAR(36) NOT NULL,
  FOREIGN KEY (uuid_customer) REFERENCES UserCustomer(uuid_customer)
)ENGINE = InnoDB
DEFAULT CHARSET = utf8mb4
COLLATE = utf8mb4_unicode_ci;

CREATE TABLE Detalle_WishList (
  id_wishlist INT NOT NULL,
  id_producto INT NOT NULL,
  PRIMARY KEY (id_wishlist, id_producto),
  FOREIGN KEY (id_wishlist) REFERENCES WishList(id_wishlist),
  FOREIGN KEY (id_producto) REFERENCES Producto(id_producto)
)ENGINE = InnoDB
DEFAULT CHARSET = utf8mb4
COLLATE = utf8mb4_unicode_ci;

CREATE TABLE Detalle_Pedido (
  id_detalle_pedido INT AUTO_INCREMENT PRIMARY KEY,
  precio_unitario DECIMAL(10, 2) NOT NULL,
  cantidad INT NOT NULL,
  uuid_pedido VARCHAR(20) NOT NULL,
  id_producto INT NOT NULL,
  UNIQUE KEY uk_detalle_pedido (uuid_pedido, id_producto),
  FOREIGN KEY (uuid_pedido) REFERENCES Pedido(uuid_pedido),
  FOREIGN KEY (id_producto) REFERENCES Producto(id_producto)
)ENGINE = InnoDB
DEFAULT CHARSET = utf8mb4
COLLATE = utf8mb4_unicode_ci;

CREATE TABLE Producto_Editorial (
  id_producto INT NOT NULL,
  id_editorial INT NOT NULL,
  PRIMARY KEY (id_producto, id_editorial),
  FOREIGN KEY (id_producto) REFERENCES Producto(id_producto),
  FOREIGN KEY (id_editorial) REFERENCES Editorial(id_editorial)
)ENGINE = InnoDB
DEFAULT CHARSET = utf8mb4
COLLATE = utf8mb4_unicode_ci;

CREATE TABLE Producto_Genero (
  id_producto INT NOT NULL,
  id_genero INT NOT NULL,
  PRIMARY KEY (id_producto, id_genero),
  FOREIGN KEY (id_producto) REFERENCES Producto(id_producto),
  FOREIGN KEY (id_genero) REFERENCES Genero(id_genero)
)ENGINE = InnoDB
DEFAULT CHARSET = utf8mb4
COLLATE = utf8mb4_unicode_ci;

CREATE TABLE Reseña_STL (
  id_reseña INT AUTO_INCREMENT PRIMARY KEY,
  comentario TEXT,
  fecha DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  calificacion INT NOT NULL CHECK (calificacion BETWEEN 1 AND 5),
  uuid_customer CHAR(36) NOT NULL,
  id_producto INT NOT NULL,
  UNIQUE KEY uk_reseña_cliente_producto (uuid_customer, id_producto),
  FOREIGN KEY (uuid_customer) REFERENCES UserCustomer(uuid_customer),
  FOREIGN KEY (id_producto) REFERENCES Producto(id_producto)
)ENGINE = InnoDB
DEFAULT CHARSET = utf8mb4
COLLATE = utf8mb4_unicode_ci;

DELIMITER $$
CREATE TRIGGER generar_id_pedido
BEFORE INSERT ON Pedido
FOR EACH ROW
BEGIN
    DECLARE random_digits VARCHAR(5);

    SET random_digits = LPAD(FLOOR(RAND() * 100000), 5, '0');

    SET NEW.uuid_pedido = CONCAT(
        'PE',
        DATE_FORMAT(NOW(), '%d%m%y'),
        random_digits
    );
END$$
DELIMITER ;