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

// helpers
const toNumber = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

const calcOfferPrice = ({ basePrice, mode, value }) => {
  const p = toNumber(basePrice);
  const v = toNumber(value);

  if (!p || p <= 0 || v === null) return null;

  if (mode === "fixed") {
    if (v <= 0) return null;
    return v;
  }

  // percent
  if (v <= 0 || v >= 100) return null;
  const offer = Math.round((p * (100 - v)) / 100);
  return offer > 0 ? offer : null;
};

const formatCLP = (n) => {
  const num = Number(n) || 0;
  return num.toLocaleString("es-CL", { style: "currency", currency: "CLP" });
};

const OfferAddProducts = ({ token, busy, existingOfferIds, onCreateOffer }) => {
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);

  const [allProducts, setAllProducts] = useState([]);
  const [selected, setSelected] = useState(() => new Set());

  // ✅ modo oferta: fixed o percent
  const [bulkMode, setBulkMode] = useState("fixed"); // "fixed" | "percent"
  const [bulkValue, setBulkValue] = useState("");

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

  // ✅ crear una oferta individual (elige fijo o % y preview)
  const createOne = async (p) => {
    if (busy) return;

    const basePrice = Number(p.precio) || 0;

    const { value: mode } = await Swal.fire({
      title: `Oferta para: ${p.nombre}`,
      input: "select",
      inputOptions: {
        fixed: "Precio fijo",
        percent: "% descuento",
      },
      inputValue: "fixed",
      showCancelButton: true,
      confirmButtonText: "Siguiente",
      cancelButtonText: "Cancelar",
    });

    if (!mode) return;

    const inputLabel = mode === "fixed" ? "Precio oferta" : "% descuento (1-99)";
    const inputPlaceholder = mode === "fixed" ? "Ej: 9900" : "Ej: 20";

    const { value } = await Swal.fire({
      title: "Define el valor",
      input: "number",
      inputLabel,
      inputPlaceholder,
      inputAttributes: { min: 0, step: "1" },
      showCancelButton: true,
      confirmButtonText: "Previsualizar",
      cancelButtonText: "Cancelar",
    });

    if (value === undefined || value === null || value === "") return;

    const offerPrice = calcOfferPrice({ basePrice, mode, value });
    if (!offerPrice) {
      Swal.fire("Error", "Valor inválido para oferta.", "error");
      return;
    }

    const percent =
      mode === "percent"
        ? Math.round(Number(value))
        : basePrice > 0
        ? Math.round((1 - offerPrice / basePrice) * 100)
        : null;

    const confirm = await Swal.fire({
      title: "Confirmar oferta",
      html: `
        <div style="text-align:left">
          <div><b>Precio normal:</b> ${formatCLP(basePrice)}</div>
          <div><b>Precio oferta:</b> <span style="color:#dc3545;font-weight:700">${formatCLP(
            offerPrice
          )}</span></div>
          ${
            percent !== null && Number.isFinite(percent)
              ? `<div><b>Descuento:</b> -${percent}%</div>`
              : ""
          }
        </div>
      `,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Crear",
      cancelButtonText: "Cancelar",
    });

    if (!confirm.isConfirmed) return;

    await onCreateOffer(p, { precio_oferta: offerPrice, activo: 1 });
  };

  // ✅ aplicar a seleccionados (usa modo fijo o %)
  const applyBulk = async () => {
    if (busy) return;

    if (selected.size === 0) {
      Swal.fire("Atención", "Selecciona al menos 1 producto.", "info");
      return;
    }

    const val = toNumber(bulkValue);
    if (val === null) {
      Swal.fire("Error", "Ingresa un valor válido.", "error");
      return;
    }
    if (bulkMode === "fixed" && val <= 0) {
      Swal.fire("Error", "El precio oferta debe ser mayor a 0.", "error");
      return;
    }
    if (bulkMode === "percent" && (val <= 0 || val >= 100)) {
      Swal.fire("Error", "El % debe estar entre 1 y 99.", "error");
      return;
    }

    const ids = Array.from(selected);

    // preview promedio (para no mostrar 20 previews distintos)
    const sample = allProducts.find((p) => p.id_producto === ids[0]);
    const sampleBase = Number(sample?.precio) || 0;
    const sampleOffer = calcOfferPrice({ basePrice: sampleBase, mode: bulkMode, value: val });

    const confirm = await Swal.fire({
      title: "Aplicar oferta",
      html: `
        <div style="text-align:left">
          <div><b>Modo:</b> ${bulkMode === "fixed" ? "Precio fijo" : "% descuento"}</div>
          <div><b>Valor:</b> ${bulkMode === "fixed" ? formatCLP(val) : `${val}%`}</div>
          ${
            sampleOffer
              ? `<hr/>
                 <div style="font-size:13px;color:#6c757d">Ejemplo (primer seleccionado)</div>
                 <div><b>Normal:</b> ${formatCLP(sampleBase)}</div>
                 <div><b>Oferta:</b> <span style="color:#dc3545;font-weight:700">${formatCLP(
                   sampleOffer
                 )}</span></div>`
              : ""
          }
          <hr/>
          <div>Se aplicará a <b>${ids.length}</b> producto(s).</div>
        </div>
      `,
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
          precio: 0,
        };

        const offerPrice = calcOfferPrice({
          basePrice: product.precio,
          mode: bulkMode,
          value: val,
        });

        if (!offerPrice) return { ok: false, id };

        try {
          await onCreateOffer(product, { precio_oferta: offerPrice, activo: 1 });
          return { ok: true, id };
        } catch (e) {
          return { ok: false, id, e };
        }
      })
    );

    const created = results.filter((r) => r.ok).length;
    const skipped = results.filter((r) => r.skipped).length;
    const failed = results.filter((r) => r.ok === false && !r.skipped).length;

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

        {/* ✅ modo */}
        <select
          className="form-select"
          style={{ maxWidth: 190 }}
          value={bulkMode}
          onChange={(e) => setBulkMode(e.target.value)}
          disabled={busy}
        >
          <option value="fixed">Precio fijo</option>
          <option value="percent">% descuento</option>
        </select>

        {/* ✅ valor */}
        <input
          className="form-control"
          style={{ maxWidth: 220 }}
          placeholder={bulkMode === "fixed" ? "Precio oferta (ej: 9900)" : "% (ej: 20)"}
          value={bulkValue}
          onChange={(e) => setBulkValue(e.target.value)}
          disabled={busy}
          type="number"
          min="0"
          step="1"
        />

        <button className="btn btn-dark btn-sm" type="button" onClick={applyBulk} disabled={busy}>
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

            const imgSrc =
              p.imagen_url && String(p.imagen_url).trim() !== ""
                ? p.imagen_url
                : placeholderImg;

            return (
              <div key={p.id_producto} className="list-group-item d-flex align-items-center gap-3">
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={checked}
                  onChange={() => toggleSelect(p.id_producto)}
                  disabled={busy || hasOffer}
                  title={hasOffer ? "Ya tiene oferta" : "Seleccionar"}
                />

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
                    {Number(p.precio) ? ` · ${formatCLP(p.precio)}` : ""}
                  </div>
                </div>

                <button
                  className={`btn btn-sm ${hasOffer ? "btn-outline-secondary" : "btn-outline-danger"}`}
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
            <div className="text-muted text-center py-3">No hay productos para mostrar.</div>
          )}
        </div>
      )}
    </div>
  );
};

export default OfferAddProducts;
