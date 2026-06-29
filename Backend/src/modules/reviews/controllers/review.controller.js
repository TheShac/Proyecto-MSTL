import { ReviewModel } from '../models/review.model.js';

// ── Público ─────────────────────────────────────────────────────────────────

export const getRecentReviews = async (req, res) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 12, 30);
    const data = await ReviewModel.recent(limit);
    res.json({ success: true, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error al obtener reseñas.' });
  }
};

export const getProductReviews = async (req, res) => {
  const id = Number(req.params.id);
  if (!id) return res.status(400).json({ success: false, message: 'ID de producto inválido.' });

  try {
    const [summary, reviews] = await Promise.all([
      ReviewModel.summaryByProduct(id),
      ReviewModel.byProduct(id),
    ]);
    res.json({ success: true, data: { summary, reviews } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error al obtener reseñas del producto.' });
  }
};

// ── Admin ───────────────────────────────────────────────────────────────────

export const adminGetReviews = async (req, res) => {
  try {
    const data = await ReviewModel.adminList();
    res.json({ success: true, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error al obtener reseñas.' });
  }
};

export const adminDeleteReview = async (req, res) => {
  const id = Number(req.params.id);
  if (!id) return res.status(400).json({ success: false, message: 'ID inválido.' });

  try {
    const ok = await ReviewModel.remove(id);
    if (!ok) return res.status(404).json({ success: false, message: 'Reseña no encontrada.' });
    res.json({ success: true, message: 'Reseña eliminada.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error al eliminar la reseña.' });
  }
};

// ── Cliente ─────────────────────────────────────────────────────────────────

export const getMyProductReview = async (req, res) => {
  const id = Number(req.params.id);
  if (!id) return res.status(400).json({ success: false, message: 'ID de producto inválido.' });

  try {
    const review = await ReviewModel.myReview(req.user.id, id);
    const canReview = await ReviewModel.hasPurchased(req.user.id, id);
    res.json({ success: true, data: { review, canReview } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error al obtener tu reseña.' });
  }
};

export const createReview = async (req, res) => {
  const id_producto = Number(req.body.id_producto);
  const calificacion = Number(req.body.calificacion);
  const comentario = req.body.comentario;

  if (!id_producto) return res.status(400).json({ success: false, message: 'id_producto inválido.' });
  if (!Number.isInteger(calificacion) || calificacion < 1 || calificacion > 5)
    return res.status(400).json({ success: false, message: 'La calificación debe ser un entero entre 1 y 5.' });

  try {
    const purchased = await ReviewModel.hasPurchased(req.user.id, id_producto);
    if (!purchased)
      return res.status(403).json({ success: false, message: 'Solo puedes reseñar productos que hayas comprado.' });

    await ReviewModel.upsert(req.user.id, id_producto, calificacion, comentario);
    res.json({ success: true, message: 'Reseña publicada. ¡Gracias!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error al publicar la reseña.' });
  }
};
