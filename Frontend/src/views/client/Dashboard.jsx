import React from "react";
import { Link } from "react-router-dom";
import FeaturedProductsCarousel from "./home/components/FeaturedProductsCarousel";

const Dashboard = () => {
  return (
    <div className="container pt-5">
      {/* Hero */}
      <section className="text-center pt-5 pb-4">
        <h1 className="display-4 fw-bolder text-dark mb-3">Tu tienda de mangas</h1>
        <p className="lead text-muted mb-5">
          Descubre la mejor colección de mangas. Calidad garantizada y envíos a todo el país.
        </p>

        <div className="d-grid gap-3 d-sm-flex justify-content-sm-center">
          <Link to="/catalogo" className="btn btn-dark btn-lg px-4 me-sm-3 fw-bold">
            Ver Catálogo
          </Link>
          <Link to="/ofertas" className="btn btn-outline-secondary btn-lg px-4">
            Ofertas Especiales
          </Link>
        </div>
      </section>

      {/* Productos destacados */}
      <section className="py-5">
        <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-4">
          <h2 className="h4 mb-0">Productos Destacados</h2>
        </div>

        <FeaturedProductsCarousel />
      </section>
    </div>
  );
};

export default Dashboard;
