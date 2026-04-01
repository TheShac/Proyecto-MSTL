import { InventoryModel } from '../models/invetory.model.js';

const ALLOWED_TYPES = ['entrada', 'salida', 'ajuste'];

export const listProducts  = async () => InventoryModel.listProducts();
export const listMovements = async () => InventoryModel.listMovements();

export const adjustStock = async ({ id_producto, uuid_emps, tipo, cantidad, motivo }) => {
  const id  = Number(id_producto);
  if (!id || Number.isNaN(id))
    throw { status: 400, message: 'id_producto inválido.' };

  if (!ALLOWED_TYPES.includes(tipo))
    throw { status: 400, message: 'Tipo inválido. Use: entrada, salida o ajuste.' };

  const qty = Number(cantidad);
  if (!Number.isFinite(qty) || !Number.isInteger(qty) || qty < 0)
    throw { status: 400, message: 'Cantidad inválida. Debe ser un entero >= 0.' };

  if ((tipo === 'entrada' || tipo === 'salida') && qty === 0)
    throw { status: 400, message: 'La cantidad debe ser mayor a 0 para entrada/salida.' };

  return InventoryModel.adjustStock({ id_producto: id, uuid_emps, tipo, cantidad: qty, motivo: (motivo || '').trim() });
};