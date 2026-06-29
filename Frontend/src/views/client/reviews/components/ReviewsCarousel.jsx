import React, { useEffect, useRef, useState } from "react";
import { reviewsService } from "../services/reviewsService";
import StarRating from "./StarRating";
import CarouselArrow from "../../../../components/CarouselArrow";
import "./reviews.css";

const initial = (n) => (n ? String(n).trim()[0]?.toUpperCase() : "?");

const ReviewsCarousel = () => {
  const [items, setItems] = useState([]);
  const ref = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await reviewsService.recent(12);
        setItems(res?.data || []);
      } catch (e) {
        console.error("Error cargando reseñas:", e);
      }
    })();
  }, []);

  if (!items.length) return null;

  const scrollBy = (dir) => ref.current?.scrollBy({ left: dir * 320, behavior: "smooth" });

  return (
    <section className="reviews-section">
      <div className="text-center mb-4">
        <span className="badge text-bg-secondary mb-2">RESEÑAS DE CLIENTES</span>
        <h2 className="h3 fw-bold mb-0">
          Clientes felices compartiendo su experiencia
        </h2>
      </div>

      <div className="position-relative">
        {items.length > 1 && <CarouselArrow side="left" onClick={() => scrollBy(-1)} />}

        <div ref={ref} className="reviews-track">
          {items.map((r) => (
            <div className="review-card" key={r.id}>
              <div className="d-flex align-items-center gap-2 mb-2">
                <div className="review-avatar">
                  {r.image ? <img src={r.image} alt="" /> : initial(r.nombre)}
                </div>
                <div className="flex-grow-1 min-w-0">
                  <div className="fw-bold text-truncate">{r.nombre} {r.apellido}</div>
                  <div className="text-muted small">
                    {r.fecha ? new Date(r.fecha).toLocaleDateString("es-CL") : ""}
                  </div>
                </div>
              </div>

              <StarRating value={r.calificacion} />
              <p className="review-text">{r.comentario || "Sin comentario."}</p>
              <div className="text-muted small text-truncate">
                <i className="bi bi-box-seam me-1" />
                {r.producto}
              </div>
            </div>
          ))}
        </div>

        {items.length > 1 && <CarouselArrow side="right" onClick={() => scrollBy(1)} />}
      </div>
    </section>
  );
};

export default ReviewsCarousel;
