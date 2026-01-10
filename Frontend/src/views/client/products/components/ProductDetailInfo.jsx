import React from "react";

const ProductDetailInfo = ({ product, isUnavailable }) => {
  return (
    <>
      <p className="text-uppercase text-muted fw-semibold mb-1">
        {product.editorial || "Editorial"}
      </p>

      <h1 className="fw-bold mb-3">{product.nombre}</h1>

      {/* Rating fake */}
      <div className="d-flex align-items-center mb-3">
        <span className="text-warning me-2">
          <i className="bi bi-star-fill"></i>{" "}
          <i className="bi bi-star-fill"></i>{" "}
          <i className="bi bi-star-fill"></i>{" "}
          <i className="bi bi-star-fill"></i>{" "}
          <i className="bi bi-star-fill"></i>
        </span>
        <span className="text-primary small">(1 Reseña)</span>
      </div>

      <h6 className="text-uppercase fw-bold mt-4">Descripción</h6>
      <p className="text-muted" style={{ lineHeight: "1.6" }}>
        {product.descripcion || "Sin descripción disponible."}
      </p>

      {isUnavailable && (
        <div className="alert alert-danger fw-semibold mt-4">
          ESTE PRODUCTO NO SE ENCUENTRA EN STOCK. LLEGADA ESTIMADA DE 2 A 3
          SEMANAS.
        </div>
      )}
    </>
  );
};

export default ProductDetailInfo;
