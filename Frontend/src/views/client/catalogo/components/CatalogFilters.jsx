import React from "react";

const CatalogFilters = ({
  draftFilters,
  setDraftFilters,
  editorials,
  onApply,
  onClear,
}) => {
  return (
    <div className="card shadow-sm border-0 p-3">
      <div className="row g-3 align-items-end">

        {/* 🔍 Search */}
        <div className="col-md-3">
          <label className="form-label fw-semibold">Buscar</label>
          <input
            type="text"
            className="form-control"
            placeholder="Buscar producto..."
            value={draftFilters.search}
            onChange={(e) =>
              setDraftFilters({ ...draftFilters, search: e.target.value })
            }
          />
        </div>

        {/* 📌 Editorial */}
        <div className="col-md-3">
          <label className="form-label fw-semibold">Editorial</label>
          <select
            className="form-select"
            value={draftFilters.editorial}
            onChange={(e) =>
              setDraftFilters({ ...draftFilters, editorial: e.target.value })
            }
          >
            <option value="">Todas</option>

            {editorials.map((ed) => (
              <option key={ed.id_editorial} value={ed.nombre_editorial}>
                {ed.nombre_editorial}
              </option>
            ))}
          </select>
        </div>

        {/* 💲 Min Price */}
        <div className="col-md-2">
          <label className="form-label fw-semibold">Precio mínimo</label>
          <input
            type="number"
            className="form-control"
            placeholder="0"
            value={draftFilters.minPrice}
            onChange={(e) =>
              setDraftFilters({ ...draftFilters, minPrice: e.target.value })
            }
          />
        </div>

        {/* 💲 Max Price */}
        <div className="col-md-2">
          <label className="form-label fw-semibold">Precio máximo</label>
          <input
            type="number"
            className="form-control"
            placeholder="99999"
            value={draftFilters.maxPrice}
            onChange={(e) =>
              setDraftFilters({ ...draftFilters, maxPrice: e.target.value })
            }
          />
        </div>

        {/* 🔃 sort */}
        <div className="col-md-2">
          <label className="form-label fw-semibold">Orden</label>
          <select
            className="form-select"
            value={draftFilters.sort}
            onChange={(e) =>
              setDraftFilters({ ...draftFilters, sort: e.target.value })
            }
          >
            <option value="newest">Más nuevos</option>
            <option value="az">A - Z</option>
            <option value="za">Z - A</option>
            <option value="priceAsc">Precio ↑</option>
            <option value="priceDesc">Precio ↓</option>
          </select>
        </div>

        <div className="form-check mt-2">
          <input
            className="form-check-input"
            type="checkbox"
            id="onlyOffers"
            checked={!!draftFilters.onlyOffers}
            onChange={(e) =>
              setDraftFilters((prev) => ({ ...prev, onlyOffers: e.target.checked }))
            }
          />
          <label className="form-check-label" htmlFor="onlyOffers">
            Solo ofertas
          </label>
        </div>

        {/* ✅ botones */}
        <div className="col-md-2 d-grid">
          <button className="btn btn-dark" onClick={onApply}>
            Aplicar filtros
          </button>
        </div>

        <div className="col-md-2 d-grid">
          <button className="btn btn-outline-secondary" onClick={onClear}>
            Limpiar
          </button>
        </div>
      </div>
    </div>
  );
};

export default CatalogFilters;
