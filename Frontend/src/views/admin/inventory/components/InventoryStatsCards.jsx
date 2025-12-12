import React from 'react';
import { formatCLP } from '../utils/formatters';

const InventoryStatsCards = ({ stats }) => {
  return (
    <div className="row g-3 mb-3">
      <div className="col-12 col-md-6 col-lg-3">
        <div className="card shadow-sm border-0 rounded-4 h-100">
          <div className="card-body d-flex justify-content-between">
            <div>
              <div className="fw-semibold">Total Productos</div>
              <div className="display-6 fw-bold">{stats.totalProducts}</div>
              <div className="text-muted small">En catálogo</div>
            </div>
            <div className="text-muted">
              <i className="bi bi-box-seam fs-4"></i>
            </div>
          </div>
        </div>
      </div>

      <div className="col-12 col-md-6 col-lg-3">
        <div className="card shadow-sm border-0 rounded-4 h-100">
          <div className="card-body d-flex justify-content-between">
            <div>
              <div className="fw-semibold">Stock Bajo</div>
              <div className="display-6 fw-bold text-danger">{stats.lowStockCount}</div>
              <div className="text-muted small">Menos de 5 unidades</div>
            </div>
            <div className="text-danger">
              <i className="bi bi-graph-down-arrow fs-4"></i>
            </div>
          </div>
        </div>
      </div>

      <div className="col-12 col-md-6 col-lg-3">
        <div className="card shadow-sm border-0 rounded-4 h-100">
          <div className="card-body d-flex justify-content-between">
            <div>
              <div className="fw-semibold">Sin Stock</div>
              <div className="display-6 fw-bold text-danger">{stats.outOfStockCount}</div>
              <div className="text-muted small">Productos agotados</div>
            </div>
            <div className="text-danger">
              <i className="bi bi-exclamation-triangle fs-4"></i>
            </div>
          </div>
        </div>
      </div>

      <div className="col-12 col-md-6 col-lg-3">
        <div className="card shadow-sm border-0 rounded-4 h-100">
          <div className="card-body d-flex justify-content-between">
            <div>
              <div className="fw-semibold">Valor Total</div>
              <div className="h3 fw-bold">{formatCLP(stats.totalValue)}</div>
              <div className="text-muted small">Valor del inventario</div>
            </div>
            <div className="text-muted">
              <i className="bi bi-graph-up-arrow fs-4"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryStatsCards;
