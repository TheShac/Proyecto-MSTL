import React from 'react';

const DashboardAdmin = () => {
  return (
    <div className="container-fluid py-4">
      <h1 className="display-5 fw-bold text-dark mb-1">Dashboard</h1>
      <p className="lead text-muted mb-4">
        Resumen general de tu tienda MangaStore
      </p>

      {/* Bloque de Métricas */}
      <div className="row g-4 mb-4">
        <div className="col-md-6 col-lg-3">
          <div className="card h-100 shadow-sm border-0">
            <div className="card-body d-flex flex-column justify-content-between">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="card-title text-muted text-uppercase small mb-0">
                  Total Productos
                </h5>
                <i className="bi bi-box-seam fs-4 text-warning"></i>
              </div>
              <h3 className="fw-bold mb-0">6</h3>
              <p className="card-text text-muted small mt-1">
                Productos en catálogo
              </p>
            </div>
          </div>
        </div>

        {/* Aquí podrías añadir más tarjetas de métricas como en Vue */}
        <div className="col-md-6 col-lg-3">
          <div className="card h-100 shadow-sm border-0">
            <div className="card-body d-flex flex-column justify-content-between">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="card-title text-muted text-uppercase small mb-0">
                  Stock Bajo
                </h5>
                <i className="bi bi-exclamation-triangle fs-4 text-danger"></i>
              </div>
              <h3 className="fw-bold mb-0 text-danger">1</h3>
              <p className="card-text text-muted small mt-1">
                Productos con poco stock
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bloque de Gráficos/Listados */}
      <div className="row g-4">
        <div className="col-lg-6">
          <div className="card h-100 shadow-sm border-0">
            <div className="card-body d-flex flex-column">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="card-title fw-bold mb-0">
                  Pedidos Recientes
                </h5>
                <button className="btn btn-sm btn-outline-secondary">
                  Ver Todos
                </button>
              </div>
              {/* Aquí iría la lista de pedidos recientes */}
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card h-100 shadow-sm border-0">
            <div className="card-body d-flex flex-column">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="card-title fw-bold mb-0">
                  Productos con Stock Bajo
                </h5>
                <button className="btn btn-sm btn-outline-warning">
                  Gestionar Stock
                </button>
              </div>
              {/* Aquí iría la lista de productos con stock bajo */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardAdmin;
