import React from "react";
import { formatCLP, formatDateTime } from "../utils/formatters";

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

const OrderDetailsModal = ({ show, order, onClose }) => {
  if (!show || !order) return null;

  const total = (order.items || []).reduce(
    (acc, it) => acc + Number(it.precio_unitario || 0) * Number(it.cantidad || 0),
    0
  );

  const addr = order.envio || {};

  return (
    <div className="modal fade show d-block" style={{ background: "rgba(0,0,0,.5)" }}>
      <div className="modal-dialog modal-dialog-scrollable modal-dialog-centered" style={{ maxWidth: 520 }}>
        <div className="modal-content">
          <div className="modal-header">
            <div>
              <h5 className="modal-title mb-1">Detalles del Pedido {order.id}</h5>
              <div className="text-muted" style={{ fontSize: 12 }}>
                Información completa del pedido y opciones de gestión
              </div>
            </div>
            <button className="btn-close" onClick={onClose} />
          </div>

          <div className="modal-body">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <div className="fw-bold" style={{ fontSize: 18 }}>{order.cliente?.nombre || "—"}</div>
                <div className="text-muted">{order.cliente?.email || "—"}</div>
              </div>

              <span className={pillClass(order.estado)}>
                {estadoLabel(order.estado)}
              </span>
            </div>

            <hr />

            <div className="order-section-title">
              <i className="bi bi-box" />
              Productos
            </div>

            <div className="d-flex flex-column gap-2">
              {(order.items || []).map((it, idx) => {
                const sub = Number(it.precio_unitario || 0) * Number(it.cantidad || 0);
                return (
                  <div className="order-item d-flex gap-12 align-items-center" key={idx}>
                    <img className="order-item-img" src={it.imagen_url || ""} alt={it.nombre} />
                    <div className="flex-grow-1">
                      <div className="fw-semibold">{it.nombre}</div>
                      <div className="text-muted" style={{ fontSize: 12 }}>
                        Cantidad: {it.cantidad} × {formatCLP(it.precio_unitario)}
                      </div>
                    </div>
                    <div className="fw-bold">{formatCLP(sub)}</div>
                  </div>
                );
              })}
            </div>

            <hr />
            <div className="d-flex justify-content-between align-items-center">
              <div className="fw-bold">Total</div>
              <div className="fw-bold" style={{ fontSize: 22 }}>{formatCLP(total)}</div>
            </div>

            <hr />
            <div className="order-section-title">
              <i className="bi bi-geo-alt" />
              Dirección de Envío
            </div>

            <div className="order-item">
              <div>{addr.direccion || "—"}</div>
              <div>{addr.ciudad || "—"}</div>
              <div>{addr.codigo_postal || "—"}, {addr.pais || "—"}</div>
            </div>

            <div className="order-section-title mt-3">
              <i className="bi bi-credit-card" />
              Método de Pago
            </div>

            <div className="order-item">
              {order.pago?.metodo || "Por implementar"}
            </div>

            <div className="order-section-title mt-3">
              <i className="bi bi-calendar3" />
              Fechas
            </div>

            <div className="order-item">
              <div className="d-flex justify-content-between">
                <span className="text-muted">Creado:</span>
                <span>{formatDateTime(order.creado)}</span>
              </div>
              <div className="d-flex justify-content-between mt-1">
                <span className="text-muted">Última actualización:</span>
                <span>{formatDateTime(order.actualizado)}</span>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button className="btn btn-outline-secondary" onClick={onClose}>
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;
