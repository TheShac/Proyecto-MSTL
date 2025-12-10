// src/views/admin/AdminEmployees.jsx
import React, { useEffect, useState } from 'react';
import { getAllEmployees, createEmployee } from '../../services/EmployeeService';

const AdminEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [roles] = useState([
    { id_role: 1, nombre_rol: 'Administrador' },
    { id_role: 2, nombre_rol: 'Empleado' },
  ]);

  const [currentEmployee, setCurrentEmployee] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const token =
    localStorage.getItem('accessToken') ||
    localStorage.getItem('token') ||
    '';
  
  const getRoleLabel = (rawRole) => {
    if (!rawRole) return 'N/A';
    const map = {
      stl_superadministrador: 'Administrador',
      stl_administrador: 'Administrador',
      stl_emp: 'Empleado',
    };
    return map[rawRole] || rawRole;
  };

  const openModal = (employee = null) => {
    if (employee) {
      // Editar
      setCurrentEmployee(employee);
      setIsEditing(true);
    } else {
      // Crear
      setCurrentEmployee({});
      setIsEditing(false);
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setCurrentEmployee({});
    setIsEditing(false);
  };

  const fetchEmployees = async () => {
    try {
      const data = await getAllEmployees(token);
      setEmployees(data);
    } catch (err) {
      console.error('Error cargando empleados:', err);
    }
  };

  const saveEmployee = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        // Aquí iría la lógica de actualización (PUT)
        // De momento solo mostramos un aviso y cerramos
        console.log('Editar empleado (pendiente de implementar):', currentEmployee);
        alert('Edición de empleado pendiente de implementar en el backend.');
        closeModal();
      } else {
        // Crear nuevo
        await createEmployee(currentEmployee, token);
        await fetchEmployees();
        closeModal();
      }
    } catch (err) {
      console.error(err);
      alert('Error al guardar empleado');
    }
  };

  useEffect(() => {
    fetchEmployees();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (field) => (e) => {
    const value = e.target.value;
    setCurrentEmployee((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="p-4">
      <h2 className="mb-4">Gestión de Empleados</h2>

      {/* Botón Agregar Empleado */}
      <button className="btn btn-warning mb-3" onClick={openModal}>
        <i className="bi bi-person-plus me-2"></i>Agregar Empleado
      </button>

      {/* Tabla de Empleados */}
      <div className="table-responsive">
        <table className="table table-striped">
          <thead className="table-warning">
            <tr>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Usuario</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee.id_emp}>
                <td>{employee.emp_nombre}</td>
                <td>{employee.emp_apellido}</td>
                <td>{employee.emp_username}</td>
                <td>{employee.emp_email}</td>
                <td>{employee.emp_telefono}</td>
                <td>{getRoleLabel(employee.nombre_rol)}</td>
                <td>
                  <button
                    className="btn btn-sm btn-info me-2 d-flex align-items-center gap-1"
                    onClick={() => openModal(employee)}
                  >
                    <i className="bi bi-pencil-square"></i>
                    Editar
                  </button>
                  <button
                    className="btn btn-sm btn-danger d-flex align-items-center gap-1"
                    onClick={() => console.log("Eliminar empleado", employee.id_emp)}
                  >
                    <i className="bi bi-trash3"></i>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}

            {employees.length === 0 && (
              <tr>
                <td colSpan="7" className="text-muted text-center py-3">
                  No hay empleados registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-warning text-dark">
                <h5 className="modal-title">
                  {isEditing ? 'Editar Empleado' : 'Agregar Empleado'}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeModal}
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={saveEmployee}>
                  <div className="mb-3">
                    <label>Nombre</label>
                    <input
                      type="text"
                      className="form-control"
                      required
                      value={currentEmployee.emp_nombre || ''}
                      onChange={handleChange('emp_nombre')}
                    />
                  </div>
                  <div className="mb-3">
                    <label>Apellido</label>
                    <input
                      type="text"
                      className="form-control"
                      required
                      value={currentEmployee.emp_apellido || ''}
                      onChange={handleChange('emp_apellido')}
                    />
                  </div>
                  <div className="mb-3">
                    <label>Usuario</label>
                    <input
                      type="text"
                      className="form-control"
                      required
                      value={currentEmployee.emp_username || ''}
                      onChange={handleChange('emp_username')}
                    />
                  </div>
                  <div className="mb-3">
                    <label>Email</label>
                    <input
                      type="email"
                      className="form-control"
                      required
                      value={currentEmployee.emp_email || ''}
                      onChange={handleChange('emp_email')}
                    />
                  </div>
                  <div className="mb-3">
                    <label>Teléfono</label>
                    <input
                      type="text"
                      className="form-control"
                      value={currentEmployee.emp_telefono || ''}
                      onChange={handleChange('emp_telefono')}
                    />
                  </div>
                  <div className="mb-3">
                    <label>Rol</label>
                    <select
                      className="form-select"
                      required
                      value={currentEmployee.id_role || ''}
                      onChange={handleChange('id_role')}
                    >
                      <option value="" disabled>
                        Selecciona un rol
                      </option>
                      {roles.map((role) => (
                        <option
                          key={role.id_role}
                          value={role.id_role}
                        >
                          {role.nombre_rol}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mt-3 text-end">
                    <button
                      type="button"
                      className="btn btn-secondary me-2"
                      onClick={closeModal}
                    >
                      Cancelar
                    </button>
                    <button type="submit" className="btn btn-warning">
                      {isEditing ? 'Guardar cambios' : 'Crear'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminEmployees;
