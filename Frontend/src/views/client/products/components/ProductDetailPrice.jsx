import React from "react";
import { formatPrice } from "../../utils/formatPrice";

const ProductDetailPrice = ({ product }) => {
  const hasOffer =
    product.precio_oferta !== null &&
    product.precio_oferta !== undefined &&
    Number(product.precio_oferta) > 0 &&
    Number(product.precio_oferta) < Number(product.precio);

  if (!hasOffer) {
    return <div className="h3 fw-bold mt-2">{formatPrice(product.precio)}</div>;
  }

  return (
    <div className="mt-2">
      <div className="d-flex align-items-center gap-2 flex-wrap">
        <span className="badge bg-danger">Oferta</span>
        <span className="text-muted text-decoration-line-through">
          {formatPrice(product.precio)}
        </span>
      </div>

      <div className="h2 fw-bold text-danger mt-2">
        {formatPrice(product.precio_oferta)}
      </div>
    </div>
  );
};

export default ProductDetailPrice;
