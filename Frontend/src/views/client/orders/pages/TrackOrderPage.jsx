import React, { useState } from "react";
import { ordersCustomerService } from "../services/orders.customer.service";
import { formatPrice } from "../../utils/formatPrice";

const FLOW = ["pendiente", "pagado", "enviado", "entregado"];
const STATUS_LABEL = {
  pendiente: "Pendiente",
  pagado: "Pagado",
  enviado: "Enviado",
  entregado: "Entregado",
  cancelado: "Cancelado",
};

const TrackOrderPage = () => {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    setResult(null);
    if (!code.trim()) return;

    setLoading(true);
    try {
      const res = await ordersCustomerService.track(code.trim());
      setResult(res?.data);
    } catch (err) {
      setError(err.message || "No se encontró un pedido con ese código.");
    } finally {
      setLoading(false);
    }
  };

  const currentIndex = result ? FLOW.indexOf(result.estado) : -1;
  const cancelado = result?.estado === "cancelado";

  return (
    <div className="container py-5" style={{ maxWidth: 720 }}>
      <h2 className="fw-bold mb-1">Seguimiento de pedido</h2>
      <p className="text-muted mb-4">Ingresa el código de tu pedido para ver su estado.</p>

      <form onSubmit={submit} className="d-flex gap-2 mb-4">
        <input
          className="form-control form-control-lg"
          placeholder="Código del pedido (ej: 3f9a1c2e-...)"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <button className="btn btn-warning btn-lg fw-bold px-4" disabled={loading}>
          {loading ? "Buscando..." : "Buscar"}
        </button>
      </form>

      {error && <div className="alert alert-danger">{error}</div>}

      {result && (
        <div className="card shadow-sm border-0 rounded-4">
          <div className="card-body p-4">
            <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-4">
              <div>
                <div className="text-muted small">Pedido</div>
                <div className="fw-bold">#{String(result.uuid_pedido).slice(0, 8)}</div>
              </div>
              <div className="text-end">
                <div className="text-muted small">Total</div>
                <div className="fw-bold">{formatPrice(result.precio)}</div>
              </div>
            </div>

            {cancelado ? (
              <div className="alert alert-danger mb-0">
                <i className="bi bi-x-circle me-2" />
                Este pedido fue <b>cancelado</b>.
              </div>
            ) : (
              <div className="d-flex justify-content-between position-relative">
                {FLOW.map((s, i) => {
                  const done = i <= currentIndex;
                  return (
                    <div key={s} className="text-center flex-fill">
                      <div
                        className={`rounded-circle mx-auto mb-2 d-grid place-items-center ${done ? "text-bg-success" : "text-bg-secondary"}`}
                        style={{ width: 38, height: 38, display: "grid", placeItems: "center" }}
                      >
                        {done ? <i className="bi bi-check-lg" /> : i + 1}
                      </div>
                      <div className={`small ${done ? "fw-semibold" : "text-muted"}`}>
                        {STATUS_LABEL[s]}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="text-muted small mt-4">
              {result.items} artículo(s) · Método: {result.metodo_entrega || "—"} ·
              {" "}
              {result.fecha_pedido ? new Date(result.fecha_pedido).toLocaleDateString("es-CL") : ""}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrackOrderPage;
