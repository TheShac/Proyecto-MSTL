import React from "react";

const OrdersFiltersBar = ({ status, onStatus, query, onQuery }) => {
  return (
    <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
      <div className="d-flex align-items-center gap-2 flex-wrap">
        <select
          className="form-select form-select-sm"
          value={status}
          onChange={(e) => onStatus(e.target.value)}
          style={{ width: 220 }}
        >
          <option value="all">Todos</option>
          <option value="pendiente">Pendiente</option>
          <option value="pagado">Pagado</option>
          <option value="enviado">Enviado</option>
          <option value="entregado">Entregado</option>
          <option value="cancelado">Cancelado</option>
        </select>
      </div>

      <div style={{ minWidth: 280, flex: 1, maxWidth: 520 }}>
        <div className="input-group input-group-sm">
          <span className="input-group-text">
            <i className="bi bi-search" />
          </span>
          <input
            className="form-control"
            placeholder="Buscar por ID, nombre o email..."
            value={query}
            onChange={(e) => onQuery(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default OrdersFiltersBar;
