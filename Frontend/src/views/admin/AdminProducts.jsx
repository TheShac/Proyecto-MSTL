// src/views/admin/AdminProducts.jsx
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

const API_URL = 'http://localhost:3000/api/products';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState({});
  const [showModal, setShowModal] = useState(false);

  const token =
    localStorage.getItem('accessToken') ||
    localStorage.getItem('token') ||
    '';

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error('Error al obtener productos');
      const data = await res.json();
      setProducts(data.data || []);
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'No se pudieron cargar los productos.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openModal = (edit = false, product = null) => {
    setIsEditing(edit);
    if (edit && product) {
      setCurrentProduct({ ...product });
    } else {
      setCurrentProduct({
        nombre: '',
        estado: '',
        descripcion: '',
        precio: 0,
        stock: 0,
        editorial: '',
        genero: '',
        imagen_url: '',
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setCurrentProduct({});
  };

  const handleChange = (field) => (e) => {
    const value =
      e.target.type === 'number'
        ? Number(e.target.value)
        : e.target.value;

    setCurrentProduct((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      setCurrentProduct((prev) => ({
        ...prev,
        imagen_url: e.target?.result || '',
      }));
    };
    reader.readAsDataURL(file);
  };

  const saveProduct = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const method = isEditing ? 'PUT' : 'POST';
      const url = isEditing
        ? `${API_URL}/${currentProduct.id_producto}`
        : `${API_URL}/create`;

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify(currentProduct),
      });

      if (!res.ok) throw new Error('Error al guardar producto');

      Swal.fire(
        'Éxito',
        isEditing ? 'Producto actualizado' : 'Producto creado',
        'success'
      );
      closeModal();
      await fetchProducts();
    } catch (err) {
      Swal.fire('Error', err.message, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const deleteProduct = async (id) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
        },
      });

      if (!res.ok) throw new Error('Error al eliminar producto');
      Swal.fire('Eliminado', 'Producto eliminado correctamente', 'success');
      await fetchProducts();
    } catch (err) {
      Swal.fire('Error', err.message, 'error');
    }
  };

  const confirmDelete = async (product) => {
    const result = await Swal.fire({
      title: '¿Eliminar producto?',
      text: `Se eliminará "${product.nombre}"`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, eliminar',
    });

    if (result.isConfirmed) {
      await deleteProduct(product.id_producto);
    }
  };

  return (
    <div className="container py-5" style={{ maxWidth: '1100px' }}>
      {/* Título y botón */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-dark">Gestión de Productos</h2>
        <button
          className="btn btn-warning btn-lg shadow-sm"
          onClick={() => openModal(false)}
        >
          <i className="bi bi-plus-lg"></i> Nuevo Producto
        </button>
      </div>

      {/* Tabla de productos */}
      <div className="card shadow border-0 rounded-4">
        <div className="card-body">
          {isLoading ? (
            <div className="text-center my-5">
              <div className="spinner-border text-warning" role="status" />
              <p className="mt-3">Cargando productos...</p>
            </div>
          ) : (
            <table className="table table-hover align-middle text-center">
              <thead className="table-warning">
                <tr>
                  <th>Nombre</th>
                  <th>Estado</th>
                  <th>Descripción</th>
                  <th>Precio</th>
                  <th>Stock</th>
                  <th>Editorial</th>
                  <th>Género</th>
                  <th>Creado por</th>
                  <th>Modificado por</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id_producto}>
                    <td>{product.nombre}</td>
                    <td>{product.estado}</td>
                    <td>{product.descripcion}</td>
                    <td>
                      $
                      {product.precio != null
                        ? Number(product.precio).toFixed(2)
                        : '0.00'}
                    </td>
                    <td>{product.stock}</td>
                    <td>{product.editorial || 'N/A'}</td>
                    <td>{product.genero || 'N/A'}</td>
                    <td>{product.creado_por || 'N/A'}</td>
                    <td>{product.modificado_por || 'N/A'}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-primary me-2"
                        onClick={() => openModal(true, product)}
                      >
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => confirmDelete(product)}
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}

                {products.length === 0 && (
                  <tr>
                    <td colSpan="10" className="text-muted py-3">
                      No hay productos registrados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content shadow rounded-4 border-0">
              <div className="modal-header bg-warning text-dark">
                <h5 className="modal-title">
                  {isEditing ? 'Editar Producto' : 'Nuevo Producto'}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeModal}
                />
              </div>
              <form onSubmit={saveProduct}>
                <div className="modal-body bg-light">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        Nombre
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        required
                        value={currentProduct.nombre || ''}
                        onChange={handleChange('nombre')}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        Estado
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        required
                        value={currentProduct.estado || ''}
                        onChange={handleChange('estado')}
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label fw-semibold">
                        Descripción
                      </label>
                      <textarea
                        className="form-control"
                        value={currentProduct.descripcion || ''}
                        onChange={handleChange('descripcion')}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        Precio ($)
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        step="0.01"
                        min="0.01"
                        required
                        value={currentProduct.precio ?? ''}
                        onChange={handleChange('precio')}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        Stock
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        min="0"
                        required
                        value={currentProduct.stock ?? ''}
                        onChange={handleChange('stock')}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        Editorial
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={currentProduct.editorial || ''}
                        onChange={handleChange('editorial')}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        Género
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={currentProduct.genero || ''}
                        onChange={handleChange('genero')}
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label fw-semibold">Imagen</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                      {currentProduct.imagen_url && (
                        <div className="mt-2">
                          <img
                            src={currentProduct.imagen_url}
                            alt="Preview"
                            style={{ maxWidth: '150px' }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="modal-footer border-0">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={closeModal}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="btn btn-warning"
                    disabled={isSaving}
                  >
                    {isSaving && (
                      <span className="spinner-border spinner-border-sm me-2" />
                    )}
                    {isEditing
                      ? 'Guardar Cambios'
                      : 'Crear Producto'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
