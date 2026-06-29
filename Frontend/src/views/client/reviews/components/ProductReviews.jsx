import React, { useEffect, useState, useCallback } from "react";
import Swal from "sweetalert2";
import { reviewsService } from "../services/reviewsService";
import { useAuth } from "../../../../stores/AuthContext";
import StarRating from "./StarRating";
import "./reviews.css";

const initial = (n) => (n ? String(n).trim()[0]?.toUpperCase() : "?");

const ProductReviews = ({ productId }) => {
  const auth = useAuth();
  const isCustomer = auth.isLoggedIn && auth.userType === "customer";

  const [summary, setSummary] = useState({ total: 0, promedio: 0 });
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const [canReview, setCanReview] = useState(false);
  const [hasMine, setHasMine] = useState(false);
  const [form, setForm] = useState({ calificacion: 0, comentario: "" });
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await reviewsService.byProduct(productId);
      setSummary(res?.data?.summary || { total: 0, promedio: 0 });
      setReviews(res?.data?.reviews || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!isCustomer) {
      setCanReview(false);
      return;
    }
    (async () => {
      try {
        const res = await reviewsService.myReview(productId);
        setCanReview(res?.data?.canReview || false);
        if (res?.data?.review) {
          setHasMine(true);
          setForm({
            calificacion: res.data.review.calificacion,
            comentario: res.data.review.comentario || "",
          });
        }
      } catch (e) {
        console.error(e);
      }
    })();
  }, [isCustomer, productId]);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.calificacion) {
      Swal.fire("Falta la calificación", "Selecciona de 1 a 5 estrellas.", "warning");
      return;
    }
    setSaving(true);
    try {
      await reviewsService.create({
        id_producto: Number(productId),
        calificacion: form.calificacion,
        comentario: form.comentario,
      });
      await load();
      setHasMine(true);
      Swal.fire("¡Gracias!", "Tu reseña fue publicada.", "success");
    } catch (err) {
      Swal.fire("Error", err.message || "No se pudo publicar la reseña.", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="mt-5" id="resenas">
      <div className="d-flex align-items-center gap-3 mb-3">
        <h3 className="fw-bold mb-0">Reseñas</h3>
        {summary.total > 0 && (
          <div className="d-flex align-items-center gap-2">
            <StarRating value={summary.promedio} />
            <span className="fw-semibold">{summary.promedio.toFixed(1)}</span>
            <span className="text-muted small">({summary.total})</span>
          </div>
        )}
      </div>

      {/* Formulario */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          {!isCustomer ? (
            <div className="text-muted mb-0">
              <i className="bi bi-info-circle me-2" />
              Inicia sesión como cliente para dejar una reseña.
            </div>
          ) : !canReview ? (
            <div className="text-muted mb-0">
              <i className="bi bi-lock me-2" />
              Solo puedes reseñar productos que hayas comprado.
            </div>
          ) : (
            <form onSubmit={submit}>
              <h6 className="fw-bold mb-2">{hasMine ? "Editar tu reseña" : "Deja tu reseña"}</h6>
              <div className="mb-2">
                <StarRating
                  value={form.calificacion}
                  onChange={(n) => setForm((f) => ({ ...f, calificacion: n }))}
                  size="1.5rem"
                />
              </div>
              <textarea
                className="form-control mb-3"
                rows={3}
                placeholder="Cuéntanos tu experiencia con este producto..."
                value={form.comentario}
                onChange={(e) => setForm((f) => ({ ...f, comentario: e.target.value }))}
              />
              <button type="submit" className="btn btn-warning fw-bold" disabled={saving}>
                {saving ? "Publicando..." : hasMine ? "Actualizar reseña" : "Publicar reseña"}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Lista */}
      {loading ? (
        <div className="text-center py-3"><div className="spinner-border" role="status" /></div>
      ) : reviews.length === 0 ? (
        <p className="text-muted">Aún no hay reseñas. ¡Sé el primero en opinar!</p>
      ) : (
        <div className="row g-3">
          {reviews.map((r) => (
            <div className="col-12 col-md-6" key={r.id}>
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <div className="review-avatar">
                      {r.image ? <img src={r.image} alt="" /> : initial(r.nombre)}
                    </div>
                    <div className="flex-grow-1">
                      <div className="fw-bold">{r.nombre} {r.apellido}</div>
                      <div className="text-muted small">
                        {r.fecha ? new Date(r.fecha).toLocaleDateString("es-CL") : ""}
                      </div>
                    </div>
                    <StarRating value={r.calificacion} />
                  </div>
                  <p className="mb-0">{r.comentario || "Sin comentario."}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default ProductReviews;
