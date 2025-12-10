import React from 'react';
import './Styles/Sidebar.css';

const SidebarMenu = ({ open, onClose }) => {
  if (!open) return null;

  return (
    <div
      className="fixed-top vw-100 vh-100 d-flex"
      style={{ zIndex: 1050 }}
    >
      {/* Overlay oscuro */}
      <div
        className="w-100 h-100 bg-dark bg-opacity-50"
        onClick={onClose}
      ></div>

      {/* Panel lateral */}
      <aside
        className="ms-auto bg-white h-100 shadow-lg p-4 overflow-auto sidebar-panel"
        style={{ width: '300px', maxWidth: '85%' }}
      >
        <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2">
          <h2 className="h4 fw-bolder mb-0">Don Mangas</h2>
          <button
            onClick={onClose}
            className="btn btn-sm btn-outline-secondary border-0 p-1"
          >
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        <ul className="list-group list-group-flush mb-4">
          <li className="list-group-item border-0 px-0 py-2 fw-semibold text-dark hover-effect">
            En Stock
          </li>
          <li className="list-group-item border-0 px-0 py-2 fw-semibold text-dark hover-effect">
            Tomos a pedido
          </li>
          <li className="list-group-item border-0 px-0 py-2 fw-semibold text-dark hover-effect">
            Todos los Productos
          </li>
          <li className="list-group-item border-0 px-0 py-2 fw-semibold text-dark hover-effect">
            Tomo único
          </li>

          <li className="list-group-item border-0 px-0 py-2 fw-semibold text-dark d-flex justify-content-between align-items-center hover-effect">
            Editorial <i className="bi bi-chevron-down small"></i>
          </li>
          <li className="list-group-item border-0 px-0 py-2 fw-semibold text-dark d-flex justify-content-between align-items-center hover-effect">
            Figuras <i className="bi bi-chevron-down small"></i>
          </li>

          <li className="list-group-item border-0 px-0 py-2 fw-semibold text-dark hover-effect">
            Bolsas
          </li>
        </ul>

        <div className="mb-4">
          <h6 className="text-secondary fw-bolder border-top pt-3 mb-3">
            SÍGUENOS
          </h6>
          <div className="d-flex gap-3 fs-5">
            <a href="#" className="text-dark">
              <i className="bi bi-instagram"></i>
            </a>
            <a href="#" className="text-dark">
              <i className="bi bi-facebook"></i>
            </a>
            <a href="#" className="text-dark">
              <i className="bi bi-youtube"></i>
            </a>
            <a href="#" className="text-dark">
              <i className="bi bi-tiktok"></i>
            </a>
          </div>
        </div>

        <div className="mb-4">
          <h6 className="text-secondary fw-bolder border-top pt-3 mb-2">
            SERVICIO AL CLIENTE
          </h6>
          <p className="mb-1 fw-semibold text-dark hover-effect">
            Todos los Productos
          </p>
        </div>

        <div className="border-top pt-3">
          <h6 className="text-secondary fw-bolder mb-3">CONTÁCTANOS</h6>

          <div className="d-flex align-items-start mb-2">
            <i className="bi bi-envelope-fill text-dark me-2 mt-1"></i>
            <span className="small text-dark">administracion@test.cl</span>
          </div>

          <div className="d-flex align-items-start mb-2">
            <i className="bi bi-whatsapp text-dark me-2 mt-1"></i>
            <span className="small text-dark">56912345678</span>
          </div>

          <div className="d-flex align-items-start mb-2">
            <i className="bi bi-geo-alt-fill text-dark me-2 mt-1"></i>
            <span className="small text-dark">
              Tienda Online. Entregas al espacio
            </span>
          </div>

          <div className="d-flex align-items-start">
            <i className="bi bi-clock-fill text-dark me-2 mt-1"></i>
            <span className="small text-dark">
              Tienda Online. Atención de Lunes a Sábados.
              <br />
              Domingos y festivos Cerrado.
            </span>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default SidebarMenu;
