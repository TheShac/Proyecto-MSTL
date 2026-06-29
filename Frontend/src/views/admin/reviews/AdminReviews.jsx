import React, { useEffect, useMemo, useState } from 'react';
import Swal from 'sweetalert2';
import { adminReviewsService } from './services/reviews.service';

const Stars = ({ value }) => (
  <span style={{ color: '#ffc107', whiteSpace: 'nowrap' }}>
    {[1, 2, 3, 4, 5].map((n) => (
      <i key={n} className={`bi ${n <= value ? 'bi-star-fill' : 'bi-star'}`} />
    ))}
  </span>
);

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminReviewsService.list();
      setReviews(res?.data || []);
    } catch (e) {
      console.error(e);
      setError('No se pudieron cargar las reseñas.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return reviews;
    return reviews.filter((r) =>
      [r.producto, r.nombre, r.apellido, r.email, r.comentario]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q))
    );
  }, [reviews, search]);

  const handleDelete = async (r) => {
    const res = await Swal.fire({
      title: '¿Eliminar reseña?',
      text: `Reseña de ${r.nombre} sobre "${r.producto}".`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#dc3545',
    });
    if (!res.isConfirmed) return;

    try {
      await adminReviewsService.remove(r.id);
      setReviews((prev) => prev.filter((x) => x.id !== r.id));
      Swal.fire('Eliminada', 'La reseña fue eliminada.', 'success');
    } catch (e) {
      Swal.fire('Error', e.message || 'No se pudo eliminar.', 'error');
    }
  };

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="display-6 fw-bold mb-1">Reseñas</h1>
          <p className="text-muted mb-0">Modera las opiniones de los clientes</p>
        </div>
        <span className="badge text-bg-secondary fs-6">{reviews.length} reseñas</span>
      </div>

      <div className="card shadow-sm border-0">
        <div className="card-body">
          <div className="mb-3">
            <input
              className="form-control"
              placeholder="Buscar por producto, cliente o comentario..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {loading ? (
            <div className="text-center py-4"><div className="spinner-border" role="status" /></div>
          ) : error ? (
            <div className="alert alert-danger mb-0">{error}</div>
          ) : filtered.length === 0 ? (
            <div className="alert alert-info mb-0">No hay reseñas.</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Cliente</th>
                    <th>Calificación</th>
                    <th>Comentario</th>
                    <th>Fecha</th>
                    <th className="text-end">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r) => (
                    <tr key={r.id}>
                      <td className="fw-semibold">{r.producto}</td>
                      <td>{r.nombre} {r.apellido}</td>
                      <td><Stars value={r.calificacion} /></td>
                      <td style={{ maxWidth: 320 }}>{r.comentario || <span className="text-muted">—</span>}</td>
                      <td className="text-muted small">
                        {r.fecha ? new Date(r.fecha).toLocaleDateString('es-CL') : '—'}
                      </td>
                      <td className="text-end">
                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(r)}>
                          <i className="bi bi-trash3 me-1" /> Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminReviews;
