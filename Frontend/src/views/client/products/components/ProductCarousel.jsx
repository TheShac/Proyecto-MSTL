import React, { useEffect, useMemo, useRef, useState } from "react";
import ProductCard from "../../catalogo/components/ProductCard";
import "../styles/productCarousel.css";

const ProductCarousel = ({ title, products, emptyText = "No hay productos para mostrar." }) => {
  const ref = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const items = useMemo(() => products || [], [products]);

  const scrollBy = (dir) => {
    if (!ref.current) return;
    const itemWidth = 280; // ancho card + gap aprox
    ref.current.scrollBy({ left: dir * itemWidth, behavior: "smooth" });
  };

  // calcula "punto activo" (aprox) leyendo scrollLeft
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onScroll = () => {
      const itemWidth = 280;
      const idx = Math.round(el.scrollLeft / itemWidth);
      setActiveIndex(Math.max(0, Math.min(idx, items.length - 1)));
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [items.length]);

  if (!items || items.length === 0) {
    return <div className="text-muted text-center">{emptyText}</div>;
  }

  return (
    <div className="position-relative">
      {title ? <h5 className="fw-bold mb-3">{title}</h5> : null}

      {/* Flecha izq */}
      <button
        type="button"
        className="carousel-nav-btn carousel-nav-btn--left"
        onClick={() => scrollBy(-1)}
        aria-label="Anterior"
      >
        <i className="bi bi-chevron-left"></i>
      </button>

      {/* Carrusel */}
      <div ref={ref} className="product-carousel">
        {items.map((p) => (
          <div key={p.id_producto} className="product-carousel__item">
            <ProductCard product={p} />
          </div>
        ))}
      </div>

      {/* Flecha der */}
      <button
        type="button"
        className="carousel-nav-btn carousel-nav-btn--right"
        onClick={() => scrollBy(1)}
        aria-label="Siguiente"
      >
        <i className="bi bi-chevron-right"></i>
      </button>

      {/* Puntos */}
      <div className="d-flex justify-content-center gap-2 mt-3">
        {items.slice(0, 10).map((_, i) => (
          <span
            key={i}
            className={`carousel-dot ${i === activeIndex ? "active" : ""}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductCarousel;
