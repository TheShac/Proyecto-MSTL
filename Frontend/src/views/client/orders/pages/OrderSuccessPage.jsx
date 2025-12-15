import React from "react";

const OrderSuccessPage = ({ result, onGoHome }) => {
  const id = result?.uuid_pedido || result?.data?.uuid_pedido;

  return (
    <div className="p-4">
      <div className="card shadow-sm border-0 rounded-4">
        <div className="card-body py-5 text-center">
          <i className="bi bi-check-circle-fill text-success fs-1" />
          <h3 className="mt-3 mb-1">Pedido confirmado</h3>
          <p className="text-muted mb-3">
            Tu pedido quedó en estado <b>pendiente</b>.
          </p>

          <div className="mb-4">
            <span className="badge bg-dark">Pedido: {id || "—"}</span>
          </div>

          <button className="btn btn-dark" onClick={() => onGoHome?.()}>
            Volver
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
