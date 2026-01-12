import React, { useEffect, useMemo, useRef, useState } from "react";
import { getFeaturedPublic } from "../services/featuredPublicService";
import ProductCard from "../../catalogo/components/ProductCard";

const chunk = (arr, size) => {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
};

const FeaturedProductsCarousel = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const carouselIdRef = useRef(
    `featuredCarousel-${Math.random().toString(16).slice(2)}`
  );
  const carouselId = carouselIdRef.current;

  useEffect(() => {
    const fetchFeatured = async () => {
      setLoading(true);
      try {
        const res = await getFeaturedPublic();
        if (res?.success) {
          // backend ya filtra activo, pero lo dejamos por seguridad
          const active = (res.data || []).filter(
            (x) => x.activo === 1 || x.activo === true || x.activo === undefined
          );
          setItems(active);
        } else {
          setItems([]);
        }
      } catch (e) {
        console.error("Error cargando destacados:", e);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  const MAX_FEATURED = 12;
  const perSlide = 4;

  const slides = useMemo(() => {
    const limited = items.slice(0, MAX_FEATURED);
    return chunk(limited, perSlide);
  }, [items]);

  if (loading) {
    return (
      <div className="text-center py-4">
        <div className="spinner-border" role="status" />
        <div className="text-muted mt-2">Cargando destacados...</div>
      </div>
    );
  }

  if (!slides.length) {
    return <div className="text-muted py-3">No hay productos destacados aún.</div>;
  }

  return (
    <div
      className="position-relative"
      style={{
        paddingLeft: "3.5rem",
        paddingRight: "3.5rem",
      }}
    >
      <div
        id={carouselId}
        className="carousel slide"
        data-bs-ride="carousel"
        data-bs-interval="3500"
        data-bs-touch="true"
      >
        <div className="carousel-inner">
          {slides.map((group, idx) => (
            <div
              key={idx}
              className={`carousel-item ${idx === 0 ? "active" : ""}`}
            >
              <div className="row g-3">
                {group.map((p) => (
                  <div key={p.id_producto} className="col-6 col-md-3">
                    {/* ahora la card completa es clickeable (ver ProductCard abajo) */}
                    <ProductCard product={p} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Flechas afuera + negras */}
      {slides.length > 1 && (
        <>
          <button
            className="btn btn-light border position-absolute top-50 translate-middle-y"
            type="button"
            data-bs-target={`#${carouselId}`}
            data-bs-slide="prev"
            style={{
              left: "0.5rem",
              width: "44px",
              height: "44px",
              borderRadius: "999px",
              display: "grid",
              placeItems: "center",
            }}
            aria-label="Anterior"
          >
            <i className="bi bi-chevron-left fs-4 text-dark" />
          </button>

          <button
            className="btn btn-light border position-absolute top-50 translate-middle-y"
            type="button"
            data-bs-target={`#${carouselId}`}
            data-bs-slide="next"
            style={{
              right: "0.5rem",
              width: "44px",
              height: "44px",
              borderRadius: "999px",
              display: "grid",
              placeItems: "center",
            }}
            aria-label="Siguiente"
          >
            <i className="bi bi-chevron-right fs-4 text-dark" />
          </button>
        </>
      )}
    </div>
  );
};

export default FeaturedProductsCarousel;
