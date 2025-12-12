import React from 'react';

const EmployeeSearchBar = ({ title, search, onSearchChange, onCreate }) => {
  return (
    <div className="mb-3 w-100">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="fw-bold text-dark m-0">{title}</h2>

        <button className="btn btn-warning shadow-sm" onClick={onCreate}>
          <i className="bi bi-person-plus me-2"></i>Agregar Empleado
        </button>
      </div>

      <input
        type="text"
        className="form-control w-100"
        placeholder="Buscar por nombre, apellido, usuario, email o rol..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
  );
};

export default EmployeeSearchBar;
