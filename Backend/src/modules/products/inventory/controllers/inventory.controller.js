import * as InventoryService from '../services/inventory.service.js';

export const getInventoryProducts = async (req, res) => {
  try {
    const data = await InventoryService.listProducts();
    res.json({ success: true, data });
  } catch (error) {
    console.error(error);
    res.status(error.status ?? 500).json({ success: false, message: error.message ?? 'Error al listar inventario.' });
  }
};

export const getInventoryMovements = async (req, res) => {
  try {
    const data = await InventoryService.listMovements();
    res.json({ success: true, data });
  } catch (error) {
    console.error(error);
    res.status(error.status ?? 500).json({ success: false, message: error.message ?? 'Error al listar movimientos.' });
  }
};

export const adjustInventoryStock = async (req, res) => {
  try {
    const result = await InventoryService.adjustStock({ ...req.body, uuid_emps: req.user.id });
    res.json({ success: true, message: 'Stock ajustado correctamente.', data: result });
  } catch (error) {
    console.error(error);
    res.status(error.status ?? 500).json({ success: false, message: error.message ?? 'Error al ajustar stock.' });
  }
};