import React, { useMemo } from 'react';
import { formatCLP } from '../utils/formatters';

const LOW_STOCK_THRESHOLD = 5;

const getStockBadge = (stock) => {
  const s = Number(stock ?? 0);

  if (s === 0) return { text: 'Sin stock', cls: 'badge bg-danger' };
  if (s > 0 && s < LOW_STOCK_THRESHOLD) return { text: 'Stock bajo', cls: 'badge bg-warning text-dark' };
  return { text: 'Disponible', cls: 'badge bg-dark' };
};

const InventoryTable = ({ products, isLoading, onAdjustStock }) => {
  const rows = useMemo(() => {
    return products.map((p) => {
      const stock = Number(p.stock ?? 0);
      const price = Number(p.precio ?? 0);
      const total = stock * price;
      return { ...p, _stock: stock, _price: price, _total: total };
    });
  }, [products]);

  return (
    <div className="table-responsive inventory-table-wrap">
      <table className="table table-hover align-middle text-center inventory-table">
        <thead className="table-warning">
          <tr>
            <th className="text-start">Producto</th>
            <th>Stock Actual</th>
            <th>Precio Unitario</th>
            <th>Valor Total</th>
            <th>Estado</th>
            <th style={{ width: 180 }}>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={6} className="py-5">
                <div className="d-flex flex-column align-items-center gap-2">
                  <div className="spinner-border text-warning" role="status" />
                  <div className="text-muted">Cargando inventario...</div>
                </div>
              </td>
            </tr>
          ) : rows.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-muted py-4">
                No hay productos para mostrar.
              </td>
            </tr>
          ) : (
            rows.map((p) => {
              const badge = getStockBadge(p._stock);

              return (
                <tr key={p.id_producto}>
                  <td className="text-start">
                    <div className="d-flex align-items-center gap-2">
                      <div className="inventory-icon">
                        <i className="bi bi-box"></i>
                      </div>
                      <div className="fw-semibold">{p.nombre}</div>
                    </div>
                  </td>

                  <td>
                    <span className="badge bg-dark">
                      {p._stock} unidades
                    </span>
                  </td>

                  <td>{formatCLP(p._price)}</td>

                  <td className="fw-semibold">{formatCLP(p._total)}</td>

                  <td>
                    <span className={badge.cls}>{badge.text}</span>
                  </td>

                  <td>
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => onAdjustStock(p)}
                    >
                      Ajustar Stock
                    </button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default InventoryTable;
