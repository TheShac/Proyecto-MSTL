import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Profile = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('profile');

  const [profile, setProfile] = useState({
    nombre: 'Cargando...',
    apellido: '',
    stl_email: null,
    emp_email: null,
    stl_username: null,
    emp_username: null,
    stl_telefono: null,
    emp_telefono: null,
    image_profile: null,
    // Dirección mock
    address: 'No hay dirección registrada',
    city: 'N/A',
    postalCode: 'N/A',
  });

  const [originalProfile, setOriginalProfile] = useState({});
  const [editPersonal, setEditPersonal] = useState(false);
  const [editAddress, setEditAddress] = useState(false);

  // Mock orders
  const [orders] = useState([
    { id: '12345', date: '2023-10-26', total: 25000, status: 'Completado' },
    { id: '12346', date: '2023-10-25', total: 12990, status: 'Pendiente' },
    { id: '12347', date: '2023-10-20', total: 45000, status: 'Completado' },
    { id: '12348', date: '2023-10-18', total: 30000, status: 'Completado' },
    { id: '12349', date: '2023-10-15', total: 18500, status: 'Pendiente' },
  ]);

  const [wishlist, setWishlist] = useState([
    {
      id: 1,
      name: 'Manga: One Piece Vol. 1',
      category: 'Manga / Shonen',
      price: 12990,
      image: 'https://picsum.photos/200/300?random=1',
    },
    {
      id: 2,
      name: 'Figura: Levi Ackerman',
      category: 'Figura / Ataque Titanes',
      price: 55000,
      image: 'https://picsum.photos/200/300?random=2',
    },
  ]);

  // editablePhone equivalente al computed de Vue
  const editablePhone = useMemo(
    () =>
      profile.stl_telefono ??
      profile.emp_telefono ??
      '',
    [profile.stl_telefono, profile.emp_telefono]
  );

  const handlePhoneChange = (e) => {
    const newValue = e.target.value;
    setProfile((prev) => {
      const updated = { ...prev };

      if (prev.stl_telefono !== undefined && prev.stl_telefono !== null) {
        updated.stl_telefono = newValue;
      } else if (
        prev.emp_telefono !== undefined &&
        prev.emp_telefono !== null
      ) {
        updated.emp_telefono = newValue;
      }
      // Si ambos son null, podrías decidir dónde guardarlo, por ahora no hace nada especial
      return updated;
    });
  };

  const fetchProfileData = async () => {
    const token = localStorage.getItem('accessToken');

    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const response = await axios.get(
        'http://localhost:3000/api/auth/profile',
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setProfile((prev) => {
        const merged = {
          ...prev, // mantiene address/city/postalCode mock
          ...response.data,
        };
        setOriginalProfile(merged);
        return merged;
      });
    } catch (error) {
      console.error('Error al cargar el perfil:', error);
      if (error.response?.status === 401) {
        navigate('/login');
      }
    }
  };

  const savePersonal = async () => {
    // TODO: implementar PUT real al backend
    alert(
      'Funcionalidad de guardar datos personales pendiente de conexión al backend.'
    );
    setEditPersonal(false);
  };

  const saveAddress = async () => {
    // TODO: implementar PUT real al backend
    alert(
      'Funcionalidad de guardar dirección pendiente de conexión al backend.'
    );
    setEditAddress(false);
  };

  const cancelEdit = (section) => {
    if (!originalProfile) return;

    if (section === 'personal') {
      setProfile((prev) => ({
        ...prev,
        nombre: originalProfile.nombre,
        apellido: originalProfile.apellido,
        stl_telefono: originalProfile.stl_telefono,
        emp_telefono: originalProfile.emp_telefono,
      }));
      setEditPersonal(false);
    } else if (section === 'address') {
      setProfile((prev) => ({
        ...prev,
        address: originalProfile.address,
        city: originalProfile.city,
        postalCode: originalProfile.postalCode,
      }));
      setEditAddress(false);
    }
  };

  const removeFromWishlist = (itemId) => {
    setWishlist((prev) => prev.filter((item) => item.id !== itemId));
    alert('Producto eliminado de tu lista de deseos.');
  };

  useEffect(() => {
    fetchProfileData();

    // Inicializar originalProfile con los datos de mock de address
    setOriginalProfile((prev) => ({
      ...prev,
      address: profile.address,
      city: profile.city,
      postalCode: profile.postalCode,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className="container pt-5 pb-5 mt-4"
      style={{ paddingTop: '4rem' }}
    >
      <h1 className="display-5 fw-bold text-dark mb-1">Mi Perfil</h1>
      <p className="lead text-muted mb-4">
        Gestiona tu cuenta y preferencias
      </p>

      {/* Tabs */}
      <ul className="nav nav-pills mb-4 d-flex bg-light rounded-pill p-2">
        {/* Perfil */}
        <li className="nav-item flex-grow-1" role="presentation">
          <button
            type="button"
            className={
              'nav-link w-100 rounded-pill py-2 text-dark d-flex align-items-center justify-content-center ' +
              (activeTab === 'profile' ? 'active bg-white shadow-sm' : '')
            }
            onClick={() => setActiveTab('profile')}
          >
            {profile.image_profile ? (
              <img
                src={profile.image_profile}
                alt="Foto de Perfil"
                className="rounded-circle me-2"
                style={{
                  width: '24px',
                  height: '24px',
                  objectFit: 'cover',
                }}
              />
            ) : (
              <i className="bi bi-person me-2 fs-5"></i>
            )}
            Perfil
          </button>
        </li>

        {/* Pedidos */}
        <li className="nav-item flex-grow-1" role="presentation">
          <button
            type="button"
            className={
              'nav-link w-100 rounded-pill py-2 text-dark d-flex align-items-center justify-content-center ' +
              (activeTab === 'orders' ? 'active bg-white shadow-sm' : '')
            }
            onClick={() => setActiveTab('orders')}
          >
            <i className="bi bi-box-seam me-2 fs-5"></i>
            Pedidos
          </button>
        </li>

        {/* Favoritos */}
        <li className="nav-item flex-grow-1" role="presentation">
          <button
            type="button"
            className={
              'nav-link w-100 rounded-pill py-2 text-dark d-flex align-items-center justify-content-center ' +
              (activeTab === 'favorites' ? 'active bg-white shadow-sm' : '')
            }
            onClick={() => setActiveTab('favorites')}
          >
            <i className="bi bi-heart me-2 fs-5"></i>
            Favoritos
          </button>
        </li>

        {/* Configuración */}
        <li className="nav-item flex-grow-1" role="presentation">
          <button
            type="button"
            className={
              'nav-link w-100 rounded-pill py-2 text-dark d-flex align-items-center justify-content-center ' +
              (activeTab === 'settings' ? 'active bg-white shadow-sm' : '')
            }
            onClick={() => setActiveTab('settings')}
          >
            <i className="bi bi-gear me-2 fs-5"></i>
            Configuración
          </button>
        </li>
      </ul>

      {/* Contenido de tabs */}
      <div className="tab-content">
        {/* TAB: Perfil */}
        {activeTab === 'profile' && (
          <div className="tab-pane fade show active">
            {/* Info personal */}
            <div className="card shadow-sm border-0 mb-4">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="card-title fw-bold mb-0">
                    Información Personal
                  </h5>
                  <button
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => setEditPersonal((v) => !v)}
                  >
                    Editar
                  </button>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label text-muted small">
                      Nombre completo
                    </label>
                    {editPersonal ? (
                      <input
                        type="text"
                        className="form-control"
                        value={profile.nombre || ''}
                        onChange={(e) =>
                          setProfile((prev) => ({
                            ...prev,
                            nombre: e.target.value,
                          }))
                        }
                      />
                    ) : (
                      <p className="form-control-plaintext fw-semibold">
                        {profile.nombre} {profile.apellido}
                      </p>
                    )}
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label text-muted small">
                      Email
                    </label>
                    <p className="form-control-plaintext fw-semibold">
                      {profile.stl_email ||
                        profile.emp_email ||
                        'N/A'}
                    </p>
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label text-muted small">
                      Teléfono
                    </label>
                    {editPersonal ? (
                      <input
                        type="text"
                        className="form-control"
                        value={editablePhone}
                        onChange={handlePhoneChange}
                      />
                    ) : (
                      <p className="form-control-plaintext fw-semibold">
                        {profile.stl_telefono ||
                          profile.emp_telefono ||
                          'N/A'}
                      </p>
                    )}
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label text-muted small">
                      Nombre de Usuario
                    </label>
                    <p className="form-control-plaintext fw-semibold">
                      {profile.stl_username ||
                        profile.emp_username ||
                        'N/A'}
                    </p>
                  </div>
                </div>

                {editPersonal && (
                  <div className="d-flex justify-content-end mt-3">
                    <button
                      className="btn btn-secondary me-2"
                      onClick={() => cancelEdit('personal')}
                    >
                      Cancelar
                    </button>
                    <button
                      className="btn btn-primary"
                      onClick={savePersonal}
                    >
                      Guardar
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Dirección */}
            <div className="card shadow-sm border-0">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="card-title fw-bold mb-0">
                    Dirección Personal
                  </h5>
                  <button
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => setEditAddress((v) => !v)}
                  >
                    Editar
                  </button>
                </div>

                <div className="row">
                  <div className="col-12 mb-3">
                    <label className="form-label text-muted small">
                      Dirección
                    </label>
                    {editAddress ? (
                      <input
                        type="text"
                        className="form-control"
                        value={profile.address || ''}
                        onChange={(e) =>
                          setProfile((prev) => ({
                            ...prev,
                            address: e.target.value,
                          }))
                        }
                      />
                    ) : (
                      <p className="form-control-plaintext fw-semibold">
                        {profile.address}
                      </p>
                    )}
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label text-muted small">
                      Ciudad
                    </label>
                    {editAddress ? (
                      <input
                        type="text"
                        className="form-control"
                        value={profile.city || ''}
                        onChange={(e) =>
                          setProfile((prev) => ({
                            ...prev,
                            city: e.target.value,
                          }))
                        }
                      />
                    ) : (
                      <p className="form-control-plaintext fw-semibold">
                        {profile.city}
                      </p>
                    )}
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label text-muted small">
                      Código Postal
                    </label>
                    {editAddress ? (
                      <input
                        type="text"
                        className="form-control"
                        value={profile.postalCode || ''}
                        onChange={(e) =>
                          setProfile((prev) => ({
                            ...prev,
                            postalCode: e.target.value,
                          }))
                        }
                      />
                    ) : (
                      <p className="form-control-plaintext fw-semibold">
                        {profile.postalCode}
                      </p>
                    )}
                  </div>
                </div>

                {editAddress && (
                  <div className="d-flex justify-content-end mt-3">
                    <button
                      className="btn btn-secondary me-2"
                      onClick={() => cancelEdit('address')}
                    >
                      Cancelar
                    </button>
                    <button
                      className="btn btn-primary"
                      onClick={saveAddress}
                    >
                      Guardar
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB: Orders */}
        {activeTab === 'orders' && (
          <div className="tab-pane fade show active">
            <div className="card shadow-sm border-0 p-4">
              <h5 className="card-title fw-bold mb-3">
                Últimos 10 Pedidos
              </h5>
              {orders.length === 0 ? (
                <div className="alert alert-info mb-0">
                  No has realizado ningún pedido aún.
                </div>
              ) : (
                <div className="list-group">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="list-group-item list-group-item-action d-flex justify-content-between align-items-center mb-2 rounded"
                    >
                      <div>
                        <h6 className="mb-1 fw-bold">
                          Pedido #{order.id}
                        </h6>
                        <small className="text-muted">
                          Fecha: {order.date}
                        </small>
                        <br />
                        <small className="text-muted">
                          Estado:{' '}
                          <span
                            className={
                              order.status === 'Completado'
                                ? 'text-success'
                                : 'text-warning'
                            }
                          >
                            {order.status}
                          </span>
                        </small>
                      </div>
                      <span className="badge bg-primary rounded-pill">
                        $
                        {order.total.toLocaleString('es-CL')}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB: Favorites */}
        {activeTab === 'favorites' && (
          <div className="tab-pane fade show active">
            <div className="card shadow-sm border-0 p-4">
              <h5 className="card-title fw-bold mb-3">
                Mi Lista de Deseos
              </h5>
              {wishlist.length === 0 ? (
                <div className="alert alert-info mb-0">
                  Tu lista de deseos está vacía.
                </div>
              ) : (
                <div className="row row-cols-1 row-cols-md-3 g-3">
                  {wishlist.map((item) => (
                    <div className="col" key={item.id}>
                      <div className="card h-100">
                        <img
                          src={item.image}
                          className="card-img-top"
                          alt={item.name}
                          style={{
                            height: '200px',
                            objectFit: 'cover',
                          }}
                        />
                        <div className="card-body">
                          <h6 className="card-title fw-bold">
                            {item.name}
                          </h6>
                          <p className="card-text text-muted small">
                            {item.category}
                          </p>
                          <p className="fw-bold text-primary">
                            $
                            {item.price.toLocaleString('es-CL')}
                          </p>
                          <div className="d-flex justify-content-between">
                            <button className="btn btn-sm btn-outline-success">
                              Añadir al Carrito
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() =>
                                removeFromWishlist(item.id)
                              }
                            >
                              <i className="bi bi-x-lg"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB: Settings */}
        {activeTab === 'settings' && (
          <div className="tab-pane fade show active">
            <div className="card shadow-sm border-0 p-4">
              <h5 className="card-title fw-bold mb-3">
                Configuración de la Cuenta
              </h5>
              <p className="text-muted">
                Aquí podrás gestionar la configuración de tu cuenta, como
                cambiar la contraseña, notificaciones, etc.
              </p>
              <button className="btn btn-warning">
                Cambiar Contraseña
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
