import React, { useMemo } from 'react';

const LOW_STOCK_THRESHOLD = 5;

const InventoryAlerts = ({ products, onReStock }) => {
  const { lowStock, noStock } = useMemo(() => {
    const low = [];
    const none = [];

    products.forEach((p) => {
      const stock = Number(p.stock ?? 0);
      if (stock === 0) none.push(p);
      else if (stock < LOW_STOCK_THRESHOLD) low.push(p);
    });

    return { lowStock: low, noStock: none };
  }, [products]);

  const renderItem = (p, variant) => (
    <div key={p.id_producto} className="alert-item">
      <div>
        <div className="fw-semibold">{p.nombre}</div>
        {p.genero && (
          <span className="badge bg-light text-dark text-capitalize">
            {p.genero}
          </span>
        )}
      </div>

      <div className="d-flex align-items-center gap-3">
        <span className={`badge ${variant}`}>
          {p.stock} unidades
        </span>
        <button
          className="btn btn-sm btn-outline-warning"
          onClick={() => onReStock(p)}
        >
          Reabastecer
        </button>
      </div>
    </div>
  );

  return (
    <div className="row g-4">
      {/* Stock Bajo */}
      <div className="col-lg-6">
        <div className="card shadow-sm border-0 rounded-4">
          <div className="card-body">
            <h5 className="mb-3 d-flex align-items-center gap-2 inventory-alert-title">
                <i className="bi bi-exclamation-triangle-fill text-danger"></i>
                Stock Bajo ({lowStock.length})
            </h5>

            {lowStock.length === 0 ? (
              <div className="text-muted">No hay productos con stock bajo.</div>
            ) : (
              <div className="d-flex flex-column gap-3">
                {lowStock.map((p) => renderItem(p, 'bg-danger'))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sin Stock */}
      <div className="col-lg-6">
        <div className="card shadow-sm border-0 rounded-4">
          <div className="card-body">
            <h5 className="mb-3 d-flex align-items-center gap-2 inventory-alert-title">
                <i className="bi bi-box-seam-fill text-danger"></i>
                Sin Stock ({noStock.length})
            </h5>


            {noStock.length === 0 ? (
              <div className="text-muted">No hay productos sin stock.</div>
            ) : (
              <div className="d-flex flex-column gap-3">
                {noStock.map((p) => renderItem(p, 'bg-danger'))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryAlerts;
