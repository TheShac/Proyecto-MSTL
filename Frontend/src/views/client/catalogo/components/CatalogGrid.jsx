import React from "react";
import ProductCard from "./ProductCard";

const CatalogGrid = ({ products }) => {
  if (!products || products.length === 0) {
    return <p className="text-muted mt-4">No hay productos encontrados.</p>;
  }

  return (
    <div className="row row-cols-2 row-cols-md-4 g-4 mt-3">
      {products.map((p) => (
        <div className="col" key={p.id_producto}>
          <ProductCard product={p} />
        </div>
      ))}
    </div>
  );
};

export default CatalogGrid;
