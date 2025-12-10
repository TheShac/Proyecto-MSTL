import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  return (
    <div className="container pt-5">
      {/* Hero */}
      <section className="text-center pt-5 pb-4">
        <h1 className="display-4 fw-bolder text-dark mb-3">
          Tu tienda de mangas, comics y figuras
        </h1>
        <p className="lead text-muted mb-5">
          Descubre la mejor colección de mangas, comics y figuras coleccionables.
          Calidad garantizada y envíos a todo el país.
        </p>

        <div className="d-grid gap-3 d-sm-flex justify-content-sm-center">
          <Link
            to="/catalogo"
            className="btn btn-dark btn-lg px-4 me-sm-3 fw-bold"
          >
            Ver Catálogo
          </Link>
          <Link
            to="/ofertas"
            className="btn btn-outline-secondary btn-lg px-4"
          >
            Ofertas Especiales
          </Link>
        </div>
      </section>

      {/* Productos destacados */}
      <section className="py-5">
        <h2 className="h4 border-bottom pb-2 mb-4">Productos Destacados</h2>

        <div className="row row-cols-2 row-cols-md-4 g-4">
          <div className="col">
            <div className="card h-100 shadow-sm border-0 position-relative">
              <span className="badge bg-danger position-absolute top-0 start-0 m-2">
                -20%
              </span>
              <img
                src="https://picsum.photos/300/400?random=1"
                className="card-img-top"
                alt="Producto 1"
                style={{ height: '300px', objectFit: 'cover' }}
              />
              <div className="card-body">
                <h5 className="card-title text-truncate fw-semibold">
                  Manga: Ataque a los Titanes
                </h5>
                <p className="card-text text-muted small">Manga / Acción</p>
                <p className="h5 text-warning fw-bold mt-2">$12.990</p>
              </div>
            </div>
          </div>

          <div className="col">
            <div className="card h-100 shadow-sm border-0">
              <img
                src="https://picsum.photos/300/400?random=2"
                className="card-img-top"
                alt="Producto 2"
                style={{ height: '300px', objectFit: 'cover' }}
              />
              <div className="card-body">
                <h5 className="card-title text-truncate fw-semibold">
                  Comic: Spider-Man Vol. 1
                </h5>
                <p className="card-text text-muted small">Comic / Marvel</p>
                <p className="h5 text-dark fw-bold mt-2">$18.500</p>
              </div>
            </div>
          </div>

          <div className="col">
            <div className="card h-100 shadow-sm border-0">
              <img
                src="https://picsum.photos/300/400?random=3"
                className="card-img-top"
                alt="Producto 3"
                style={{ height: '300px', objectFit: 'cover' }}
              />
              <div className="card-body">
                <h5 className="card-title text-truncate fw-semibold">
                  Figura: Goku Super Saiyan
                </h5>
                <p className="card-text text-muted small">
                  Figura / Dragon Ball
                </p>
                <p className="h5 text-dark fw-bold mt-2">$45.000</p>
              </div>
            </div>
          </div>

          <div className="col">
            <div className="card h-100 shadow-sm border-0">
              <img
                src="https://picsum.photos/300/400?random=4"
                className="card-img-top"
                alt="Producto 4"
                style={{ height: '300px', objectFit: 'cover' }}
              />
              <div className="card-body">
                <h5 className="card-title text-truncate fw-semibold">
                  Manga: Demon Slayer Vol. 1
                </h5>
                <p className="card-text text-muted small">Manga / Shonen</p>
                <p className="h5 text-dark fw-bold mt-2">$12.990</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
