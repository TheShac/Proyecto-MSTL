import * as CatalogService from '../services/catalogo.service.js';

export const getEditorials = async (req, res) => {
  try {
    const data = await CatalogService.getEditorials();
    res.json({ success: true, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error al obtener editoriales.' });
  }
};

export const getGenres = async (req, res) => {
  try {
    const data = await CatalogService.getGenres();
    res.json({ success: true, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error al obtener géneros.' });
  }
};