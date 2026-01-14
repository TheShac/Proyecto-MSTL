import React from "react";
import { formatPrice } from "../../utils/formatPrice";

const ProductDetailInfo = ({ product, isUnavailable }) => {
  const hasOffer =
    product?.precio_oferta !== null &&
    product?.precio_oferta !== undefined;

  return (
    <>
      <p className="text-uppercase text-muted fw-semibold mb-1">
        {product.editorial || "Editorial"}
      </p>

      <h1 className="fw-bold mb-3">{product.nombre}</h1>

      <div className="mb-3">
        {hasOffer ? (
          <>
            <div className="text-muted text-decoration-line-through fs-5">
              {formatPrice(product.precio)}
            </div>

            <div className="fw-bold text-danger fs-2">
              {formatPrice(product.precio_oferta)}
            </div>

            <span className="badge bg-danger mt-2">OFERTA</span>
          </>
        ) : (
          <div className="fw-bold fs-2">
            {formatPrice(product.precio)}
          </div>
        )}
      </div>

      <h6 className="text-uppercase fw-bold mt-4">Descripción</h6>
      <p className="text-muted" style={{ lineHeight: "1.8" }}>
        {product.descripcion || "Sin descripción disponible."}
      </p>

      {isUnavailable && (
        <div className="alert alert-danger fw-semibold mt-4">
          ESTE PRODUCTO NO SE ENCUENTRA EN STOCK.
        </div>
      )}
    </>
  );
};

export default ProductDetailInfo;
