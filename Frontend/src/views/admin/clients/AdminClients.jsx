import React, { useEffect, useMemo, useState } from 'react';
import Swal from 'sweetalert2';
import { clientsService } from './services/clients.service';

const AdminClients = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await clientsService.list();
      setClients(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      setError('No se pudieron cargar los clientes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return clients;
    return clients.filter((c) =>
      [c.stl_username, c.stl_email, c.stl_nombre, c.stl_apellido]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q))
    );
  }, [clients, search]);

  const handleDelete = async (c) => {
    const res = await Swal.fire({
      title: '¿Eliminar cliente?',
      text: `Se eliminará a ${c.stl_nombre} ${c.stl_apellido}.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#dc3545',
    });
    if (!res.isConfirmed) return;

    try {
      await clientsService.remove(c.uuid_customer);
      setClients((prev) => prev.filter((x) => x.uuid_customer !== c.uuid_customer));
      Swal.fire('Eliminado', 'El cliente fue eliminado.', 'success');
    } catch (e) {
      Swal.fire('Error', e.message || 'No se pudo eliminar.', 'error');
    }
  };

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="display-6 fw-bold mb-1">Clientes</h1>
          <p className="text-muted mb-0">Gestiona los clientes registrados</p>
        </div>
        <span className="badge text-bg-secondary fs-6">{clients.length} clientes</span>
      </div>

      <div className="card shadow-sm border-0">
        <div className="card-body">
          <div className="mb-3">
            <input
              className="form-control"
              placeholder="Buscar por nombre, usuario o email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {loading ? (
            <div className="text-center py-4">
              <div className="spinner-border" role="status" />
            </div>
          ) : error ? (
            <div className="alert alert-danger mb-0">{error}</div>
          ) : filtered.length === 0 ? (
            <div className="alert alert-info mb-0">No se encontraron clientes.</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead>
                  <tr>
                    <th>Usuario</th>
                    <th>Nombre</th>
                    <th>Email</th>
                    <th className="text-end">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((c) => (
                    <tr key={c.uuid_customer}>
                      <td className="fw-semibold">{c.stl_username}</td>
                      <td>{c.stl_nombre} {c.stl_apellido}</td>
                      <td>{c.stl_email}</td>
                      <td className="text-end">
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(c)}
                        >
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

export default AdminClients;
