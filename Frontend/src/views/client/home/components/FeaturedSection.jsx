import React from "react";
import { Link } from "react-router-dom";
import FeaturedProductsCarousel from "./FeaturedProductsCarousel";

const FeaturedSection = () => {
  return (
    <section className="py-5">
      <div className="d-flex justify-content-between align-items-end mb-3">
        <div>
          <h2 className="h4 fw-bold m-0">Productos Destacados</h2>
          <div className="text-muted small">
            Seleccionados por el administrador.
          </div>
        </div>

        <Link to="/catalogo" className="btn btn-outline-dark btn-sm">
          Ver catálogo <i className="bi bi-arrow-right ms-1" />
        </Link>
      </div>

      <FeaturedProductsCarousel />
    </section>
  );
};

export default FeaturedSection;
