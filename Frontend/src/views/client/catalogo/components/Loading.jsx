import React from "react";

const Loading = () => {
  return (
    <div className="d-flex justify-content-center align-items-center py-5">
      <div className="spinner-border text-dark" role="status">
        <span className="visually-hidden">Cargando...</span>
      </div>
      <span className="ms-3 fw-semibold">Cargando productos...</span>
    </div>
  );
};

export default Loading;
