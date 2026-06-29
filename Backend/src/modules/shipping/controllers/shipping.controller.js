import { ShippingModel } from '../models/shipping.model.js';

const validate = ({ nombre, precio }) => {
  if (!nombre || !String(nombre).trim()) return 'El nombre es obligatorio.';
  const p = Number(precio);
  if (!Number.isFinite(p) || p < 0) return 'El precio debe ser un número mayor o igual a 0.';
  return null;
};

// ── Público ───────────────────────────────────────────────────────────────
export const getActiveRates = async (req, res) => {
  try {
    const data = await ShippingModel.listActive();
    res.json({ success: true, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error al obtener tarifas de envío.' });
  }
};

// ── Admin ─────────────────────────────────────────────────────────────────
export const adminGetRates = async (req, res) => {
  try {
    const data = await ShippingModel.listAll();
    res.json({ success: true, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error al obtener tarifas.' });
  }
};

export const adminCreateRate = async (req, res) => {
  const err = validate(req.body);
  if (err) return res.status(400).json({ success: false, message: err });
  try {
    const id = await ShippingModel.create({
      nombre: String(req.body.nombre).trim(),
      precio: Number(req.body.precio),
      activo: req.body.activo ? 1 : 0,
    });
    res.json({ success: true, message: 'Tarifa creada.', id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error al crear la tarifa.' });
  }
};

export const adminUpdateRate = async (req, res) => {
  const err = validate(req.body);
  if (err) return res.status(400).json({ success: false, message: err });
  try {
    const ok = await ShippingModel.update(Number(req.params.id), {
      nombre: String(req.body.nombre).trim(),
      precio: Number(req.body.precio),
      activo: req.body.activo ? 1 : 0,
    });
    if (!ok) return res.status(404).json({ success: false, message: 'Tarifa no encontrada.' });
    res.json({ success: true, message: 'Tarifa actualizada.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error al actualizar la tarifa.' });
  }
};

export const adminDeleteRate = async (req, res) => {
  try {
    const ok = await ShippingModel.remove(Number(req.params.id));
    if (!ok) return res.status(404).json({ success: false, message: 'Tarifa no encontrada.' });
    res.json({ success: true, message: 'Tarifa eliminada.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error al eliminar la tarifa.' });
  }
};
