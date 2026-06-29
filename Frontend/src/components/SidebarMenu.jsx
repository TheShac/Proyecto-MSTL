import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getEditorials, getGenres } from '../views/client/catalogo/services/catalogService';
import './Styles/Sidebar.css';

const SidebarMenu = ({ open, onClose }) => {
  const [editorials, setEditorials] = useState([]);
  const [genres, setGenres] = useState([]);
  const [openEd, setOpenEd] = useState(false);
  const [openGen, setOpenGen] = useState(false);

  useEffect(() => {
    if (!open) return;
    (async () => {
      try {
        const [ed, ge] = await Promise.all([getEditorials(), getGenres()]);
        setEditorials(ed?.data || []);
        setGenres(ge?.data || []);
      } catch (e) {
        console.error('Error cargando menú:', e);
      }
    })();
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed-top vw-100 vh-100 d-flex" style={{ zIndex: 1050 }}>
      <div className="w-100 h-100 bg-dark bg-opacity-50" onClick={onClose}></div>

      <aside
        className="ms-auto bg-white h-100 shadow-lg p-4 overflow-auto sidebar-panel"
        style={{ width: '450px', maxWidth: '90%' }}
      >
        <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2">
          <h2 className="h5 fw-bolder mb-0">Categorías</h2>
          <button onClick={onClose} className="btn btn-sm btn-outline-secondary border-0 p-1">
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        <ul className="list-group list-group-flush mb-4">
          <li className="list-group-item border-0 px-0 py-2">
            <Link to="/catalogo" className="text-decoration-none fw-semibold d-block" onClick={onClose}>
              <i className="bi bi-grid me-2" /> Todos los productos
            </Link>
          </li>

          <li className="list-group-item border-0 px-0 py-2">
            <Link to="/catalogo?onlyOffers=true" className="text-decoration-none fw-semibold d-block" onClick={onClose}>
              <i className="bi bi-tag me-2" /> Ofertas
            </Link>
          </li>

          {/* Editorial (desplegable) */}
          <li className="list-group-item border-0 px-0 py-2">
            <button
              type="button"
              className="btn btn-link p-0 text-decoration-none fw-semibold d-flex justify-content-between align-items-center w-100"
              onClick={() => setOpenEd((v) => !v)}
            >
              <span><i className="bi bi-building me-2" /> Editorial</span>
              <i className={`bi bi-chevron-${openEd ? 'up' : 'down'} small`}></i>
            </button>
            {openEd && (
              <ul className="list-unstyled ps-4 mt-2 mb-0">
                {editorials.length === 0 && <li className="text-muted small py-1">Sin editoriales</li>}
                {editorials.map((ed) => (
                  <li key={ed.id_editorial} className="py-1">
                    <Link
                      to={`/catalogo?editorial=${encodeURIComponent(ed.nombre_editorial)}`}
                      className="text-decoration-none d-block"
                      onClick={onClose}
                    >
                      {ed.nombre_editorial}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>

          {/* Géneros (desplegable) */}
          <li className="list-group-item border-0 px-0 py-2">
            <button
              type="button"
              className="btn btn-link p-0 text-decoration-none fw-semibold d-flex justify-content-between align-items-center w-100"
              onClick={() => setOpenGen((v) => !v)}
            >
              <span><i className="bi bi-bookmarks me-2" /> Géneros</span>
              <i className={`bi bi-chevron-${openGen ? 'up' : 'down'} small`}></i>
            </button>
            {openGen && (
              <ul className="list-unstyled ps-4 mt-2 mb-0">
                {genres.length === 0 && <li className="text-muted small py-1">Sin géneros</li>}
                {genres.map((g) => (
                  <li key={g.id_genero} className="py-1">
                    <Link
                      to={`/catalogo?genre=${encodeURIComponent(g.nombre_genero)}`}
                      className="text-decoration-none d-block"
                      onClick={onClose}
                    >
                      {g.nombre_genero}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        </ul>

        <div className="border-top pt-3 mb-4">
          <h6 className="text-secondary fw-bolder mb-3">SÍGUENOS</h6>
          <div className="d-flex gap-3 fs-5">
            <a href="#" className="text-reset"><i className="bi bi-instagram"></i></a>
            <a href="#" className="text-reset"><i className="bi bi-facebook"></i></a>
            <a href="#" className="text-reset"><i className="bi bi-youtube"></i></a>
            <a href="#" className="text-reset"><i className="bi bi-tiktok"></i></a>
          </div>
        </div>

        <div className="border-top pt-3">
          <h6 className="text-secondary fw-bolder mb-3">CONTÁCTANOS</h6>

          <div className="d-flex align-items-start mb-2">
            <i className="bi bi-envelope-fill me-2 mt-1"></i>
            <span className="small">administracion@test.cl</span>
          </div>

          <div className="d-flex align-items-start mb-2">
            <i className="bi bi-whatsapp me-2 mt-1"></i>
            <span className="small">56912345678</span>
          </div>

          <div className="d-flex align-items-start mb-2">
            <i className="bi bi-geo-alt-fill me-2 mt-1"></i>
            <span className="small">Tienda Online. Entregas al espacio</span>
          </div>

          <div className="d-flex align-items-start">
            <i className="bi bi-clock-fill me-2 mt-1"></i>
            <span className="small">
              Tienda Online. Atención de Lunes a Sábados.
              <br />
              Domingos y festivos cerrado.
            </span>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default SidebarMenu;
