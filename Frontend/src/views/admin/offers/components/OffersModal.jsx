import React, { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";

import OfferSelectedList from "./OfferSelectedList";
import OfferAddProducts from "./OfferAddProducts";

import {
  getOffersAdmin,
  addOffer,
  updateOffer,
  removeOffer,
} from "../services/offerService";

const OffersModal = ({ show, onClose, token }) => {
  const [items, setItems] = useState([]);
  const [busy, setBusy] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // ✅ evita que body scrollee y que el layout “mate” el modal
  useEffect(() => {
    if (!show) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [show]);

  const loadOffers = async () => {
    setErrorMsg("");
    try {
      const res = await getOffersAdmin(token);
      if (res?.success) setItems(res.data || []);
      else setErrorMsg("Error cargando ofertas.");
    } catch (e) {
      console.error(e);
      setErrorMsg("Error cargando ofertas.");
    }
  };

  useEffect(() => {
    if (show) loadOffers();
  }, [show, token]);

  const existingOfferIds = useMemo(
    () => new Set((items || []).map((x) => x.id_producto)),
    [items]
  );

  // ✅ crear oferta individual
  const handleCreateOffer = async (product, offerPayload) => {
    if (busy) return;

    try {
      setBusy(true);
      await addOffer(
        {
          id_producto: product.id_producto,
          ...offerPayload,
        },
        token
      );
      await loadOffers();
    } catch (e) {
      console.error(e);
      Swal.fire("Error", "No se pudo crear la oferta.", "error");
    } finally {
      setBusy(false);
    }
  };

  // ✅ actualizar oferta
  const handleUpdateOffer = async (id_producto, patch) => {
    if (busy) return;
    try {
      setBusy(true);
      await updateOffer(id_producto, patch, token);
      await loadOffers();
    } catch (e) {
      console.error(e);
      Swal.fire("Error", "No se pudo actualizar la oferta.", "error");
    } finally {
      setBusy(false);
    }
  };

  // ✅ eliminar oferta
  const handleRemoveOffer = async (id_producto) => {
    if (busy) return;

    const result = await Swal.fire({
      title: "¿Eliminar oferta?",
      text: "Se eliminará la oferta del producto.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Sí, eliminar",
    });

    if (!result.isConfirmed) return;

    try {
      setBusy(true);
      await removeOffer(id_producto, token);
      await loadOffers();
    } catch (e) {
      console.error(e);
      Swal.fire("Error", "No se pudo eliminar la oferta.", "error");
    } finally {
      setBusy(false);
    }
  };

  if (!show) return null;

  return (
    <>
      {/* ✅ Backdrop: zIndex menor que el modal */}
      <div
        className="modal-backdrop fade show"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 1050,
        }}
        onClick={() => !busy && onClose()}
      />

      {/* ✅ Modal: zIndex mayor + position fixed */}
      <div
        className="modal fade show d-block"
        tabIndex="-1"
        role="dialog"
        aria-modal="true"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 1060,
          overflow: "hidden",
        }}
      >
        <div
          className="modal-dialog modal-xl modal-dialog-scrollable"
          role="document"
          style={{
            marginTop: "1.5rem",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-content rounded-4 shadow">
            <div className="modal-header">
              <div>
                <h5 className="modal-title fw-bold">Gestionar Ofertas</h5>
                <div className="text-muted small">
                  Crea ofertas (individual o masiva), edita precio, activa/desactiva o elimina.
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
                    onUpdate={handleUpdateOffer}
                    onRemove={handleRemoveOffer}
                  />
                </div>

                <div className="col-lg-6">
                  <h6 className="fw-bold mb-2">Crear ofertas</h6>
                  <OfferAddProducts
                    token={token}
                    busy={busy}
                    existingOfferIds={existingOfferIds}
                    onCreateOffer={handleCreateOffer}
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

              <button
                className="btn btn-dark"
                type="button"
                onClick={loadOffers}
                disabled={busy}
              >
                <i className="bi bi-arrow-clockwise me-2" />
                Refrescar
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OffersModal;
