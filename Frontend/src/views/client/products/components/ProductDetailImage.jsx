import React from "react";

import placeholderImg from "../../../../assets/images/error-icon.jpg";

const ProductDetailImage = ({ product, isUnavailable }) => {
  const imageSrc =
    product.imagen_url && product.imagen_url.trim() !== ""
      ? product.imagen_url
      : placeholderImg;

  return (
    <div className="position-relative">
      <img
        src={imageSrc}
        alt={product.nombre}
        className="img-fluid rounded shadow-sm"
        style={{ width: "100%", height: "700px", objectFit: "cover" }}
        onError={(e) => {
          e.target.src = placeholderImg;
        }}
      />

      {isUnavailable && (
        <span
          className="badge bg-danger position-absolute top-0 start-0 m-3 px-3 py-2"
          style={{ fontSize: "0.9rem" }}
        >
          NO DISPONIBLE
        </span>
      )}
    </div>
  );
};

export default ProductDetailImage;
