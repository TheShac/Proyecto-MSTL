import React, { useEffect, useMemo, useState } from "react";
import ReactDOM from "react-dom";
import Swal from "sweetalert2";

import FeaturedSelectedList from "./FeaturedSelectedList";
import FeaturedAddProducts from "./FeaturedAddProducts";

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

  const disabledIds = useMemo(
    () => new Set(items.map((x) => x.id_producto)),
    [items]
  );

  const loadFeatured = async () => {
    setErrorMsg("");
    try {
      const res = await getFeaturedAdmin(token);
      if (res?.success) {
        setItems(res.data || []);
      } else {
        setErrorMsg("Error cargando destacados.");
      }
    } catch (e) {
      console.error(e);
      setErrorMsg("Error cargando destacados.");
    }
  };

  // ✅ abrir/cargar
  useEffect(() => {
    if (show) loadFeatured();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show, token]);

  // ✅ bloquear scroll del body + ESC para cerrar
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

  // ✅ helper: persistir orden
  const persistOrder = async (newItems) => {
    const payload = newItems.map((it, idx) => ({
      id_producto: it.id_producto,
      posicion: idx + 1,
    }));

    // tu endpoint: PUT /api/featured/reorder { items: [...] }
    await reorderFeatured(payload, token);
  };

  const handleAdd = async (p) => {
    if (busy) return;
    try {
      setBusy(true);

      await addFeatured(
        {
          id_producto: p.id_producto,
          activo: 1,
        },
        token
      );

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
      await updateFeatured(
        item.id_producto,
        { activo: item.activo ? 0 : 1 },
        token
      );
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

    // optimista
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

    // optimista
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

  // ✅ drag reorder (viene desde FeaturedSelectedList)
  const handleReorderDrag = async (newItems) => {
    if (busy) return;

    // optimista
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
      {/* Backdrop */}
      <div
        onClick={handleClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,.55)",
          zIndex: 2050,
        }}
      />

      {/* Modal wrapper */}
      <div
        role="dialog"
        aria-modal="true"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 2060,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "1rem",
        }}
      >
        {/* Modal box */}
        <div
          className="bg-white rounded-4 shadow"
          onClick={(e) => e.stopPropagation()}
          style={{
            width: "min(1200px, 100%)",
            maxHeight: "85vh",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden", // ✅ evita scroll horizontal raro
          }}
        >
          {/* Header */}
          <div className="p-3 border-bottom d-flex justify-content-between align-items-start">
            <div>
              <h5 className="fw-bold m-0">Gestionar Productos Destacados</h5>
              <div className="text-muted small">
                Agrega productos, define el orden y activa/desactiva qué aparece en el Dashboard.
              </div>
            </div>

            <button
              type="button"
              className="btn-close"
              onClick={handleClose}
              disabled={busy}
            />
          </div>

          {/* Body */}
          <div
            className="p-3"
            style={{
              overflowY: "auto",
              overflowX: "hidden", // ✅ clave
            }}
          >
            {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}

            <div className="row g-4">
              <div className="col-12 col-lg-6">
                <h6 className="fw-bold mb-2">Destacados actuales</h6>

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

              <div className="col-12 col-lg-6">
                <h6 className="fw-bold mb-2">Agregar producto a destacados</h6>

                <FeaturedAddProducts
                  disabledIds={disabledIds}
                  onAdd={handleAdd}
                  busy={busy}
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-3 border-top d-flex justify-content-end gap-2">
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={handleClose}
              disabled={busy}
            >
              Cerrar
            </button>

            <button
              className="btn btn-dark"
              type="button"
              onClick={loadFeatured}
              disabled={busy}
            >
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
