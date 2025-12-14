// Mock service (por ahora)
const MOCK_ORDERS = [
  {
    id: "ORD-001",
    cliente: { nombre: "Carlos Méndez", email: "carlos@example.com" },
    fecha: "2024-01-14T09:00:00Z",
    estado: "procesando",
    items: [
      {
        nombre: "Attack on Titan Vol. 1",
        precio_unitario: 9990,
        cantidad: 2,
        imagen_url:
          "https://images-na.ssl-images-amazon.com/images/I/91gWmKj5xvL.jpg",
      },
      {
        nombre: "One Piece Vol. 1",
        precio_unitario: 8990,
        cantidad: 1,
        imagen_url:
          "https://images-na.ssl-images-amazon.com/images/I/81p6Gqj7x3L.jpg",
      },
    ],
    envio: {
      direccion: "Calle Principal 123",
      ciudad: "Buenos Aires",
      pais: "Argentina",
      codigo_postal: "1001",
    },
    pago: { metodo: "Tarjeta de crédito" },
    creado: "2024-01-14T09:00:00Z",
    actualizado: "2024-01-14T09:00:00Z",
  },
  {
    id: "ORD-002",
    cliente: { nombre: "María González", email: "maria@example.com" },
    fecha: "2024-01-13T09:00:00Z",
    estado: "enviado",
    items: [
      {
        nombre: "Spider-Man #1 (2023)",
        precio_unitario: 12990,
        cantidad: 1,
        imagen_url:
          "https://images-na.ssl-images-amazon.com/images/I/81bWm7Yh0pL.jpg",
      },
    ],
    envio: {
      direccion: "Av. Siempre Viva 742",
      ciudad: "Santiago",
      pais: "Chile",
      codigo_postal: "8320000",
    },
    pago: { metodo: "Transferencia" },
    creado: "2024-01-13T09:00:00Z",
    actualizado: "2024-01-13T09:00:00Z",
  },
  {
    id: "ORD-003",
    cliente: { nombre: "Juan López", email: "juan@example.com" },
    fecha: "2024-01-09T09:00:00Z",
    estado: "entregado",
    items: [
      {
        nombre: "Figura Goku",
        precio_unitario: 49990,
        cantidad: 1,
        imagen_url:
          "https://images-na.ssl-images-amazon.com/images/I/71Y8g9BvJmL.jpg",
      },
    ],
    envio: { direccion: "Los Leones 123", ciudad: "Santiago", pais: "Chile", codigo_postal: "" },
    pago: { metodo: "Tarjeta" },
    creado: "2024-01-09T09:00:00Z",
    actualizado: "2024-01-10T09:00:00Z",
  },
  {
    id: "ORD-004",
    cliente: { nombre: "Ana Rodríguez", email: "ana@example.com" },
    fecha: "2024-01-15T09:00:00Z",
    estado: "pendiente",
    items: [
      {
        nombre: "Demon Slayer Vol. 5",
        precio_unitario: 17990,
        cantidad: 2,
        imagen_url:
          "https://images-na.ssl-images-amazon.com/images/I/81k1o0m8h-L.jpg",
      },
    ],
    envio: { direccion: "Providencia 999", ciudad: "Santiago", pais: "Chile", codigo_postal: "" },
    pago: { metodo: "Tarjeta" },
    creado: "2024-01-15T09:00:00Z",
    actualizado: "2024-01-15T09:00:00Z",
  },
  {
    id: "ORD-005",
    cliente: { nombre: "Pedro Fernández", email: "pedro@example.com" },
    fecha: "2024-01-11T09:00:00Z",
    estado: "cancelado",
    items: [
      {
        nombre: "Overlord Vol. 1",
        precio_unitario: 18990,
        cantidad: 1,
        imagen_url:
          "https://images-na.ssl-images-amazon.com/images/I/91yTQmU0pEL.jpg",
      },
    ],
    envio: { direccion: "San Martín 100", ciudad: "Valparaíso", pais: "Chile", codigo_postal: "" },
    pago: { metodo: "Tarjeta" },
    creado: "2024-01-11T09:00:00Z",
    actualizado: "2024-01-11T09:00:00Z",
  },
];

export const ordersService = {
  list: async () => {
    // simula delay
    await new Promise((r) => setTimeout(r, 250));
    return { success: true, data: MOCK_ORDERS };
  },

  // placeholder: cuando exista backend real, esto hace PUT/PATCH
  updateStatus: async ({ id, estado }) => {
    await new Promise((r) => setTimeout(r, 250));
    const idx = MOCK_ORDERS.findIndex((o) => o.id === id);
    if (idx >= 0) {
      MOCK_ORDERS[idx].estado = estado;
      MOCK_ORDERS[idx].actualizado = new Date().toISOString();
    }
    return { success: true };
  },
};
