const API_URL = 'http://localhost:3000/api/products';

export const inventoryService = {
  async listProducts() {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error('Error al obtener productos');
    const data = await res.json();
    return data?.data || [];
  },
};
