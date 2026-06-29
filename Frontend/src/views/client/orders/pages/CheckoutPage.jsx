import React, { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import { ordersCustomerService } from "../services/orders.customer.service";
import { authService } from "../../../shared/services/authService";
import { addressService } from "../../services/addressService";
import { useCart } from "../../../../stores/CartContext";
import { formatPrice } from "../../utils/formatPrice";
import placeholderImg from "../../../../assets/images/error-icon.jpg";
import "./checkout.css";

const STEP_LABELS = { details: "Detalle", address: "Dirección", payment: "Pago" };

const CheckoutPage = ({ onSuccess }) => {
  const { refresh: refreshCartBadge } = useCart();

  const [isLoading, setIsLoading] = useState(true);
  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);

  const [metodo, setMetodo] = useState("retiro"); // retiro | envio
  const [step, setStep] = useState("details");
  const [paying, setPaying] = useState(false);

  const [info, setInfo] = useState({ nombre: "", apellido: "", email: "", telefono: "" });
  const [addr, setAddr] = useState({ direccion: "", ciudad: "", pais: "", codigo_postal: "" });
  const [card, setCard] = useState({ titular: "", numero: "", vencimiento: "", cvv: "" });

  const [rates, setRates] = useState([]);
  const [idTarifa, setIdTarifa] = useState("");

  const steps = useMemo(
    () => (metodo === "envio" ? ["details", "address", "payment"] : ["details", "payment"]),
    [metodo]
  );

  const subtotal = useMemo(
    () => items.reduce((acc, it) => acc + Number(it.cantidad || 0) * Number(it.precio_unitario || 0), 0),
    [items]
  );
  const subtotalOriginal = useMemo(
    () => items.reduce((acc, it) => acc + Number(it.cantidad || 0) * Number(it.precio_original ?? it.precio_unitario ?? 0), 0),
    [items]
  );
  const descuento = Math.max(0, subtotalOriginal - subtotal);

  const selectedRate = rates.find((r) => String(r.id_tarifa) === String(idTarifa));
  const envio = metodo === "envio" ? Number(selectedRate?.precio || 0) : 0;
  const total = subtotal + envio;

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

        let baseInfo = {
          nombre: data.order.nombre_pedido || "",
          apellido: data.order.apellido_pedido || "",
          email: data.order.email_pedido || "",
          telefono: data.order.telefono_pedido || "",
        };

        // Autocompletar desde el perfil y dirección si el cliente está logueado.
        if (ordersCustomerService.isLogged()) {
          try {
            const prof = await authService.getProfile();
            baseInfo = {
              nombre: baseInfo.nombre || prof.nombre || "",
              apellido: baseInfo.apellido || prof.apellido || "",
              email: baseInfo.email || prof.stl_email || prof.emp_email || "",
              telefono: baseInfo.telefono || prof.stl_telefono || prof.emp_telefono || "",
            };
          } catch (e) { console.error(e); }

          try {
            const addrRes = await addressService.getMine();
            if (addrRes?.data) {
              setAddr({
                direccion: addrRes.data.direccion || "",
                ciudad: addrRes.data.ciudad || "",
                pais: addrRes.data.pais || "",
                codigo_postal: addrRes.data.codigo_postal || "",
              });
            }
          } catch (e) { console.error(e); }
        }

        setInfo(baseInfo);
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
    (async () => {
      try {
        const res = await ordersCustomerService.shippingRates();
        setRates(res?.data || []);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  // ── Navegación entre pasos ─────────────────────────────────────────────
  const goNext = () => {
    const idx = steps.indexOf(step);
    if (idx < steps.length - 1) setStep(steps[idx + 1]);
  };
  const goBack = () => {
    const idx = steps.indexOf(step);
    if (idx > 0) setStep(steps[idx - 1]);
  };

  const validateDetails = () => {
    if (!info.nombre.trim() || !info.apellido.trim() || !info.email.trim())
      return "Completa nombre, apellido y email.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(info.email.trim())) return "Email inválido.";
    return null;
  };
  const validateAddress = () => {
    if (!addr.direccion.trim() || !addr.ciudad.trim() || !addr.pais.trim())
      return "Completa dirección, ciudad y país.";
    if (rates.length > 0 && !idTarifa) return "Selecciona una zona de envío.";
    return null;
  };
  const validateCard = () => {
    const num = card.numero.replace(/\s+/g, "");
    if (!card.titular.trim()) return "Ingresa el nombre del titular.";
    if (num.length < 13 || !/^\d+$/.test(num)) return "Número de tarjeta inválido.";
    if (!/^\d{2}\/\d{2}$/.test(card.vencimiento)) return "Vencimiento inválido (MM/AA).";
    if (!/^\d{3,4}$/.test(card.cvv)) return "CVV inválido.";
    return null;
  };

  const handleDetailsNext = () => {
    const err = validateDetails();
    if (err) return Swal.fire("Falta información", err, "warning");
    goNext();
  };
  const handleAddressNext = () => {
    const err = validateAddress();
    if (err) return Swal.fire("Falta información", err, "warning");
    goNext();
  };

  // ── Pago simulado ──────────────────────────────────────────────────────
  const handlePay = async () => {
    const err = validateCard();
    if (err) return Swal.fire("Datos de pago", err, "warning");
    if (!items.length) return Swal.fire("Carrito vacío", "No hay productos.", "warning");

    setPaying(true);
    try {
      // 1) datos del pedido
      await ordersCustomerService.saveCustomerInfo(info);
      // 2) dirección si aplica
      if (metodo === "envio") await ordersCustomerService.saveAddress(addr);
      // 3) confirmar pedido (queda pendiente)
      const res = await ordersCustomerService.checkout({
        metodo_entrega: metodo,
        id_tarifa: metodo === "envio" ? idTarifa || null : null,
      });
      const uuid = res?.data?.uuid_pedido;

      // 4) "procesar" el pago (simulado)
      await new Promise((r) => setTimeout(r, 900));
      if (uuid) await ordersCustomerService.pay(uuid);

      await refreshCartBadge();
      Swal.fire("¡Pago aprobado!", "Tu pedido fue pagado correctamente.", "success");
      onSuccess?.({ ...(res?.data || {}), estado: "pagado" });
    } catch (e) {
      console.error(e);
      Swal.fire("Error", e.message || "No se pudo procesar el pago.", "error");
    } finally {
      setPaying(false);
    }
  };

  const formatCardNumber = (v) =>
    v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
  const formatExpiry = (v) => {
    const d = v.replace(/\D/g, "").slice(0, 4);
    return d.length >= 3 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
  };

  if (isLoading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-warning" role="status" />
        <div className="text-muted mt-2">Cargando checkout...</div>
      </div>
    );
  }

  if (!order || items.length === 0) {
    return (
      <div className="container py-5">
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
    <div className="container py-4">
      <h2 className="fw-bold mb-1">Checkout</h2>

      {/* Breadcrumb de pasos */}
      <div className="checkout-steps">
        {steps.map((s, i) => {
          const idx = steps.indexOf(step);
          const state = i === idx ? "is-active" : i < idx ? "is-done" : "";
          return (
            <React.Fragment key={s}>
              {i > 0 && <i className="bi bi-chevron-right checkout-step__sep" />}
              <span className={`checkout-step ${state}`}>
                <span className="checkout-step__num">{i + 1}</span>
                {STEP_LABELS[s]}
              </span>
            </React.Fragment>
          );
        })}
      </div>

      <div className="row g-4">
        {/* ── Formulario ─────────────────────────────────────────────── */}
        <div className="col-12 col-lg-7">
          <div className="card shadow-sm border-0 rounded-4">
            <div className="card-body">
              {/* PASO: DETALLE */}
              {step === "details" && (
                <>
                  <h5 className="fw-bold mb-3">Detalles del cliente</h5>

                  <div className="d-flex gap-2 flex-wrap mb-4">
                    <button
                      type="button"
                      className={`btn ${metodo === "retiro" ? "btn-warning" : "btn-outline-secondary"}`}
                      onClick={() => setMetodo("retiro")}
                    >
                      <i className="bi bi-shop me-1" /> Retiro en tienda
                    </button>
                    <button
                      type="button"
                      className={`btn ${metodo === "envio" ? "btn-warning" : "btn-outline-secondary"}`}
                      onClick={() => setMetodo("envio")}
                    >
                      <i className="bi bi-truck me-1" /> Envío a domicilio
                    </button>
                  </div>

                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Nombre *</label>
                      <input className="form-control" value={info.nombre}
                        onChange={(e) => setInfo((p) => ({ ...p, nombre: e.target.value }))} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Apellido *</label>
                      <input className="form-control" value={info.apellido}
                        onChange={(e) => setInfo((p) => ({ ...p, apellido: e.target.value }))} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Email *</label>
                      <input className="form-control" type="email" value={info.email}
                        onChange={(e) => setInfo((p) => ({ ...p, email: e.target.value }))} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Teléfono</label>
                      <input className="form-control" value={info.telefono}
                        onChange={(e) => setInfo((p) => ({ ...p, telefono: e.target.value }))} />
                    </div>
                  </div>

                  <div className="d-flex justify-content-end mt-4">
                    <button className="btn btn-dark" onClick={handleDetailsNext}>
                      Continuar <i className="bi bi-arrow-right ms-1" />
                    </button>
                  </div>
                </>
              )}

              {/* PASO: DIRECCIÓN */}
              {step === "address" && (
                <>
                  <h5 className="fw-bold mb-3">Dirección de envío</h5>
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label fw-semibold">Dirección *</label>
                      <input className="form-control" value={addr.direccion}
                        onChange={(e) => setAddr((p) => ({ ...p, direccion: e.target.value }))} />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label fw-semibold">Ciudad *</label>
                      <input className="form-control" value={addr.ciudad}
                        onChange={(e) => setAddr((p) => ({ ...p, ciudad: e.target.value }))} />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label fw-semibold">País *</label>
                      <input className="form-control" value={addr.pais}
                        onChange={(e) => setAddr((p) => ({ ...p, pais: e.target.value }))} />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label fw-semibold">Código postal</label>
                      <input className="form-control" value={addr.codigo_postal}
                        onChange={(e) => setAddr((p) => ({ ...p, codigo_postal: e.target.value }))} />
                    </div>

                    {rates.length > 0 && (
                      <div className="col-12">
                        <label className="form-label fw-semibold">Zona de envío *</label>
                        <select
                          className="form-select"
                          value={idTarifa}
                          onChange={(e) => setIdTarifa(e.target.value)}
                        >
                          <option value="">Selecciona una zona...</option>
                          {rates.map((r) => (
                            <option key={r.id_tarifa} value={r.id_tarifa}>
                              {r.nombre} — {formatPrice(r.precio)}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>

                  <div className="d-flex justify-content-between mt-4">
                    <button className="btn btn-outline-secondary" onClick={goBack}>
                      <i className="bi bi-arrow-left me-1" /> Volver
                    </button>
                    <button className="btn btn-dark" onClick={handleAddressNext}>
                      Continuar <i className="bi bi-arrow-right ms-1" />
                    </button>
                  </div>
                </>
              )}

              {/* PASO: PAGO */}
              {step === "payment" && (
                <div className="checkout-card-form">
                  <h5 className="fw-bold mb-1">Pago</h5>
                  <p className="text-muted small mb-3">
                    <i className="bi bi-shield-lock me-1" />
                    Pago simulado para demostración (no se cobra nada real).
                  </p>

                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label fw-semibold">Titular de la tarjeta *</label>
                      <input className="form-control" placeholder="NOMBRE APELLIDO"
                        value={card.titular}
                        onChange={(e) => setCard((p) => ({ ...p, titular: e.target.value }))} />
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-semibold">Número de tarjeta *</label>
                      <input className="form-control" inputMode="numeric"
                        placeholder="4242 4242 4242 4242" value={card.numero}
                        onChange={(e) => setCard((p) => ({ ...p, numero: formatCardNumber(e.target.value) }))} />
                    </div>
                    <div className="col-6">
                      <label className="form-label fw-semibold">Vencimiento *</label>
                      <input className="form-control" placeholder="MM/AA" value={card.vencimiento}
                        onChange={(e) => setCard((p) => ({ ...p, vencimiento: formatExpiry(e.target.value) }))} />
                    </div>
                    <div className="col-6">
                      <label className="form-label fw-semibold">CVV *</label>
                      <input className="form-control" inputMode="numeric" placeholder="123"
                        maxLength={4} value={card.cvv}
                        onChange={(e) => setCard((p) => ({ ...p, cvv: e.target.value.replace(/\D/g, "") }))} />
                    </div>
                  </div>

                  <div className="d-flex justify-content-between mt-4">
                    <button className="btn btn-outline-secondary" onClick={goBack} disabled={paying}>
                      <i className="bi bi-arrow-left me-1" /> Volver
                    </button>
                    <button className="btn btn-warning fw-bold" onClick={handlePay} disabled={paying}>
                      {paying ? (
                        <><span className="spinner-border spinner-border-sm me-2" />Procesando...</>
                      ) : (
                        <>Pagar {formatPrice(total)}</>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Resumen ────────────────────────────────────────────────── */}
        <div className="col-12 col-lg-5">
          <div className="card shadow-sm border-0 rounded-4 checkout-summary">
            <div className="card-body">
              <h5 className="fw-bold mb-3">Resumen del pedido</h5>

              {items.map((it) => {
                const img = it.imagen_url && String(it.imagen_url).trim() !== "" ? it.imagen_url : placeholderImg;
                const unit = Number(it.precio_unitario || 0);
                const original = Number(it.precio_original ?? unit);
                const hasDisc = original > unit;
                const pct = hasDisc ? Math.round((1 - unit / original) * 100) : 0;
                const line = Number(it.cantidad || 0) * unit;
                const ahorro = Number(it.cantidad || 0) * (original - unit);
                return (
                  <div key={it.id_producto} className="d-flex gap-3 align-items-start py-2 border-bottom">
                    <img src={img} alt={it.nombre} width="48" height="48"
                      style={{ objectFit: "cover", borderRadius: 8 }}
                      onError={(e) => (e.currentTarget.src = placeholderImg)} />
                    <div className="flex-grow-1">
                      <div className="fw-semibold small">{it.nombre}</div>
                      <div className="text-muted small">
                        {it.cantidad} × {formatPrice(unit)}
                        {hasDisc && (
                          <span className="text-decoration-line-through ms-1">{formatPrice(original)}</span>
                        )}
                      </div>
                      {hasDisc && (
                        <span className="badge text-bg-success mt-1">-{pct}% oferta</span>
                      )}
                    </div>
                    <div className="text-end">
                      <div className="fw-semibold">{formatPrice(line)}</div>
                      {hasDisc && (
                        <div className="text-success small">Ahorras {formatPrice(ahorro)}</div>
                      )}
                    </div>
                  </div>
                );
              })}

              <div className="d-flex justify-content-between mt-3">
                <span className="text-muted">Subtotal</span>
                <span className="fw-semibold">{formatPrice(subtotalOriginal)}</span>
              </div>
              {descuento > 0 && (
                <div className="d-flex justify-content-between text-success">
                  <span>Descuento por ofertas</span>
                  <span className="fw-semibold">- {formatPrice(descuento)}</span>
                </div>
              )}
              <div className="d-flex justify-content-between">
                <span className="text-muted">Envío</span>
                <span className="fw-semibold">{envio === 0 ? "Gratis" : formatPrice(envio)}</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between">
                <span className="fw-bold fs-5">Total</span>
                <span className="fw-bold fs-5">{formatPrice(total)}</span>
              </div>
              {descuento > 0 && (
                <div className="text-success small text-end mt-1">
                  <i className="bi bi-tag-fill me-1" />
                  ¡Estás ahorrando {formatPrice(descuento)}!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
