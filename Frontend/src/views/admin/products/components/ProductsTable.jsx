import React from 'react';
import { formatCLP } from '../utils/formatters';

const ProductsTable = ({ products, onEdit, onDelete }) => {
  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle text-center products-table">
        <thead className="table-warning">
          <tr>
            <th className="col-nombre">Nombre</th>
            <th className="col-estado">Estado</th>
            <th className="col-desc">Descripción</th>
            <th className="col-precio">Precio</th>
            <th className="col-stock">Stock</th>
            <th className="col-edit">Editorial</th>
            <th className="col-gen">Género</th>
            <th className="col-creado">Creado por</th>
            <th className="col-mod">Modificado por</th>
            <th className="col-acc">Acciones</th>
          </tr>
        </thead>

        <tbody>
          {products.map((p) => {
            const stock = Number(p.stock) || 0;
            const isDisponible = p.estado?.toLowerCase() === 'disponible';

            return (
              <tr key={p.id_producto}>
                <td className="text-start">{p.nombre}</td>

                <td>
                  <span className={`pill ${isDisponible ? 'pill-dark' : 'pill-light'}`}>
                    {isDisponible ? 'Disponible' : 'No disponible'}
                  </span>
                </td>

                <td className="text-start">
                  <div className="products-desc" title={p.descripcion || ''}>
                    {p.descripcion || '—'}
                  </div>
                </td>

                <td>{formatCLP(p.precio)}</td>

                <td>
                  {stock === 0 ? (
                    <span className="pill pill-danger">Sin stock</span>
                  ) : stock < 5 ? (
                    <span className="pill pill-warning">{stock} unidades</span>
                  ) : (
                    <span className="pill pill-dark">{stock} unidades</span>
                  )}
                </td>

                <td>{p.editorial || 'N/A'}</td>
                <td>{p.genero || 'N/A'}</td>

                <td>{p.creado_por || 'N/A'}</td>
                <td>{p.modificado_por || 'N/A'}</td>

                <td>
                  <div className="d-flex justify-content-center gap-2 flex-wrap">
                    <button
                      type="button"
                      className="btn btn-sm btn-info"
                      onClick={() => onEdit(p)}
                    >
                      <i className="bi bi-pencil-square me-1" />
                      Editar
                    </button>

                    <button
                      type="button"
                      className="btn btn-sm btn-danger"
                      onClick={() => onDelete(p)}
                    >
                      <i className="bi bi-trash me-1" />
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}

          {products.length === 0 && (
            <tr>
              <td colSpan={10} className="text-muted py-3">
                No hay productos registrados.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProductsTable;
