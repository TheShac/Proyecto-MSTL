import React from "react";
import { Link } from "react-router-dom";
import placeholderImg from "../../../../assets/images/error-icon.jpg";
import {
  formatPrice,
  hasOffer,
  getDiscountPercent,
} from "../../../client/utils/formatPrice";

const FeaturedProductCard = ({ product }) => {
  const unavailableByState =
    String(product?.estado || "").toLowerCase() === "no_disponible";
  const unavailableByStock = Number(product?.stock) <= 0;
  const isUnavailable = unavailableByState || unavailableByStock;

  const imageSrc =
    product?.imagen_url && String(product.imagen_url).trim() !== ""
      ? product.imagen_url
      : placeholderImg;

  const offer = hasOffer(product);
  const discountPct = getDiscountPercent(product);

  return (
    <div className="card h-100 shadow-sm border-0 position-relative">
      {/* ✅ Badge oferta con % */}
      {offer && (
        <span className="badge bg-danger position-absolute top-0 start-0 m-2">
          {discountPct ? `-${discountPct}%` : "OFERTA"}
        </span>
      )}

      <Link
        to={`/catalogo/${product.id_producto}`}
        className="text-decoration-none"
      >
        <img
          src={imageSrc}
          className="card-img-top"
          alt={product.nombre}
          style={{ height: 260, objectFit: "cover" }}
          onError={(e) => {
            e.currentTarget.src = placeholderImg;
          }}
        />
      </Link>

      <div className="card-body">
        <p className="text-muted small mb-1">
          {product.editorial || "Editorial"}
        </p>

        <Link
          to={`/catalogo/${product.id_producto}`}
          className="text-decoration-none text-dark"
          title={product.nombre}
        >
          <h6 className="fw-semibold text-truncate mb-2">{product.nombre}</h6>
        </Link>

        {/* ✅ Precio consistente con oferta */}
        {offer ? (
          <div className="mb-2">
            <div className="text-muted text-decoration-line-through small">
              {formatPrice(product.precio)}
            </div>
            <div className="fw-bold text-danger">
              {formatPrice(product.precio_oferta)}
            </div>
          </div>
        ) : (
          <div className="fw-bold mb-2">{formatPrice(product.precio)}</div>
        )}

        {isUnavailable ? (
          <span className="badge bg-secondary">No disponible</span>
        ) : (
          <span className="badge bg-success">Disponible</span>
        )}
      </div>
    </div>
  );
};

export default FeaturedProductCard;
