import React from "react";
import { formatCLP } from "../utils/formatters";

const statusPill = (estado) => {
  const map = {
    pendiente: "pill pill-warning",
    pagado: "pill pill-dark",
    enviado: "pill pill-info",
    entregado: "pill pill-success",
    cancelado: "pill pill-danger",
    carrito: "pill pill-light",
  };
  return map[estado] || "pill pill-light";
};

const OrdersTable = ({ orders, isLoading, onView, onChangeStatus }) => {
  return (
    <div className="table-responsive orders-table-wrap">
      <table className="table table-hover align-middle text-center orders-table">
        <thead className="table-warning">
          <tr>
            <th>ID</th>
            <th>Fecha</th>
            <th className="text-start">Cliente</th>
            <th className="text-start">Email</th>
            <th>Método</th>
            <th>Items</th>
            <th>Total</th>
            <th>Estado</th>
            <th style={{ width: 220 }}>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={9} className="py-5">
                <div className="d-flex flex-column align-items-center gap-2">
                  <div className="spinner-border text-warning" role="status" />
                  <div className="text-muted">Cargando pedidos...</div>
                </div>
              </td>
            </tr>
          ) : orders.length === 0 ? (
            <tr>
              <td colSpan={9} className="text-muted py-4">
                No hay pedidos para mostrar.
              </td>
            </tr>
          ) : (
            orders.map((o) => {
              const cliente = `${o.nombre_pedido || ""} ${o.apellido_pedido || ""}`.trim() || "—";
              const fecha = o.fecha_pedido ? new Date(o.fecha_pedido).toLocaleString() : "—";

              return (
                <tr key={o.uuid_pedido}>
                  <td className="fw-semibold">{o.uuid_pedido}</td>
                  <td>{fecha}</td>
                  <td className="text-start">{cliente}</td>
                  <td className="text-start">{o.email_pedido || "—"}</td>
                  <td>{o.metodo_entrega ? (o.metodo_entrega === "envio" ? "Envío" : "Retiro") : "—"}</td>
                  <td>{o.items_count ?? 0}</td>
                  <td className="fw-semibold">{formatCLP(o.precio ?? 0)}</td>

                  <td>
                    <span className={statusPill(o.estado)}>{o.estado}</span>
                  </td>

                  <td>
                    <div className="d-flex justify-content-center gap-2 flex-wrap">
                      <button className="btn btn-sm btn-outline-dark" onClick={() => onView(o)}>
                        Observar
                      </button>

                      <select
                        className="form-select form-select-sm"
                        style={{ width: 140 }}
                        value={o.estado}
                        onChange={(e) => onChangeStatus(o, e.target.value)}
                        disabled={o.estado === "carrito"}
                        title={o.estado === "carrito" ? "Carrito aún no confirmado" : ""}
                      >
                        <option value="pendiente">Pendiente</option>
                        <option value="pagado">Pagado</option>
                        <option value="enviado">Enviado</option>
                        <option value="entregado">Entregado</option>
                        <option value="cancelado">Cancelado</option>
                      </select>
                    </div>
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

export default OrdersTable;
