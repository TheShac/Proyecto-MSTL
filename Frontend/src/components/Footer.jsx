import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-dark text-light mt-auto">
      <div className="container py-5">
        <div className="row g-4">

          {/* Logo y descripción */}
          <div className="col-md-4">
            <h5 className="fw-bold mb-3">Store TL</h5>
            <p className="text-muted small">
              Tu tienda de mangas, cómics y figuras coleccionables.
              Calidad garantizada y envíos a todo el país.
            </p>
          </div>

          {/* Navegación */}
          <div className="col-md-2">
            <h6 className="fw-semibold mb-3">Navegación</h6>
            <ul className="list-unstyled small">
              <li className="mb-2">
                <Link to="/" className="text-light text-decoration-none">
                  Inicio
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/catalogo" className="text-light text-decoration-none">
                  Catálogo
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/profile" className="text-light text-decoration-none">
                  Mi perfil
                </Link>
              </li>
            </ul>
          </div>

          {/* Ayuda */}
          <div className="col-md-3">
            <h6 className="fw-semibold mb-3">Ayuda</h6>
            <ul className="list-unstyled small">
              <li className="mb-2">
                <a href="#" className="text-light text-decoration-none">
                  Preguntas frecuentes
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-light text-decoration-none">
                  Política de envíos
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-light text-decoration-none">
                  Términos y condiciones
                </a>
              </li>
            </ul>
          </div>

          {/* Redes sociales */}
          <div className="col-md-3">
            <h6 className="fw-semibold mb-3">Síguenos</h6>
            <div className="d-flex gap-3">
              <a href="#" className="text-light fs-4">
                <i className="bi bi-facebook"></i>
              </a>
              <a href="#" className="text-light fs-4">
                <i className="bi bi-instagram"></i>
              </a>
              <a href="#" className="text-light fs-4">
                <i className="bi bi-tiktok"></i>
              </a>
            </div>

            <p className="text-light small mt-3 mb-0">
              contacto@storetl.cl
            </p>
          </div>
        </div>

        {/* Línea final */}
        <hr className="border-secondary my-4" />

        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center small">
          <span className="text-light">
            © {new Date().getFullYear()} Store TL. Todos los derechos reservados.
          </span>
          <span className="text-light">
            Desarrollado por <span className="text-light fw-semibold">Leonardo</span>
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
