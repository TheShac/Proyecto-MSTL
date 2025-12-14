import React from "react";

const OrdersFiltersBar = ({ query, onQueryChange, status, onStatusChange }) => {
  return (
    <div className="orders-filters">
      <div className="input-group">
        <span className="input-group-text bg-white">
          <i className="bi bi-search" />
        </span>
        <input
          className="form-control"
          placeholder="Buscar por ID, cliente o email..."
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
        />
      </div>

      <select className="form-select" value={status} onChange={(e) => onStatusChange(e.target.value)}>
        <option value="all">Todos los estados</option>
        <option value="pendiente">Pendiente</option>
        <option value="procesando">Procesando</option>
        <option value="enviado">Enviado</option>
        <option value="entregado">Entregado</option>
        <option value="cancelado">Cancelado</option>
      </select>
    </div>
  );
};

export default OrdersFiltersBar;
