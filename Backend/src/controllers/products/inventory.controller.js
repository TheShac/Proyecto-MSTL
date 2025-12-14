import { InventoryModel } from '../../models/products/inventory.model.js';

const ALLOWED_TYPES = ['entrada', 'salida', 'ajuste'];

export const getInventoryProducts = async (req, res) => {
  try {
    if (!req.user || req.user.userType !== 'employee') {
      return res.status(403).json({ message: 'Solo empleados pueden ver el inventario.' });
    }
    const rows = await InventoryModel.listProducts();
    return res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error listando inventario:', error);
    return res.status(500).json({ success: false, message: 'Error interno al listar inventario.' });
  }
};

export const getInventoryMovements = async (req, res) => {
  try {
    if (!req.user || req.user.userType !== 'employee') {
      return res.status(403).json({ message: 'Solo empleados pueden ver movimientos.' });
    }
    const rows = await InventoryModel.listMovements();
    return res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error listando movimientos:', error);
    return res.status(500).json({ success: false, message: 'Error interno al listar movimientos.' });
  }
};

export const adjustInventoryStock = async (req, res) => {
  try {
    if (!req.user || req.user.userType !== 'employee') {
      return res.status(403).json({ message: 'Solo empleados pueden ajustar stock.' });
    }

    const { id_producto, tipo, cantidad, motivo } = req.body;

    const id = Number(id_producto);
    if (!id || Number.isNaN(id)) return res.status(400).json({ message: 'id_producto inválido.' });

    if (!ALLOWED_TYPES.includes(tipo)) {
      return res.status(400).json({ message: 'Tipo inválido. Use: entrada, salida o ajuste.' });
    }

    const qty = Number(cantidad);
    if (!Number.isFinite(qty) || !Number.isInteger(qty) || qty < 0) {
      return res.status(400).json({ message: 'Cantidad inválida. Debe ser un entero >= 0.' });
    }
    if ((tipo === 'entrada' || tipo === 'salida') && qty === 0) {
      return res.status(400).json({ message: 'La cantidad debe ser mayor a 0 para entrada/salida.' });
    }

    const result = await InventoryModel.adjustStock({
      id_producto: id,
      uuid_emps: req.user.id,
      tipo,
      cantidad: qty,
      motivo: (motivo || '').trim(),
    });

    return res.json({ success: true, message: 'Stock ajustado correctamente.', data: result });
  } catch (error) {
    console.error('Error ajustando stock:', error);
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Error interno al ajustar stock.',
    });
  }
};
