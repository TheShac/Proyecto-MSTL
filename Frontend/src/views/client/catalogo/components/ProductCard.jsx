import React from "react";
import { Link } from "react-router-dom";
import { formatPrice } from "../utils/formatPrice";

import placeholderImg from "../../../../assets/images/error-icon.jpg";

const ProductCard = ({ product }) => {
  const isUnavailable = product.estado === "no_disponible" || product.stock <= 0;

  const imageSrc =
    product.imagen_url && product.imagen_url.trim() !== ""
      ? product.imagen_url
      : placeholderImg;

  return (
    <div className="card h-100 shadow-sm border-0 position-relative">
      <img
        src={imageSrc}
        className="card-img-top"
        alt={product.nombre}
        style={{ height: "300px", objectFit: "cover" }}
        onError={(e) => {
          e.target.src = placeholderImg;
        }}
      />

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

        <p className="fw-bold mt-2">{formatPrice(product.precio)}</p>

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
