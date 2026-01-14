import React, { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import { getAllProductsForOffer } from "../services/offerService";
import placeholderImg from "../../../../assets/images/error-icon.jpg";

const normalize = (s) =>
  String(s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

const thumbStyle = {
  width: 48,
  height: 48,
  borderRadius: 10,
  objectFit: "cover",
  flexShrink: 0,
  border: "1px solid rgba(0,0,0,0.08)",
  background: "#f1f3f5",
};

const OfferAddProducts = ({ token, busy, existingOfferIds, onCreateOffer }) => {
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);

  const [allProducts, setAllProducts] = useState([]);
  const [selected, setSelected] = useState(() => new Set());
  const [bulkPrice, setBulkPrice] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await getAllProductsForOffer(token);
        if (res?.success) setAllProducts(res.data || []);
        else setAllProducts([]);
      } catch (e) {
        console.error(e);
        setAllProducts([]);
      } finally {
        setLoading(false);
      }
    };

    if (token) load();
  }, [token]);

  const filtered = useMemo(() => {
    const nq = normalize(q);
    if (!nq) return allProducts;

    return allProducts.filter((p) => {
      return (
        normalize(p.nombre).includes(nq) ||
        normalize(p.editorial).includes(nq) ||
        normalize(p.genero).includes(nq)
      );
    });
  }, [allProducts, q]);

  const toggleSelect = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const clearSelection = () => setSelected(new Set());

  const createOne = async (p) => {
    if (busy) return;

    const { value } = await Swal.fire({
      title: "Crear oferta",
      input: "number",
      inputLabel: "Precio oferta",
      inputPlaceholder: "Ej: 9900",
      inputAttributes: { min: 0, step: "1" },
      showCancelButton: true,
      confirmButtonText: "Crear",
      cancelButtonText: "Cancelar",
    });

    if (value === undefined || value === null || value === "") return;

    const precio = Number(value);
    if (!Number.isFinite(precio) || precio <= 0) {
      Swal.fire("Error", "Precio oferta inválido.", "error");
      return;
    }

    await onCreateOffer(p, { precio_oferta: precio, activo: 1 });
  };

  const applyBulk = async () => {
    if (busy) return;

    const precio = Number(bulkPrice);
    if (!Number.isFinite(precio) || precio <= 0) {
      Swal.fire("Error", "Ingresa un precio oferta válido.", "error");
      return;
    }

    if (selected.size === 0) {
      Swal.fire("Atención", "Selecciona al menos 1 producto.", "info");
      return;
    }

    const ids = Array.from(selected);

    const confirm = await Swal.fire({
      title: "Aplicar oferta",
      text: `Se aplicará $${precio} a ${ids.length} producto(s).`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Aplicar",
      cancelButtonText: "Cancelar",
    });

    if (!confirm.isConfirmed) return;

    const results = await Promise.all(
      ids.map(async (id) => {
        if (existingOfferIds?.has(id)) return { skipped: true, id };

        const product = allProducts.find((p) => p.id_producto === id) || {
          id_producto: id,
          nombre: `ID ${id}`,
        };

        try {
          await onCreateOffer(product, { precio_oferta: precio, activo: 1 });
          return { ok: true, id };
        } catch (e) {
          return { ok: false, id, e };
        }
      })
    );

    const created = results.filter((r) => r.ok).length;
    const skipped = results.filter((r) => r.skipped).length;
    const failed = results.filter((r) => r.ok === false).length;

    Swal.fire(
      "Resultado",
      `Creadas: ${created}\nSaltadas: ${skipped}\nFallidas: ${failed}`,
      failed ? "warning" : "success"
    );

    clearSelection();
  };

  return (
    <div className="border rounded p-3">
      <input
        className="form-control mb-2"
        placeholder="Escribe para buscar (nombre/editorial/género)..."
        value={q}
        onChange={(e) => setQ(e.target.value)}
        disabled={busy}
      />

      <div className="d-flex flex-wrap gap-2 align-items-center mb-3">
        <span className="badge text-bg-light border">
          Seleccionados: {selected.size}
        </span>

        <input
          className="form-control"
          style={{ maxWidth: 220 }}
          placeholder="Precio oferta para todos"
          value={bulkPrice}
          onChange={(e) => setBulkPrice(e.target.value)}
          disabled={busy}
          type="number"
          min="0"
          step="1"
        />

        <button
          className="btn btn-dark btn-sm"
          type="button"
          onClick={applyBulk}
          disabled={busy}
        >
          <i className="bi bi-lightning-charge me-1" />
          Aplicar a seleccionados
        </button>

        <button
          className="btn btn-outline-secondary btn-sm"
          type="button"
          onClick={clearSelection}
          disabled={busy || selected.size === 0}
        >
          Limpiar selección
        </button>
      </div>

      {loading ? (
        <div className="text-center py-4 text-muted">
          <div className="spinner-border" role="status" />
        </div>
      ) : (
        <div className="list-group">
          {filtered.map((p) => {
            const hasOffer = existingOfferIds?.has(p.id_producto);
            const checked = selected.has(p.id_producto);

            // ✅ SI NO HAY IMAGEN => placeholder
            const imgSrc =
              p.imagen_url && String(p.imagen_url).trim() !== ""
                ? p.imagen_url
                : placeholderImg;

            return (
              <div
                key={p.id_producto}
                className="list-group-item d-flex align-items-center gap-3"
              >
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={checked}
                  onChange={() => toggleSelect(p.id_producto)}
                  disabled={busy || hasOffer}
                  title={hasOffer ? "Ya tiene oferta" : "Seleccionar"}
                />

                {/* ✅ MINIATURA con placeholder + fallback */}
                <img
                  src={imgSrc}
                  alt={p.nombre}
                  style={thumbStyle}
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = placeholderImg;
                  }}
                />

                <div className="flex-grow-1">
                  <div className="fw-semibold">{p.nombre}</div>
                  <div className="text-muted small">
                    {p.editorial || "Sin editorial"} · {p.genero || "Sin género"}
                  </div>
                </div>

                <button
                  className={`btn btn-sm ${
                    hasOffer ? "btn-outline-secondary" : "btn-outline-danger"
                  }`}
                  type="button"
                  onClick={() => createOne(p)}
                  disabled={busy || hasOffer}
                >
                  <i className="bi bi-tag me-1" />
                  {hasOffer ? "Con oferta" : "Crear oferta"}
                </button>
              </div>
            );
          })}

          {!filtered.length && (
            <div className="text-muted text-center py-3">
              No hay productos para mostrar.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OfferAddProducts;
