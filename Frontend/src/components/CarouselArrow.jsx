import React from "react";
import "./Styles/CarouselArrow.css";

/**
 * Flecha de navegación para carruseles. Reutilizable y adaptable a modo
 * claro/oscuro (usa las variables de tema de Bootstrap).
 *
 * Sirve para los dos patrones del proyecto:
 *  - Carrusel de Bootstrap:  <CarouselArrow side="left" data-bs-target="#id" data-bs-slide="prev" />
 *  - Scroll manual (onClick): <CarouselArrow side="right" onClick={...} />
 *
 * @param {"left"|"right"} side  Lado/dirección de la flecha.
 * @param {string} className     Clases extra opcionales.
 */
const CarouselArrow = ({ side = "left", className = "", ...rest }) => {
  const isLeft = side === "left";

  return (
    <button
      type="button"
      aria-label={isLeft ? "Anterior" : "Siguiente"}
      className={`carousel-arrow carousel-arrow--${side} ${className}`.trim()}
      {...rest}
    >
      <i className={`bi ${isLeft ? "bi-chevron-left" : "bi-chevron-right"}`} />
    </button>
  );
};

export default CarouselArrow;
