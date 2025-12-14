import React from "react";
import { formatCLP, formatDate } from "../utils/formatters";

const pillClass = (estado) => {
  const map = {
    pendiente: "pill pill-pendiente",
    procesando: "pill pill-procesando",
    enviado: "pill pill-enviado",
    entregado: "pill pill-entregado",
    cancelado: "pill pill-cancelado",
  };
  return map[estado] || "pill";
};

const estadoLabel = (estado) => {
  const map = {
    pendiente: "Pendiente",
    procesando: "Procesando",
    enviado: "Enviado",
    entregado: "Entregado",
    cancelado: "Cancelado",
  };
  return map[estado] || estado || "—";
};

const OrdersTable = ({ orders, onView, onChangeStatus, isLoading }) => {
  return (
    <div className="orders-table-wrap">
      <table className="table table-hover align-middle text-center orders-table">
        <thead className="table-warning">
          <tr>
            <th className="text-start">ID Pedido</th>
            <th className="text-start">Cliente</th>
            <th>Fecha</th>
            <th>Items</th>
            <th>Total</th>
            <th>Estado</th>
            <th>Acciones</th>
            <th style={{ width: 200 }}></th>
          </tr>
        </thead>

        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={8} className="py-5">
                <div className="d-flex flex-column align-items-center gap-2">
                  <div className="spinner-border text-warning" role="status" />
                  <div className="text-muted">Cargando pedidos...</div>
                </div>
              </td>
            </tr>
          ) : orders.length === 0 ? (
            <tr>
              <td colSpan={8} className="text-muted py-4">
                No hay pedidos para mostrar.
              </td>
            </tr>
          ) : (
            orders.map((o) => {
              const itemsCount = (o.items || []).reduce((acc, it) => acc + Number(it.cantidad || 0), 0);
              const total = (o.items || []).reduce((acc, it) => acc + Number(it.precio_unitario || 0) * Number(it.cantidad || 0), 0);

              return (
                <tr key={o.id}>
                  <td className="text-start fw-semibold">{o.id}</td>

                  <td className="text-start">
                    <div className="fw-semibold">{o.cliente?.nombre || "—"}</div>
                    <div className="text-muted" style={{ fontSize: 12 }}>
                      {o.cliente?.email || "—"}
                    </div>
                  </td>

                  <td>{formatDate(o.fecha)}</td>
                  <td>{itemsCount}</td>
                  <td className="fw-semibold">{formatCLP(total)}</td>

                  <td>
                    <span className={pillClass(o.estado)}>
                      <i className="bi bi-circle-fill" style={{ fontSize: 8 }} />
                      {estadoLabel(o.estado)}
                    </span>
                  </td>

                  <td>
                    <button className="btn btn-sm btn-outline-dark" onClick={() => onView(o)}>
                      <i className="bi bi-eye" />
                    </button>
                  </td>

                  <td>
                    <select
                      className="form-select form-select-sm"
                      value={o.estado}
                      onChange={(e) => onChangeStatus(o, e.target.value)}
                    >
                      <option value="_toggle" disabled>—</option>
                      <option value="pendiente">Pendiente</option>
                      <option value="procesando">Procesando</option>
                      <option value="enviado">Enviado</option>
                      <option value="entregado">Entregado</option>
                      <option value="cancelado">Cancelado</option>
                    </select>
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
