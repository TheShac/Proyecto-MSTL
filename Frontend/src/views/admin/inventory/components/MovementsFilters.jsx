import React from "react";

const MovementsFilters = ({
  query,
  onQuery,
  type,
  onType,
  from,
  onFrom,
  to,
  onTo,
  onClear,
}) => {
  return (
    <div className="inventory-mov-filters mb-3">
      <div className="row g-2 align-items-end">
        <div className="col-12 col-lg-5">
          <label className="form-label fw-semibold">Buscar</label>
          <input
            className="form-control"
            placeholder="Buscar por producto, motivo o usuario..."
            value={query}
            onChange={(e) => onQuery(e.target.value)}
          />
        </div>

        <div className="col-12 col-sm-6 col-lg-2">
          <label className="form-label fw-semibold">Tipo</label>
          <select
            className="form-select"
            value={type}
            onChange={(e) => onType(e.target.value)}
          >
            <option value="all">Todos</option>
            <option value="entrada">Entrada</option>
            <option value="salida">Salida</option>
            <option value="ajuste">Ajuste</option>
          </select>
        </div>

        <div className="col-12 col-sm-6 col-lg-2">
          <label className="form-label fw-semibold">Desde</label>
          <input
            type="date"
            className="form-control"
            value={from}
            onChange={(e) => onFrom(e.target.value)}
          />
        </div>

        <div className="col-12 col-sm-6 col-lg-2">
          <label className="form-label fw-semibold">Hasta</label>
          <input
            type="date"
            className="form-control"
            value={to}
            onChange={(e) => onTo(e.target.value)}
          />
        </div>

        <div className="col-12 col-sm-6 col-lg-1 d-grid">
          <button type="button" className="btn btn-outline-secondary" onClick={onClear}>
            Limpiar
          </button>
        </div>
      </div>
    </div>
  );
};

export default MovementsFilters;
