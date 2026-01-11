import React from "react";
import { Link } from "react-router-dom";
import placeholderImg from "../../../../assets/images/error-icon.jpg";

const FeaturedProductCard = ({ product }) => {
  const isUnavailable = product.estado === "no_disponible" || product.stock <= 0;

  const imageSrc =
    product.imagen_url && product.imagen_url.trim() !== ""
      ? product.imagen_url
      : placeholderImg;

  return (
    <div className="card h-100 shadow-sm border-0">
      <Link to={`/catalogo/${product.id_producto}`} className="text-decoration-none">
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
        <p className="text-muted small mb-1">{product.editorial || "Editorial"}</p>

        <Link
          to={`/catalogo/${product.id_producto}`}
          className="text-decoration-none text-dark"
          title={product.nombre}
        >
          <h6 className="fw-semibold text-truncate mb-2">{product.nombre}</h6>
        </Link>

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
