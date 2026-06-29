import { WishlistModel } from '../models/wishlist.model.js';

export const getWishlist = async (req, res) => {
  try {
    const data = await WishlistModel.listByCustomer(req.user.id);
    res.json({ success: true, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error al obtener la wishlist.' });
  }
};

export const addToWishlist = async (req, res) => {
  const id = Number(req.body.id_producto);
  if (!id || Number.isNaN(id))
    return res.status(400).json({ success: false, message: 'id_producto inválido.' });

  try {
    await WishlistModel.add(req.user.id, id);
    res.json({ success: true, message: 'Producto agregado a favoritos.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error al agregar a favoritos.' });
  }
};

export const removeFromWishlist = async (req, res) => {
  const id = Number(req.params.id_producto);
  if (!id || Number.isNaN(id))
    return res.status(400).json({ success: false, message: 'id_producto inválido.' });

  try {
    await WishlistModel.remove(req.user.id, id);
    res.json({ success: true, message: 'Producto quitado de favoritos.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error al quitar de favoritos.' });
  }
};
