import React from "react";

const Pagination = ({ page, totalPages, setPage }) => {
  if (totalPages <= 1) return null;

  return (
    <nav className="mt-4 d-flex justify-content-center">
      <ul className="pagination">
        <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
          <button className="page-link" onClick={() => setPage(page - 1)}>
            Anterior
          </button>
        </li>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
          <li key={n} className={`page-item ${page === n ? "active" : ""}`}>
            <button className="page-link" onClick={() => setPage(n)}>
              {n}
            </button>
          </li>
        ))}

        <li className={`page-item ${page === totalPages ? "disabled" : ""}`}>
          <button className="page-link" onClick={() => setPage(page + 1)}>
            Siguiente
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
