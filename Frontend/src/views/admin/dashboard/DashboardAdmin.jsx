import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { productService } from '../products/services/product.service';
import { ordersService } from '../orders/services/orders.service';
import { formatCLP, formatDate } from '../orders/utils/formatters';

const LOW_STOCK_THRESHOLD = 5;

const STATUS_CLS = {
  pendiente: 'text-bg-warning',
  pagado: 'text-bg-info',
  enviado: 'text-bg-primary',
  entregado: 'text-bg-success',
  cancelado: 'text-bg-danger',
};

const DashboardAdmin = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const [prods, ordersRes] = await Promise.all([
          productService.list(),
          ordersService.list(),
        ]);
        setProducts(Array.isArray(prods) ? prods : []);
        setOrders(ordersRes?.data || []);
      } catch (e) {
        console.error(e);
        setError('No se pudieron cargar los datos del dashboard.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const lowStock = useMemo(
    () => products.filter((p) => Number(p.stock) <= LOW_STOCK_THRESHOLD),
    [products]
  );

  const revenue = useMemo(
    () =>
      orders
        .filter((o) => o.estado !== 'cancelado')
        .reduce((acc, o) => acc + Number(o.precio || 0), 0),
    [orders]
  );

  const recentOrders = useMemo(() => orders.slice(0, 5), [orders]);

  const metrics = [
    {
      title: 'Total Productos',
      value: products.length,
      hint: 'Productos en catálogo',
      icon: 'bi-box-seam',
      color: 'text-warning',
    },
    {
      title: 'Stock Bajo',
      value: lowStock.length,
      hint: `Con ${LOW_STOCK_THRESHOLD} o menos unidades`,
      icon: 'bi-exclamation-triangle',
      color: 'text-danger',
    },
    {
      title: 'Pedidos',
      value: orders.length,
      hint: 'Pedidos totales',
      icon: 'bi-journal-text',
      color: 'text-primary',
    },
    {
      title: 'Ingresos',
      value: formatCLP(revenue),
      hint: 'Pedidos no cancelados',
      icon: 'bi-cash-coin',
      color: 'text-success',
    },
  ];

  return (
    <div className="container-fluid py-4">
      <h1 className="display-5 fw-bold mb-1">Dashboard</h1>
      <p className="lead text-muted mb-4">Resumen general de tu tienda MangaStore</p>

      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border" role="status" />
          <div className="text-muted mt-2">Cargando datos...</div>
        </div>
      ) : (
        <>
          {/* Métricas */}
          <div className="row g-4 mb-4">
            {metrics.map((m) => (
              <div className="col-md-6 col-lg-3" key={m.title}>
                <div className="card h-100 shadow-sm border-0">
                  <div className="card-body d-flex flex-column justify-content-between">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h6 className="card-title text-muted text-uppercase small mb-0">
                        {m.title}
                      </h6>
                      <i className={`bi ${m.icon} fs-4 ${m.color}`} />
                    </div>
                    <h3 className="fw-bold mb-0">{m.value}</h3>
                    <p className="card-text text-muted small mt-1">{m.hint}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Listados */}
          <div className="row g-4">
            <div className="col-lg-6">
              <div className="card h-100 shadow-sm border-0">
                <div className="card-body d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="card-title fw-bold mb-0">Pedidos Recientes</h5>
                    <Link to="/admin/orders" className="btn btn-sm btn-outline-secondary">
                      Ver Todos
                    </Link>
                  </div>

                  {recentOrders.length === 0 ? (
                    <p className="text-muted mb-0">No hay pedidos aún.</p>
                  ) : (
                    <div className="list-group list-group-flush">
                      {recentOrders.map((o) => (
                        <div
                          key={o.uuid_pedido}
                          className="list-group-item px-0 d-flex justify-content-between align-items-center"
                        >
                          <div>
                            <div className="fw-semibold">
                              {o.nombre_pedido} {o.apellido_pedido}
                            </div>
                            <small className="text-muted">
                              {formatDate(o.fecha_pedido)} · {o.items} art.
                            </small>
                          </div>
                          <div className="text-end">
                            <span className={`badge ${STATUS_CLS[o.estado] || 'text-bg-secondary'} mb-1`}>
                              {o.estado}
                            </span>
                            <div className="fw-bold">{formatCLP(o.precio)}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="card h-100 shadow-sm border-0">
                <div className="card-body d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="card-title fw-bold mb-0">Productos con Stock Bajo</h5>
                    <Link to="/admin/inventory" className="btn btn-sm btn-outline-warning">
                      Gestionar Stock
                    </Link>
                  </div>

                  {lowStock.length === 0 ? (
                    <p className="text-muted mb-0">Todo el stock está en buen nivel. 🎉</p>
                  ) : (
                    <div className="list-group list-group-flush">
                      {lowStock.slice(0, 6).map((p) => (
                        <div
                          key={p.id_producto}
                          className="list-group-item px-0 d-flex justify-content-between align-items-center"
                        >
                          <span className="text-truncate me-2">{p.nombre}</span>
                          <span className="badge text-bg-danger">{p.stock} u.</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardAdmin;
