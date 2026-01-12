import React, { useEffect, useMemo, useRef, useState } from "react";
import { getOffersPublic } from "../services/offersPublicService";
import ProductCard from "../../catalogo/components/ProductCard";

const chunk = (arr, size) => {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
};

const OffersCarousel = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const carouselIdRef = useRef(`offersCarousel-${Math.random().toString(16).slice(2)}`);
  const carouselId = carouselIdRef.current;

  useEffect(() => {
    const fetchOffers = async () => {
      setLoading(true);
      try {
        const res = await getOffersPublic();
        if (res?.success) setItems(res.data || []);
        else setItems([]);
      } catch (e) {
        console.error("Error cargando ofertas:", e);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };
    fetchOffers();
  }, []);

  const perSlide = 4;
  const slides = useMemo(() => chunk(items.slice(0, 12), perSlide), [items]);

  if (loading) {
    return (
      <div className="text-center py-4">
        <div className="spinner-border" role="status" />
        <div className="text-muted mt-2">Cargando ofertas...</div>
      </div>
    );
  }

  if (!slides.length) {
    return <div className="text-muted py-3">No hay productos en oferta por ahora.</div>;
  }

  return (
    <div className="position-relative">
      {/* Flechas afuera */}
      {slides.length > 1 && (
        <>
          <button
            type="button"
            className="btn btn-outline-dark position-absolute top-50 start-0 translate-middle-y"
            style={{ zIndex: 5 }}
            data-bs-target={`#${carouselId}`}
            data-bs-slide="prev"
          >
            <i className="bi bi-chevron-left" />
          </button>

          <button
            type="button"
            className="btn btn-outline-dark position-absolute top-50 end-0 translate-middle-y"
            style={{ zIndex: 5 }}
            data-bs-target={`#${carouselId}`}
            data-bs-slide="next"
          >
            <i className="bi bi-chevron-right" />
          </button>
        </>
      )}

      <div
        id={carouselId}
        className="carousel slide"
        data-bs-ride="carousel"
        data-bs-interval="3500"
        data-bs-touch="true"
      >
        <div className="carousel-inner">
          {slides.map((group, idx) => (
            <div key={idx} className={`carousel-item ${idx === 0 ? "active" : ""}`}>
              <div className="row g-3 px-5">
                {group.map((p) => (
                  <div key={p.id_producto} className="col-6 col-md-3">
                    <ProductCard product={p} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OffersCarousel;
