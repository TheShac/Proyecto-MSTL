import { AddressModel } from '../models/address.model.js';

// Dirección del cliente autenticado (misma tabla Address que empleados).

export const getMyAddress = async (req, res) => {
  try {
    const address = await AddressModel.findByCustomerUuid(req.user.id);
    res.json({ success: true, data: address });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error al obtener la dirección.' });
  }
};

export const upsertMyAddress = async (req, res) => {
  const { direccion, ciudad, pais, codigo_postal } = req.body;

  if (!direccion || !ciudad || !pais)
    return res.status(400).json({ success: false, message: 'direccion, ciudad y pais son obligatorios.' });

  try {
    const data = await AddressModel.upsertForCustomer(req.user.id, {
      direccion: String(direccion).trim(),
      ciudad: String(ciudad).trim(),
      pais: String(pais).trim(),
      codigo_postal: codigo_postal ? String(codigo_postal).trim() : null,
    });
    res.json({ success: true, message: 'Dirección guardada.', data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error al guardar la dirección.' });
  }
};
