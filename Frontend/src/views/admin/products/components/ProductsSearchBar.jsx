import React from "react";

const ProductSearchBar = ({ title, search, onSearchChange, onCreate, onOpenFeatured }) => {
  return (
    <div className="mb-3">
      <div className="d-flex justify-content-between align-items-start mb-3">
        <h2 className="fw-bold text-dark m-0">{title}</h2>

        <div className="d-flex flex-column gap-2" style={{ minWidth: 240 }}>
          <button className="btn btn-warning shadow-sm" onClick={onCreate}>
            <i className="bi bi-plus-lg me-2"></i>
            Agregar Producto
          </button>

          <button className="btn btn-dark shadow-sm" onClick={onOpenFeatured}>
            <i className="bi bi-star-fill me-2 text-warning"></i>
            Gestionar Destacados
          </button>
        </div>
      </div>

      <div className="products-search-row">
        <input
          type="text"
          className="form-control products-search-input"
          placeholder="Buscar por nombre, editorial o género..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
    </div>
  );
};

export default ProductSearchBar;
