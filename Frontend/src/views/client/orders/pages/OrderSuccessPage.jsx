import React from "react";

const OrderSuccessPage = ({ result, onGoHome }) => {
  const id = result?.uuid_pedido || result?.data?.uuid_pedido;

  return (
    <div className="container py-5">
      <div className="card shadow-sm border-0 rounded-4 mx-auto" style={{ maxWidth: 540 }}>
        <div className="card-body py-5 text-center">
          <i className="bi bi-check-circle-fill text-success" style={{ fontSize: "3.5rem" }} />
          <h3 className="mt-3 mb-1">¡Pago aprobado!</h3>
          <p className="text-muted mb-3">
            Tu pedido fue <b>pagado</b> correctamente. Te enviaremos las novedades por correo.
          </p>

          <div className="mb-4">
            <span className="badge text-bg-success">Pedido pagado</span>{" "}
            <span className="badge bg-secondary">#{id ? String(id).slice(0, 8) : "—"}</span>
          </div>

          <button className="btn btn-dark" onClick={() => onGoHome?.()}>
            Volver a la tienda
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
