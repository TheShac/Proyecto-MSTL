import React from "react";
import { Link } from "react-router-dom";
import { formatPrice } from "../utils/formatPrice";
import placeholderImg from "../../../../assets/images/error-icon.jpg";

const ProductCard = ({ product }) => {
  const isUnavailable = product.estado === "no_disponible" || Number(product.stock) <= 0;

  const imageSrc =
    product.imagen_url && product.imagen_url.trim() !== ""
      ? product.imagen_url
      : placeholderImg;

  const hasOffer = product.precio_oferta !== null && product.precio_oferta !== undefined;

  const discountPct =
  hasOffer && Number(product.precio) > 0
    ? Math.round((1 - Number(product.precio_oferta) / Number(product.precio)) * 100)
    : null;

  return (
    <div className="card h-100 shadow-sm border-0 position-relative">
      {/* ✅ Badge Oferta */}
      {hasOffer && (
        <span className="badge bg-danger position-absolute top-0 start-0 m-2">
          OFERTA
        </span>
      )}

      {/* ✅ Imagen clickeable */}
      <Link to={`/catalogo/${product.id_producto}`} className="text-decoration-none">
        <img
          src={imageSrc}
          className="card-img-top"
          alt={product.nombre}
          style={{ height: "300px", objectFit: "cover" }}
          onError={(e) => {
            e.target.src = placeholderImg;
          }}
        />
      </Link>

      {/* Overlay NO DISPONIBLE */}
      {isUnavailable && (
        <div
          className="position-absolute w-100 text-center fw-bold text-white"
          style={{
            top: "45%",
            left: 0,
            background: "rgba(0,0,0,0.6)",
            padding: "10px",
          }}
        >
          NO DISPONIBLE
        </div>
      )}

      <div className="card-body">
        <p className="text-muted small mb-1">{product.editorial}</p>
        <h6 className="fw-semibold text-truncate">{product.nombre}</h6>

        {/* ✅ Precios */}
        {hasOffer ? (
          <div className="mt-2">
            <div className="text-muted text-decoration-line-through small">
              {formatPrice(product.precio)}
            </div>
            <div className="fw-bold text-danger fs-5">
              {formatPrice(product.precio_oferta)}
            </div>
          </div>
        ) : (
          <p className="fw-bold mt-2">{formatPrice(product.precio)}</p>
        )}

        <div className="d-flex gap-2 mt-3">
          <Link
            to={`/catalogo/${product.id_producto}`}
            className="btn btn-danger w-50"
          >
            Ver detalles
          </Link>

          <button className="btn btn-dark w-50" disabled={isUnavailable}>
            Agregar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;