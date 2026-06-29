import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authService } from '../shared/services/authService';
import { ordersCustomerService } from './orders/services/orders.customer.service';
import { addressService } from './services/addressService';
import { useAuth } from '../../stores/AuthContext';
import { useWishlist } from '../../stores/WishlistContext';
import { useCart } from '../../stores/CartContext';
import { formatPrice, hasOffer } from './utils/formatPrice';

const ORDER_STATUS = {
  pendiente: { label: 'Pendiente', cls: 'text-bg-warning' },
  pagado: { label: 'Pagado', cls: 'text-bg-info' },
  enviado: { label: 'Enviado', cls: 'text-bg-primary' },
  entregado: { label: 'Entregado', cls: 'text-bg-success' },
  cancelado: { label: 'Cancelado', cls: 'text-bg-danger' },
};

const Profile = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const auth = useAuth();
  const wishlist = useWishlist();
  const { addToCart } = useCart();

  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'profile');

  useEffect(() => {
    const t = searchParams.get('tab');
    if (t) setActiveTab(t);
  }, [searchParams]);

  const [profile, setProfile] = useState({
    nombre: 'Cargando...', apellido: '',
    stl_email: null, emp_email: null,
    stl_username: null, emp_username: null,
    stl_telefono: null, emp_telefono: null,
  });

  const [form, setForm] = useState({ nombre: '', apellido: '', telefono: '' });
  const [editPersonal, setEditPersonal] = useState(false);
  const [savingPersonal, setSavingPersonal] = useState(false);
  const [personalMsg, setPersonalMsg] = useState(null);

  // Dirección
  const [addr, setAddr] = useState({ direccion: '', ciudad: '', pais: '', codigo_postal: '' });
  const [editAddr, setEditAddr] = useState(false);
  const [savingAddr, setSavingAddr] = useState(false);
  const [addrMsg, setAddrMsg] = useState(null);

  // Pedidos
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState(null);

  // Contraseña
  const [pwd, setPwd] = useState({ nueva: '', repetir: '' });
  const [pwdMsg, setPwdMsg] = useState(null);
  const [pwdSaving, setPwdSaving] = useState(false);

  const email = useMemo(() => profile.stl_email || profile.emp_email || 'N/A', [profile]);
  const username = useMemo(() => profile.stl_username || profile.emp_username || 'N/A', [profile]);
  const telefono = useMemo(() => profile.stl_telefono || profile.emp_telefono || 'N/A', [profile]);

  const isCustomer = auth.userType === 'customer' || !auth.userType;

  const fetchProfile = async () => {
    try {
      const data = await authService.getProfile();
      setProfile((prev) => ({ ...prev, ...data }));
      setForm({
        nombre: data.nombre || '',
        apellido: data.apellido || '',
        telefono: data.stl_telefono || data.emp_telefono || '',
      });
    } catch (error) {
      console.error('Error al cargar el perfil:', error);
      if (error.status === 401) navigate('/login');
    }
  };

  const fetchAddress = async () => {
    if (!isCustomer) return;
    try {
      const res = await addressService.getMine();
      if (res?.data) setAddr({
        direccion: res.data.direccion || '',
        ciudad: res.data.ciudad || '',
        pais: res.data.pais || '',
        codigo_postal: res.data.codigo_postal || '',
      });
    } catch (error) {
      console.error('Error al cargar dirección:', error);
    }
  };

  const fetchOrders = async () => {
    if (!isCustomer) return;
    setOrdersLoading(true);
    setOrdersError(null);
    try {
      const res = await ordersCustomerService.getOrders();
      setOrders(res?.data || []);
    } catch (error) {
      console.error('Error al cargar pedidos:', error);
      setOrdersError('No se pudieron cargar tus pedidos.');
    } finally {
      setOrdersLoading(false);
    }
  };

  useEffect(() => {
    if (!localStorage.getItem('accessToken')) {
      navigate('/login');
      return;
    }
    fetchProfile();
    fetchAddress();
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const savePersonal = async () => {
    setSavingPersonal(true);
    setPersonalMsg(null);
    try {
      await authService.updateProfile({
        nombre: form.nombre,
        apellido: form.apellido,
        telefono: form.telefono,
      });
      await fetchProfile();
      setEditPersonal(false);
      setPersonalMsg({ type: 'success', text: 'Datos actualizados correctamente.' });
    } catch (error) {
      setPersonalMsg({ type: 'danger', text: error.message || 'No se pudo guardar.' });
    } finally {
      setSavingPersonal(false);
    }
  };

  const saveAddress = async () => {
    if (!addr.direccion.trim() || !addr.ciudad.trim() || !addr.pais.trim()) {
      setAddrMsg({ type: 'danger', text: 'Dirección, ciudad y país son obligatorios.' });
      return;
    }
    setSavingAddr(true);
    setAddrMsg(null);
    try {
      await addressService.saveMine(addr);
      setEditAddr(false);
      setAddrMsg({ type: 'success', text: 'Dirección guardada.' });
    } catch (error) {
      setAddrMsg({ type: 'danger', text: error.message || 'No se pudo guardar la dirección.' });
    } finally {
      setSavingAddr(false);
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    setPwdMsg(null);
    if (pwd.nueva.length < 6) {
      setPwdMsg({ type: 'danger', text: 'La contraseña debe tener al menos 6 caracteres.' });
      return;
    }
    if (pwd.nueva !== pwd.repetir) {
      setPwdMsg({ type: 'danger', text: 'Las contraseñas no coinciden.' });
      return;
    }
    setPwdSaving(true);
    try {
      await authService.updateProfile({ password: pwd.nueva });
      setPwd({ nueva: '', repetir: '' });
      setPwdMsg({ type: 'success', text: 'Contraseña actualizada correctamente.' });
    } catch (error) {
      setPwdMsg({ type: 'danger', text: error.message || 'No se pudo cambiar la contraseña.' });
    } finally {
      setPwdSaving(false);
    }
  };

  const renderStatus = (estado) => {
    const s = ORDER_STATUS[estado] || { label: estado, cls: 'text-bg-secondary' };
    return <span className={`badge ${s.cls}`}>{s.label}</span>;
  };

  const tabs = [
    { key: 'profile', icon: 'bi-person', label: 'Perfil' },
    { key: 'orders', icon: 'bi-box-seam', label: 'Pedidos' },
    { key: 'favorites', icon: 'bi-heart', label: 'Favoritos' },
    { key: 'settings', icon: 'bi-gear', label: 'Configuración' },
  ];

  return (
    <div className="container pt-5 pb-5 mt-4" style={{ paddingTop: '4rem' }}>
      <h1 className="display-5 fw-bold mb-1">Mi Perfil</h1>
      <p className="lead text-muted mb-4">Gestiona tu cuenta y preferencias</p>

      <ul className="nav nav-pills mb-4 d-flex bg-body-tertiary rounded-pill p-2">
        {tabs.map((t) => (
          <li className="nav-item flex-grow-1" key={t.key}>
            <button
              type="button"
              className={'nav-link w-100 rounded-pill py-2 d-flex align-items-center justify-content-center ' + (activeTab === t.key ? 'active' : '')}
              onClick={() => setActiveTab(t.key)}
            >
              <i className={`bi ${t.icon} me-2 fs-5`} />
              {t.label}
            </button>
          </li>
        ))}
      </ul>

      <div className="tab-content">
        {/* PERFIL */}
        {activeTab === 'profile' && (
          <>
            {/* Información personal */}
            <div className="card shadow-sm border-0 mb-4">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="card-title fw-bold mb-0">Información Personal</h5>
                  {!editPersonal && (
                    <button className="btn btn-sm btn-outline-secondary" onClick={() => setEditPersonal(true)}>
                      <i className="bi bi-pencil me-1" /> Editar
                    </button>
                  )}
                </div>

                {personalMsg && <div className={`alert alert-${personalMsg.type} py-2`}>{personalMsg.text}</div>}

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label text-muted small">Nombre</label>
                    {editPersonal ? (
                      <input className="form-control" value={form.nombre}
                        onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))} />
                    ) : <p className="form-control-plaintext fw-semibold">{profile.nombre}</p>}
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label text-muted small">Apellido</label>
                    {editPersonal ? (
                      <input className="form-control" value={form.apellido}
                        onChange={(e) => setForm((f) => ({ ...f, apellido: e.target.value }))} />
                    ) : <p className="form-control-plaintext fw-semibold">{profile.apellido}</p>}
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label text-muted small">Teléfono</label>
                    {editPersonal ? (
                      <input className="form-control" value={form.telefono}
                        onChange={(e) => setForm((f) => ({ ...f, telefono: e.target.value }))} />
                    ) : <p className="form-control-plaintext fw-semibold">{telefono}</p>}
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label text-muted small">Email</label>
                    <p className="form-control-plaintext fw-semibold">{email}</p>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label text-muted small">Nombre de Usuario</label>
                    <p className="form-control-plaintext fw-semibold">{username}</p>
                  </div>
                </div>

                {editPersonal && (
                  <div className="d-flex justify-content-end mt-2">
                    <button className="btn btn-secondary me-2" onClick={() => { setEditPersonal(false); setPersonalMsg(null); }} disabled={savingPersonal}>Cancelar</button>
                    <button className="btn btn-warning" onClick={savePersonal} disabled={savingPersonal}>
                      {savingPersonal ? 'Guardando...' : 'Guardar'}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Dirección */}
            {isCustomer && (
              <div className="card shadow-sm border-0">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="card-title fw-bold mb-0">Dirección</h5>
                    {!editAddr && (
                      <button className="btn btn-sm btn-outline-secondary" onClick={() => setEditAddr(true)}>
                        <i className="bi bi-pencil me-1" /> Editar
                      </button>
                    )}
                  </div>

                  {addrMsg && <div className={`alert alert-${addrMsg.type} py-2`}>{addrMsg.text}</div>}

                  {!editAddr ? (
                    addr.direccion ? (
                      <p className="mb-0">
                        {addr.direccion}, {addr.ciudad}, {addr.pais}
                        {addr.codigo_postal ? ` (${addr.codigo_postal})` : ''}
                      </p>
                    ) : (
                      <p className="text-muted mb-0">No tienes una dirección registrada.</p>
                    )
                  ) : (
                    <>
                      <div className="row g-3">
                        <div className="col-12">
                          <label className="form-label text-muted small">Dirección *</label>
                          <input className="form-control" value={addr.direccion}
                            onChange={(e) => setAddr((p) => ({ ...p, direccion: e.target.value }))} />
                        </div>
                        <div className="col-md-4">
                          <label className="form-label text-muted small">Ciudad *</label>
                          <input className="form-control" value={addr.ciudad}
                            onChange={(e) => setAddr((p) => ({ ...p, ciudad: e.target.value }))} />
                        </div>
                        <div className="col-md-4">
                          <label className="form-label text-muted small">País *</label>
                          <input className="form-control" value={addr.pais}
                            onChange={(e) => setAddr((p) => ({ ...p, pais: e.target.value }))} />
                        </div>
                        <div className="col-md-4">
                          <label className="form-label text-muted small">Código postal</label>
                          <input className="form-control" value={addr.codigo_postal}
                            onChange={(e) => setAddr((p) => ({ ...p, codigo_postal: e.target.value }))} />
                        </div>
                      </div>
                      <div className="d-flex justify-content-end mt-3">
                        <button className="btn btn-secondary me-2" onClick={() => { setEditAddr(false); setAddrMsg(null); fetchAddress(); }} disabled={savingAddr}>Cancelar</button>
                        <button className="btn btn-warning" onClick={saveAddress} disabled={savingAddr}>
                          {savingAddr ? 'Guardando...' : 'Guardar'}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </>
        )}

        {/* PEDIDOS */}
        {activeTab === 'orders' && (
          <div className="card shadow-sm border-0 p-4">
            <h5 className="card-title fw-bold mb-3">Mis Pedidos</h5>
            {ordersLoading ? (
              <div className="text-center py-4"><div className="spinner-border" role="status" /></div>
            ) : ordersError ? (
              <div className="alert alert-danger mb-0">{ordersError}</div>
            ) : orders.length === 0 ? (
              <div className="alert alert-info mb-0">No has realizado ningún pedido aún.</div>
            ) : (
              <div className="list-group">
                {orders.map((o) => (
                  <div key={o.uuid_pedido} className="list-group-item d-flex justify-content-between align-items-center mb-2 rounded">
                    <div>
                      <h6 className="mb-1 fw-bold">Pedido #{String(o.uuid_pedido).slice(0, 8)}</h6>
                      <small className="text-muted d-block">
                        Fecha: {o.fecha_pedido ? new Date(o.fecha_pedido).toLocaleDateString('es-CL') : '—'}
                      </small>
                      <small className="text-muted">{o.items} artículo(s) · {o.metodo_entrega || 'sin método'}</small>
                    </div>
                    <div className="text-end">
                      <div className="mb-1">{renderStatus(o.estado)}</div>
                      <span className="fw-bold">{formatPrice(o.precio)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* FAVORITOS */}
        {activeTab === 'favorites' && (
          <div className="card shadow-sm border-0 p-4">
            <h5 className="card-title fw-bold mb-3">Mi Lista de Deseos</h5>
            {wishlist.items.length === 0 ? (
              <div className="alert alert-info mb-0">Tu lista de deseos está vacía.</div>
            ) : (
              <div className="row row-cols-1 row-cols-md-3 g-3">
                {wishlist.items.map((item) => {
                  const offer = hasOffer(item);
                  return (
                    <div className="col" key={item.id_producto}>
                      <div className="card h-100">
                        <img
                          src={item.imagen_url || 'https://via.placeholder.com/200x260?text=Sin+imagen'}
                          className="card-img-top" alt={item.nombre}
                          style={{ height: 200, objectFit: 'cover' }}
                        />
                        <div className="card-body d-flex flex-column">
                          <h6 className="card-title fw-bold">{item.nombre}</h6>
                          <p className="card-text text-muted small mb-1">{item.editorial || ''}</p>
                          <p className="fw-bold mb-3">
                            {offer ? (
                              <>
                                <span className="text-decoration-line-through text-muted me-2 small">{formatPrice(item.precio)}</span>
                                <span className="text-danger">{formatPrice(item.precio_oferta)}</span>
                              </>
                            ) : formatPrice(item.precio)}
                          </p>
                          <div className="mt-auto d-flex justify-content-between gap-2">
                            <button className="btn btn-sm btn-outline-success flex-grow-1"
                              onClick={() => addToCart(item)}>
                              <i className="bi bi-cart-plus me-1" /> Carrito
                            </button>
                            <button className="btn btn-sm btn-outline-danger"
                              onClick={() => wishlist.remove(item.id_producto)}>
                              <i className="bi bi-trash3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* CONFIGURACIÓN */}
        {activeTab === 'settings' && (
          <div className="card shadow-sm border-0 p-4">
            <h5 className="card-title fw-bold mb-3">Cambiar Contraseña</h5>
            {pwdMsg && <div className={`alert alert-${pwdMsg.type} py-2`}>{pwdMsg.text}</div>}
            <form onSubmit={changePassword} style={{ maxWidth: 420 }}>
              <div className="mb-3">
                <label className="form-label text-muted small">Nueva contraseña</label>
                <input type="password" className="form-control" value={pwd.nueva}
                  onChange={(e) => setPwd((p) => ({ ...p, nueva: e.target.value }))} required />
              </div>
              <div className="mb-3">
                <label className="form-label text-muted small">Repetir contraseña</label>
                <input type="password" className="form-control" value={pwd.repetir}
                  onChange={(e) => setPwd((p) => ({ ...p, repetir: e.target.value }))} required />
              </div>
              <button type="submit" className="btn btn-warning" disabled={pwdSaving}>
                {pwdSaving ? 'Guardando...' : 'Actualizar contraseña'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
