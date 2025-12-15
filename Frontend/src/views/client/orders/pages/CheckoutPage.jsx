import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { ordersCustomerService } from "../services/orders.customer.service";

const CheckoutPage = ({ onSuccess }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);

  const [metodo, setMetodo] = useState("retiro"); // retiro | envio

  const [info, setInfo] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
  });

  const [addr, setAddr] = useState({
    direccion: "",
    ciudad: "",
    pais: "",
    codigo_postal: "",
  });

  const load = async () => {
    setIsLoading(true);
    try {
      const res = await ordersCustomerService.getCart();
      const data = res?.data;
      if (!data || !data.order) {
        setOrder(null);
        setItems([]);
      } else {
        setOrder(data.order);
        setItems(data.items || []);

        // si ya venía info en Pedido, precargar
        setInfo({
          nombre: data.order.nombre_pedido || "",
          apellido: data.order.apellido_pedido || "",
          email: data.order.email_pedido || "",
          telefono: data.order.telefono_pedido || "",
        });
      }
    } catch (e) {
      console.error(e);
      Swal.fire("Error", "No se pudo cargar el checkout.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const validate = () => {
    if (!info.nombre.trim() || !info.apellido.trim() || !info.email.trim()) {
      return "Completa nombre, apellido y email.";
    }
    if (metodo === "envio") {
      if (!addr.direccion.trim() || !addr.ciudad.trim() || !addr.pais.trim()) {
        return "Para envío, completa dirección, ciudad y país.";
      }
    }
    if (!items.length) return "No hay productos en el carrito.";
    return null;
  };

  const submit = async () => {
    const err = validate();
    if (err) {
      Swal.fire("Error", err, "error");
      return;
    }

    try {
      // 1) guardar customer info
      await ordersCustomerService.saveCustomerInfo(info);

      // 2) si envio, guardar address
      if (metodo === "envio") {
        await ordersCustomerService.saveAddress(addr);
      }

      // 3) checkout real
      const res = await ordersCustomerService.checkout({ metodo_entra: metodo });

      Swal.fire("Éxito", "Pedido confirmado.", "success");

      onSuccess?.(res?.data); // data: { uuid_pedido, subtotal, total ... }
    } catch (e) {
      console.error(e);
      const msg = e?.response?.data?.message || "No se pudo confirmar el pedido.";
      Swal.fire("Error", msg, "error");
    }
  };

  if (isLoading) {
    return (
      <div className="p-4">
        <div className="card shadow-sm border-0 rounded-4">
          <div className="card-body py-5 text-center">
            <div className="spinner-border text-warning" role="status" />
            <div className="text-muted mt-2">Cargando checkout...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-4">
        <div className="card shadow-sm border-0 rounded-4">
          <div className="card-body py-5 text-center">
            <h5 className="mb-2">No hay un carrito activo</h5>
            <p className="text-muted mb-0">Vuelve al catálogo y agrega productos.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="mb-3">
        <h2 className="mb-0">Pago</h2>
        <p className="text-muted mb-0">Pedido: <b>{order.uuid_pedido}</b></p>
      </div>

      <div className="row g-4">
        <div className="col-12 col-lg-7">
          <div className="card shadow-sm border-0 rounded-4">
            <div className="card-body">
              <h5 className="mb-3">Método</h5>

              <div className="d-flex gap-2 flex-wrap mb-3">
                <button
                  className={`btn ${metodo === "retiro" ? "btn-warning" : "btn-outline-secondary"}`}
                  onClick={() => setMetodo("retiro")}
                  type="button"
                >
                  Retiro en tienda
                </button>
                <button
                  className={`btn ${metodo === "envio" ? "btn-warning" : "btn-outline-secondary"}`}
                  onClick={() => setMetodo("envio")}
                  type="button"
                >
                  Envío
                </button>
              </div>

              <hr />

              <h5 className="mb-3">Datos del pedido</h5>

              <div className="row g-3">
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold">Nombre *</label>
                  <input
                    className="form-control"
                    value={info.nombre}
                    onChange={(e) => setInfo((p) => ({ ...p, nombre: e.target.value }))}
                  />
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold">Apellido *</label>
                  <input
                    className="form-control"
                    value={info.apellido}
                    onChange={(e) => setInfo((p) => ({ ...p, apellido: e.target.value }))}
                  />
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold">Email *</label>
                  <input
                    className="form-control"
                    value={info.email}
                    onChange={(e) => setInfo((p) => ({ ...p, email: e.target.value }))}
                  />
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold">Teléfono</label>
                  <input
                    className="form-control"
                    value={info.telefono}
                    onChange={(e) => setInfo((p) => ({ ...p, telefono: e.target.value }))}
                  />
                </div>
              </div>

              {metodo === "envio" && (
                <>
                  <hr className="my-4" />
                  <h5 className="mb-3">Dirección de envío</h5>

                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label fw-semibold">Dirección *</label>
                      <input
                        className="form-control"
                        value={addr.direccion}
                        onChange={(e) => setAddr((p) => ({ ...p, direccion: e.target.value }))}
                      />
                    </div>
                    <div className="col-12 col-md-4">
                      <label className="form-label fw-semibold">Ciudad *</label>
                      <input
                        className="form-control"
                        value={addr.ciudad}
                        onChange={(e) => setAddr((p) => ({ ...p, ciudad: e.target.value }))}
                      />
                    </div>
                    <div className="col-12 col-md-4">
                      <label className="form-label fw-semibold">País *</label>
                      <input
                        className="form-control"
                        value={addr.pais}
                        onChange={(e) => setAddr((p) => ({ ...p, pais: e.target.value }))}
                      />
                    </div>
                    <div className="col-12 col-md-4">
                      <label className="form-label fw-semibold">Código postal</label>
                      <input
                        className="form-control"
                        value={addr.codigo_postal}
                        onChange={(e) => setAddr((p) => ({ ...p, codigo_postal: e.target.value }))}
                      />
                    </div>
                  </div>
                </>
              )}

              <button className="btn btn-warning mt-4" onClick={submit}>
                Confirmar y pagar
              </button>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-5">
          <div className="card shadow-sm border-0 rounded-4">
            <div className="card-body">
              <h5 className="mb-3">Resumen</h5>

              {items.map((it) => (
                <div key={it.id_producto} className="d-flex justify-content-between py-2 border-bottom">
                  <div>
                    <div className="fw-semibold">{it.nombre}</div>
                    <div className="text-muted small">x{it.cantidad}</div>
                  </div>
                  <div className="fw-semibold">
                    ${Number(it.cantidad || 0) * Number(it.precio_unitario || 0)}
                  </div>
                </div>
              ))}

              <div className="d-flex justify-content-between pt-3">
                <span className="text-muted">Estado</span>
                <span className="fw-semibold">{order.estado}</span>
              </div>
              <div className="d-flex justify-content-between">
                <span className="text-muted">Método</span>
                <span className="fw-semibold">{metodo}</span>
              </div>
            </div>
          </div>

          <div className="alert alert-info mt-3">
            * El pago real lo conectamos después. Por ahora esto deja el pedido en estado <b>pendiente</b>.
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
