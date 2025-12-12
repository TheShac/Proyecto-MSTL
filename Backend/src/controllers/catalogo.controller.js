import { CatalogModel } from '../models/catalogo.model.js';

export const getEditorials = async (req, res) => {
  try {
    const editorials = await CatalogModel.getAllEditorials();
    return res.json({ success: true, data: editorials });
  } catch (error) {
    console.error('Error al obtener editoriales:', error);
    return res.status(500).json({ success: false, message: 'Error interno al obtener editoriales.' });
  }
};

export const getGenres = async (req, res) => {
  try {
    const genres = await CatalogModel.getAllGenres();
    return res.json({ success: true, data: genres });
  } catch (error) {
    console.error('Error al obtener géneros:', error);
    return res.status(500).json({ success: false, message: 'Error interno al obtener géneros.' });
  }
};
