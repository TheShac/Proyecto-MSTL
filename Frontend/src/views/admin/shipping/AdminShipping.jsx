import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { shippingService } from './services/shipping.service';
import { formatCLP } from '../orders/utils/formatters';

const emptyForm = { id_tarifa: null, nombre: '', precio: '', activo: true };

const AdminShipping = () => {
  const [rates, setRates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await shippingService.list();
      setRates(res?.data || []);
    } catch (e) {
      console.error(e);
      setError('No se pudieron cargar las tarifas.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const resetForm = () => setForm(emptyForm);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.nombre.trim() || form.precio === '') {
      Swal.fire('Faltan datos', 'Nombre y precio son obligatorios.', 'warning');
      return;
    }
    setSaving(true);
    try {
      const payload = { nombre: form.nombre.trim(), precio: Number(form.precio), activo: form.activo };
      if (form.id_tarifa) await shippingService.update(form.id_tarifa, payload);
      else await shippingService.create(payload);
      resetForm();
      await load();
      Swal.fire('Guardado', 'Tarifa guardada correctamente.', 'success');
    } catch (err) {
      Swal.fire('Error', err.message || 'No se pudo guardar.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const edit = (r) => setForm({ id_tarifa: r.id_tarifa, nombre: r.nombre, precio: String(r.precio), activo: !!r.activo });

  const remove = async (r) => {
    const res = await Swal.fire({
      title: '¿Eliminar tarifa?',
      text: r.nombre,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#dc3545',
    });
    if (!res.isConfirmed) return;
    try {
      await shippingService.remove(r.id_tarifa);
      setRates((prev) => prev.filter((x) => x.id_tarifa !== r.id_tarifa));
      if (form.id_tarifa === r.id_tarifa) resetForm();
    } catch (err) {
      Swal.fire('Error', err.message || 'No se pudo eliminar.', 'error');
    }
  };

  return (
    <div className="container-fluid py-4">
      <h1 className="display-6 fw-bold mb-1">Tarifas de envío</h1>
      <p className="text-muted mb-4">Define las zonas y precios de envío del checkout.</p>

      <div className="row g-4">
        {/* Formulario */}
        <div className="col-lg-4">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h5 className="fw-bold mb-3">{form.id_tarifa ? 'Editar tarifa' : 'Nueva tarifa'}</h5>
              <form onSubmit={submit}>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Zona / Nombre</label>
                  <input className="form-control" placeholder="Ej: Región Metropolitana"
                    value={form.nombre} onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))} />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Precio (CLP)</label>
                  <input type="number" min="0" className="form-control" placeholder="Ej: 2990"
                    value={form.precio} onChange={(e) => setForm((f) => ({ ...f, precio: e.target.value }))} />
                </div>
                <div className="form-check mb-3">
                  <input className="form-check-input" type="checkbox" id="activo"
                    checked={form.activo} onChange={(e) => setForm((f) => ({ ...f, activo: e.target.checked }))} />
                  <label className="form-check-label" htmlFor="activo">Activa</label>
                </div>
                <div className="d-flex gap-2">
                  <button type="submit" className="btn btn-warning fw-bold" disabled={saving}>
                    {saving ? 'Guardando...' : form.id_tarifa ? 'Actualizar' : 'Crear'}
                  </button>
                  {form.id_tarifa && (
                    <button type="button" className="btn btn-outline-secondary" onClick={resetForm}>
                      Cancelar
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Lista */}
        <div className="col-lg-8">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              {loading ? (
                <div className="text-center py-4"><div className="spinner-border" role="status" /></div>
              ) : error ? (
                <div className="alert alert-danger mb-0">{error}</div>
              ) : rates.length === 0 ? (
                <div className="alert alert-info mb-0">Aún no hay tarifas. Crea la primera a la izquierda.</div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead>
                      <tr><th>Zona</th><th>Precio</th><th>Estado</th><th className="text-end">Acciones</th></tr>
                    </thead>
                    <tbody>
                      {rates.map((r) => (
                        <tr key={r.id_tarifa}>
                          <td className="fw-semibold">{r.nombre}</td>
                          <td>{formatCLP(r.precio)}</td>
                          <td>
                            <span className={`badge ${r.activo ? 'text-bg-success' : 'text-bg-secondary'}`}>
                              {r.activo ? 'Activa' : 'Inactiva'}
                            </span>
                          </td>
                          <td className="text-end">
                            <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => edit(r)}>
                              <i className="bi bi-pencil" />
                            </button>
                            <button className="btn btn-sm btn-outline-danger" onClick={() => remove(r)}>
                              <i className="bi bi-trash3" />
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
      </div>
    </div>
  );
};

export default AdminShipping;
