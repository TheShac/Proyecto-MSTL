import React, { useEffect, useMemo, useState } from 'react';
import { ordersService } from '../orders/services/orders.service';
import { formatCLP } from '../orders/utils/formatters';

const STATUSES = [
  { key: 'pendiente', label: 'Pendientes', cls: 'bg-warning' },
  { key: 'pagado', label: 'Pagados', cls: 'bg-info' },
  { key: 'enviado', label: 'Enviados', cls: 'bg-primary' },
  { key: 'entregado', label: 'Entregados', cls: 'bg-success' },
  { key: 'cancelado', label: 'Cancelados', cls: 'bg-danger' },
];

const AdminAnaliticas = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await ordersService.list();
        setOrders(res?.data || []);
      } catch (e) {
        console.error(e);
        setError('No se pudieron cargar las estadísticas.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const stats = useMemo(() => {
    const valid = orders.filter((o) => o.estado !== 'cancelado');
    const revenue = valid.reduce((acc, o) => acc + Number(o.precio || 0), 0);
    const count = orders.length;
    const avg = valid.length ? revenue / valid.length : 0;

    const byStatus = STATUSES.map((s) => ({
      ...s,
      count: orders.filter((o) => o.estado === s.key).length,
    }));

    return { revenue, count, avg, byStatus };
  }, [orders]);

  const maxStatus = Math.max(1, ...stats.byStatus.map((s) => s.count));

  return (
    <div className="container-fluid py-4">
      <h1 className="display-6 fw-bold mb-1">Estadísticas</h1>
      <p className="text-muted mb-4">Resumen de ventas y pedidos</p>

      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border" role="status" />
        </div>
      ) : (
        <>
          <div className="row g-4 mb-4">
            <div className="col-md-4">
              <div className="card shadow-sm border-0 h-100">
                <div className="card-body">
                  <h6 className="text-muted text-uppercase small">Ingresos</h6>
                  <h3 className="fw-bold mb-0">{formatCLP(stats.revenue)}</h3>
                  <small className="text-muted">Pedidos no cancelados</small>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card shadow-sm border-0 h-100">
                <div className="card-body">
                  <h6 className="text-muted text-uppercase small">Pedidos</h6>
                  <h3 className="fw-bold mb-0">{stats.count}</h3>
                  <small className="text-muted">Total histórico</small>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card shadow-sm border-0 h-100">
                <div className="card-body">
                  <h6 className="text-muted text-uppercase small">Ticket promedio</h6>
                  <h3 className="fw-bold mb-0">{formatCLP(stats.avg)}</h3>
                  <small className="text-muted">Por pedido válido</small>
                </div>
              </div>
            </div>
          </div>

          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h5 className="fw-bold mb-3">Pedidos por estado</h5>
              {stats.byStatus.map((s) => (
                <div key={s.key} className="mb-3">
                  <div className="d-flex justify-content-between small mb-1">
                    <span>{s.label}</span>
                    <span className="fw-semibold">{s.count}</span>
                  </div>
                  <div className="progress" style={{ height: 10 }}>
                    <div
                      className={`progress-bar ${s.cls}`}
                      style={{ width: `${(s.count / maxStatus) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminAnaliticas;
