import React, { useEffect, useMemo, useState } from "react";
import ReactDOM from "react-dom";
import Swal from "sweetalert2";

import FeaturedSelectedList from "./FeaturedSelectedList";
import FeaturedAddProducts from "./FeaturedAddProducts";
import "./featuredModal.css";

import {
  getFeaturedAdmin,
  addFeatured,
  updateFeatured,
  removeFeatured,
  reorderFeatured,
} from "../services/featuredService";

const FeaturedProductsModal = ({ show, onClose, token }) => {
  const [items, setItems] = useState([]);
  const [busy, setBusy] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const disabledIds = useMemo(() => new Set(items.map((x) => x.id_producto)), [items]);

  const loadFeatured = async () => {
    setErrorMsg("");
    try {
      const res = await getFeaturedAdmin(token);
      if (res?.success) setItems(res.data || []);
      else setErrorMsg("Error cargando destacados.");
    } catch (e) {
      console.error(e);
      setErrorMsg("Error cargando destacados.");
    }
  };

  useEffect(() => {
    if (show) loadFeatured();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show, token]);

  useEffect(() => {
    if (!show) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e) => {
      if (e.key === "Escape") handleClose();
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show, busy]);

  const handleClose = () => {
    if (busy) return;
    onClose?.();
  };

  const persistOrder = async (newItems) => {
    const payload = newItems.map((it, idx) => ({
      id_producto: it.id_producto,
      posicion: idx + 1,
    }));
    await reorderFeatured(payload, token);
  };

  const handleAdd = async (p) => {
    if (busy) return;
    try {
      setBusy(true);
      await addFeatured({ id_producto: p.id_producto, activo: 1 }, token);
      await loadFeatured();
    } catch (e) {
      console.error(e);
      Swal.fire("Error", "No se pudo agregar a destacados.", "error");
    } finally {
      setBusy(false);
    }
  };

  const handleRemove = async (id_producto) => {
    if (busy) return;
    try {
      setBusy(true);
      await removeFeatured(id_producto, token);
      await loadFeatured();
    } catch (e) {
      console.error(e);
      Swal.fire("Error", "No se pudo quitar de destacados.", "error");
    } finally {
      setBusy(false);
    }
  };

  const handleToggleActive = async (item) => {
    if (busy) return;
    try {
      setBusy(true);
      await updateFeatured(item.id_producto, { activo: item.activo ? 0 : 1 }, token);
      await loadFeatured();
    } catch (e) {
      console.error(e);
      Swal.fire("Error", "No se pudo actualizar el estado.", "error");
    } finally {
      setBusy(false);
    }
  };

  const onMoveUp = async (idx) => {
    if (busy || idx <= 0) return;

    const newItems = [...items];
    [newItems[idx - 1], newItems[idx]] = [newItems[idx], newItems[idx - 1]];
    setItems(newItems);

    try {
      setBusy(true);
      await persistOrder(newItems);
      await loadFeatured();
    } catch (e) {
      console.error(e);
      Swal.fire("Error", "No se pudo reordenar.", "error");
      await loadFeatured();
    } finally {
      setBusy(false);
    }
  };

  const onMoveDown = async (idx) => {
    if (busy || idx >= items.length - 1) return;

    const newItems = [...items];
    [newItems[idx], newItems[idx + 1]] = [newItems[idx + 1], newItems[idx]];
    setItems(newItems);

    try {
      setBusy(true);
      await persistOrder(newItems);
      await loadFeatured();
    } catch (e) {
      console.error(e);
      Swal.fire("Error", "No se pudo reordenar.", "error");
      await loadFeatured();
    } finally {
      setBusy(false);
    }
  };

  const handleReorderDrag = async (newItems) => {
    if (busy) return;
    setItems(newItems);

    try {
      setBusy(true);
      await persistOrder(newItems);
      await loadFeatured();
    } catch (e) {
      console.error(e);
      Swal.fire("Error", "No se pudo reordenar.", "error");
      await loadFeatured();
    } finally {
      setBusy(false);
    }
  };

  if (!show) return null;

  const modalUI = (
    <>
      <div className="featured-modal-overlay" onClick={handleClose} />

      <div className="featured-modal-wrap" role="dialog" aria-modal="true">
        <div
          className="featured-modal-panel rounded-4 shadow"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="featured-modal-header p-3 d-flex justify-content-between align-items-start">
            <div>
              <h5 className="fw-bold m-0">Gestionar Productos Destacados</h5>
              <div className="text-muted small">
                Agrega productos, define el orden y activa/desactiva qué aparece en el Dashboard.
              </div>
            </div>

            <button type="button" className="btn-close" onClick={handleClose} disabled={busy} />
          </div>

          <div className="featured-modal-body p-3">
            {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}

            <div className="row g-4">
              <div className="col-12 col-lg-6">
                <div className="featured-panel-box">
                  <h6 className="fw-bold mb-3">Destacados actuales</h6>

                  <FeaturedSelectedList
                    items={items}
                    busy={busy}
                    onRemove={handleRemove}
                    onToggleActive={handleToggleActive}
                    onMoveUp={onMoveUp}
                    onMoveDown={onMoveDown}
                    onReorder={handleReorderDrag}
                  />
                </div>
              </div>

              <div className="col-12 col-lg-6">
                <div className="featured-panel-box">
                  <h6 className="fw-bold mb-3">Agregar producto a destacados</h6>

                  <FeaturedAddProducts
                    disabledIds={disabledIds}
                    onAdd={handleAdd}
                    busy={busy}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="featured-modal-footer p-3 d-flex justify-content-end gap-2">
            <button className="btn btn-outline-secondary" type="button" onClick={handleClose} disabled={busy}>
              Cerrar
            </button>

            <button className="btn btn-warning" type="button" onClick={loadFeatured} disabled={busy}>
              <i className="bi bi-arrow-clockwise me-2" />
              Refrescar
            </button>
          </div>
        </div>
      </div>
    </>
  );

  return ReactDOM.createPortal(modalUI, document.body);
};

export default FeaturedProductsModal;
