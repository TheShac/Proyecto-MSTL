import React, { useEffect, useState } from 'react';

const AdjustStockModal = ({ show, product, onClose, onConfirm, isSaving }) => {
  const [type, setType] = useState('');
  const [qty, setQty] = useState('');
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!show) {
      setType('');
      setQty('');
      setReason('');
      setError('');
    }
  }, [show]);

  if (!show || !product) return null;

  const stockActual = Number(product.stock ?? 0);

  const validate = () => {
    const q = Number(qty);

    if (!type) return 'Debes seleccionar el tipo de movimiento.';
    if (!qty || isNaN(q) || q <= 0) return 'La cantidad debe ser mayor a 0.';
    if (!reason.trim()) return 'El motivo es obligatorio.';

    if (type === 'salida' && q > stockActual)
      return 'La salida no puede ser mayor al stock actual.';

    return null;
  };

  const handleSubmit = () => {
    const err = validate();
    if (err) {
      setError(err);
      return;
    }

    let newStock = stockActual;

    if (type === 'entrada') newStock += Number(qty);
    if (type === 'salida') newStock -= Number(qty);
    if (type === 'ajuste') newStock = Number(qty);

    onConfirm({
      id_producto: product.id_producto,
      tipo: type,
      cantidad: Number(qty),
      motivo: reason.trim(),
    });
  };

  return (
    <div className="modal fade show d-block" style={{ background: 'rgba(0,0,0,.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">

          <div className="modal-header">
            <h5 className="modal-title">
              Ajustar Stock - {product.nombre}
            </h5>
            <button className="btn-close" onClick={onClose} />
          </div>

          <div className="modal-body">
            <div className="mb-3">
              <strong>Stock actual:</strong> {stockActual} unidades
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">
                Tipo de movimiento *
              </label>
              <select
                className="form-select"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="">Seleccionar tipo</option>
                <option value="entrada">Entrada (Agregar stock)</option>
                <option value="salida">Salida (Reducir stock)</option>
                <option value="ajuste">Ajuste (Cantidad exacta)</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">
                Cantidad *
              </label>
              <input
                type="number"
                min="1"
                className="form-control"
                placeholder="Cantidad a modificar"
                value={qty}
                onChange={(e) => setQty(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">
                Motivo *
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Ej: Reposición, Producto dañado, Inventario físico..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </div>

            {error && (
              <div className="alert alert-danger py-2">
                {error}
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button className="btn btn-outline-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button
              className="btn btn-warning"
              onClick={handleSubmit}
              disabled={isSaving}
            >
              {isSaving && (
                <span className="spinner-border spinner-border-sm me-2" />
              )}
              Confirmar Ajuste
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdjustStockModal;
