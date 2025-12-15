import React, { useMemo } from "react";
import { formatCLP } from "../utils/formatters";

const OrderDetailsModal = ({ show, loading, data, onClose }) => {
  const order = data?.order || null;
  const items = Array.isArray(data?.items) ? data.items : [];
  const address = data?.address || null;

  const computed = useMemo(() => {
    const subtotal = items.reduce((acc, it) => {
      const qty = Number(it.cantidad ?? 0);
      const pu = Number(it.precio_unitario ?? 0);
      return acc + qty * pu;
    }, 0);

    const shipping = Number(order?.costo_envio ?? 0);
    const total = Number(order?.precio ?? subtotal + shipping);

    return { subtotal, shipping, total };
  }, [items, order]);

  if (!show) return null;

  return (
    <div className="modal fade show d-block" style={{ background: "rgba(0,0,0,.5)" }}>
      <div className="modal-dialog modal-xl modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <div>
              <h5 className="modal-title mb-0">Detalle del Pedido</h5>
              <div className="text-muted small">{order?.uuid_pedido || "—"}</div>
            </div>
            <button className="btn-close" onClick={onClose} disabled={loading} />
          </div>

          <div className="modal-body">
            {loading ? (
              <div className="py-5 text-center">
                <div className="spinner-border text-warning" role="status" />
                <div className="text-muted mt-2">Cargando detalle...</div>
              </div>
            ) : !order ? (
              <div className="text-muted">Sin datos.</div>
            ) : (
              <div className="row g-4">
                <div className="col-12 col-lg-5">
                  <div className="card border-0 shadow-sm rounded-4">
                    <div className="card-body">
                      <h6 className="mb-3">Información del pedido</h6>

                      <div className="mb-2">
                        <span className="text-muted">Estado: </span>
                        <b>{order.estado}</b>
                      </div>

                      <div className="mb-2">
                        <span className="text-muted">Fecha: </span>
                        <b>{order.fecha_pedido ? new Date(order.fecha_pedido).toLocaleString() : "—"}</b>
                      </div>

                      <hr />

                      <h6 className="mb-2">Cliente</h6>
                      <div className="mb-1">
                        <span className="text-muted">Nombre: </span>
                        <b>{`${order.nombre_pedido || ""} ${order.apellido_pedido || ""}`.trim() || "—"}</b>
                      </div>
                      <div className="mb-1">
                        <span className="text-muted">Email: </span>
                        <b>{order.email_pedido || "—"}</b>
                      </div>
                      <div className="mb-1">
                        <span className="text-muted">Teléfono: </span>
                        <b>{order.telefono_pedido || "—"}</b>
                      </div>

                      <hr />

                      <h6 className="mb-2">Entrega</h6>
                      <div className="mb-2">
                        <span className="text-muted">Método: </span>
                        <b>
                          {order.metodo_entrega
                            ? order.metodo_entrega === "envio"
                              ? "Envío"
                              : "Retiro en tienda"
                            : "—"}
                        </b>
                      </div>

                      {order.metodo_entrega === "envio" ? (
                        <div className="text-muted small">
                          {address ? (
                            <>
                              <div><b>Dirección:</b> {address.direccion}</div>
                              <div><b>Ciudad:</b> {address.ciudad}</div>
                              <div><b>País:</b> {address.pais}</div>
                              <div><b>Código postal:</b> {address.codigo_postal || "—"}</div>
                            </>
                          ) : (
                            <div>Dirección no registrada.</div>
                          )}
                        </div>
                      ) : (
                        <div className="text-muted small">Retiro en tienda (sin dirección).</div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="col-12 col-lg-7">
                  <div className="card border-0 shadow-sm rounded-4">
                    <div className="card-body">
                      <h6 className="mb-3">Productos</h6>

                      <div className="table-responsive">
                        <table className="table table-sm align-middle">
                          <thead>
                            <tr className="text-muted">
                              <th className="text-start">Producto</th>
                              <th>Cant.</th>
                              <th>Precio</th>
                              <th>Total</th>
                            </tr>
                          </thead>
                          <tbody>
                            {items.length === 0 ? (
                              <tr>
                                <td colSpan={4} className="text-muted py-3 text-center">
                                  Sin productos.
                                </td>
                              </tr>
                            ) : (
                              items.map((it) => {
                                const qty = Number(it.cantidad ?? 0);
                                const pu = Number(it.precio_unitario ?? 0);
                                const total = qty * pu;

                                return (
                                  <tr key={it.id_detalle_pedido}>
                                    <td className="text-start">
                                      <div className="d-flex align-items-center gap-2">
                                        {it.imagen_url ? (
                                          <img
                                            src={it.imagen_url}
                                            alt="img"
                                            style={{ width: 44, height: 44, objectFit: "cover", borderRadius: 8 }}
                                          />
                                        ) : (
                                          <div style={{ width: 44, height: 44, borderRadius: 8, background: "#eee" }} />
                                        )}
                                        <div className="fw-semibold">{it.nombre || "—"}</div>
                                      </div>
                                    </td>
                                    <td>{qty}</td>
                                    <td>{formatCLP(pu)}</td>
                                    <td className="fw-semibold">{formatCLP(total)}</td>
                                  </tr>
                                );
                              })
                            )}
                          </tbody>
                        </table>
                      </div>

                      <hr />

                      <div className="d-flex justify-content-end">
                        <div style={{ width: 280 }}>
                          <div className="d-flex justify-content-between py-1">
                            <span className="text-muted">Subtotal</span>
                            <span className="fw-semibold">{formatCLP(computed.subtotal)}</span>
                          </div>
                          <div className="d-flex justify-content-between py-1">
                            <span className="text-muted">Envío</span>
                            <span className="fw-semibold">{formatCLP(computed.shipping)}</span>
                          </div>
                          <div className="d-flex justify-content-between py-2 border-top mt-2">
                            <span className="fw-bold">Total</span>
                            <span className="fw-bold">{formatCLP(computed.total)}</span>
                          </div>

                          <div className="text-muted small mt-2">
                            Usuario que procesó: <b>(por implementar)</b>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button className="btn btn-outline-secondary" onClick={onClose} disabled={loading}>
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;
