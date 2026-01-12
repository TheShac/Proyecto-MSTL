// src/views/admin/products/offers/components/OffersModal.jsx
import React, { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";

import OfferSelectedList from "./OfferSelectedList";
import OfferAddProducts from "./OfferAddProducts";

import { getOffersAdmin, upsertOffer, removeOffer, applyOfferBulk } from "../services/offersService";

const OffersModal = ({ show, onClose, token, seedProduct }) => {
  const [items, setItems] = useState([]); // ofertas actuales
  const [busy, setBusy] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // template masivo (opcional)
  const [bulk, setBulk] = useState({
    precio_oferta: "",
    activo: 1,
    fecha_inicio: "",
    fecha_fin: "",
  });

  const disabledIds = useMemo(() => new Set(items.map((x) => x.id_producto)), [items]);

  const load = async () => {
    setErrorMsg("");
    try {
      const res = await getOffersAdmin(token);
      if (res.success) setItems(res.data || []);
      else setErrorMsg("Error cargando ofertas.");
    } catch (e) {
      console.error(e);
      setErrorMsg("Error cargando ofertas.");
    }
  };

  useEffect(() => {
    if (show) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show, token]);

  // si se abrió desde un producto → sugerimos crear oferta de ese producto
  useEffect(() => {
    if (!show || !seedProduct) return;

    Swal.fire({
      title: "Crear oferta",
      text: `¿Quieres crear/editar oferta para "${seedProduct.nombre}"?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí",
      cancelButtonText: "No",
    }).then((r) => {
      if (r.isConfirmed) {
        // nada más: el usuario lo agrega desde el panel derecho buscando ese producto
        // (si quieres, puedo hacerlo que se agregue directo sin buscar)
      }
    });
  }, [show, seedProduct]);

  const handleCreateOrUpdate = async (id_producto, payload) => {
    if (busy) return;
    try {
      setBusy(true);
      await upsertOffer(id_producto, payload, token);
      await load();
      Swal.fire("Listo", "Oferta guardada.", "success");
    } catch (e) {
      console.error(e);
      Swal.fire("Error", "No se pudo guardar la oferta.", "error");
    } finally {
      setBusy(false);
    }
  };

  const handleRemove = async (id_producto) => {
    if (busy) return;
    const ok = await Swal.fire({
      title: "Quitar oferta",
      text: "Se quitará la oferta de este producto.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, quitar",
      cancelButtonText: "Cancelar",
    });

    if (!ok.isConfirmed) return;

    try {
      setBusy(true);
      await removeOffer(id_producto, token);
      await load();
    } catch (e) {
      console.error(e);
      Swal.fire("Error", "No se pudo quitar la oferta.", "error");
    } finally {
      setBusy(false);
    }
  };

  const handleApplyBulk = async (selectedIds) => {
    if (busy) return;
    if (!bulk.precio_oferta) {
      Swal.fire("Falta dato", "Debes ingresar un precio de oferta.", "warning");
      return;
    }
    if (!selectedIds.length) {
      Swal.fire("Sin productos", "Selecciona al menos un producto.", "info");
      return;
    }

    try {
      setBusy(true);
      await applyOfferBulk(
        {
          productIds: selectedIds,
          template: {
            precio_oferta: Number(bulk.precio_oferta),
            activo: bulk.activo ? 1 : 0,
            fecha_inicio: bulk.fecha_inicio || null,
            fecha_fin: bulk.fecha_fin || null,
          },
        },
        token
      );
      await load();
      Swal.fire("Listo", "Oferta aplicada a los productos seleccionados.", "success");
    } catch (e) {
      console.error(e);
      Swal.fire("Error", "No se pudo aplicar la oferta masiva.", "error");
    } finally {
      setBusy(false);
    }
  };

  if (!show) return null;

  return (
    <div className="modal fade show d-block" tabIndex="-1" role="dialog">
      <div className="modal-dialog modal-xl modal-dialog-scrollable" role="document">
        <div className="modal-content rounded-4 shadow">
          <div className="modal-header">
            <div>
              <h5 className="modal-title fw-bold">Gestionar Ofertas</h5>
              <div className="text-muted small">
                Crea/edita ofertas por producto o aplica una oferta masiva.
              </div>
            </div>
            <button
              type="button"
              className="btn-close"
              onClick={() => !busy && onClose()}
              disabled={busy}
            />
          </div>

          <div className="modal-body">
            {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}

            <div className="row g-4">
              <div className="col-lg-6">
                <h6 className="fw-bold mb-2">Ofertas actuales</h6>
                <OfferSelectedList
                  items={items}
                  busy={busy}
                  onSave={handleCreateOrUpdate}
                  onRemove={handleRemove}
                />
              </div>

              <div className="col-lg-6">
                <h6 className="fw-bold mb-2">Agregar productos / Oferta masiva</h6>

                {/* 🔥 Panel oferta masiva */}
                <div className="border rounded p-3 mb-3">
                  <div className="fw-semibold mb-2">Plantilla masiva</div>
                  <div className="row g-2">
                    <div className="col-6">
                      <label className="form-label small text-muted mb-1">Precio oferta (final)</label>
                      <input
                        className="form-control"
                        value={bulk.precio_oferta}
                        onChange={(e) => setBulk((p) => ({ ...p, precio_oferta: e.target.value }))}
                        placeholder="Ej: 8000"
                        disabled={busy}
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label small text-muted mb-1">Activo</label>
                      <select
                        className="form-select"
                        value={bulk.activo}
                        onChange={(e) => setBulk((p) => ({ ...p, activo: Number(e.target.value) }))}
                        disabled={busy}
                      >
                        <option value={1}>Sí</option>
                        <option value={0}>No</option>
                      </select>
                    </div>

                    <div className="col-6">
                      <label className="form-label small text-muted mb-1">Inicio (opcional)</label>
                      <input
                        type="date"
                        className="form-control"
                        value={bulk.fecha_inicio}
                        onChange={(e) => setBulk((p) => ({ ...p, fecha_inicio: e.target.value }))}
                        disabled={busy}
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label small text-muted mb-1">Fin (opcional)</label>
                      <input
                        type="date"
                        className="form-control"
                        value={bulk.fecha_fin}
                        onChange={(e) => setBulk((p) => ({ ...p, fecha_fin: e.target.value }))}
                        disabled={busy}
                      />
                    </div>
                  </div>

                  <div className="small text-muted mt-2">
                    Selecciona productos abajo y aplica esta plantilla.
                  </div>
                </div>

                <OfferAddProducts
                  disabledIds={disabledIds}
                  busy={busy}
                  onCreateOffer={handleCreateOrUpdate}     // crear oferta individual desde lista
                  onApplyBulk={handleApplyBulk}            // aplicar plantilla a seleccionados
                  bulkTemplate={bulk}
                />
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={() => !busy && onClose()}
              disabled={busy}
            >
              Cerrar
            </button>

            <button className="btn btn-dark" type="button" onClick={load} disabled={busy}>
              <i className="bi bi-arrow-clockwise me-2" />
              Refrescar
            </button>
          </div>
        </div>
      </div>

      <div className="modal-backdrop fade show" />
    </div>
  );
};

export default OffersModal;
