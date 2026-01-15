import React, { useEffect, useMemo, useState } from 'react';
import Swal from 'sweetalert2';

import EmployeesTable from './EmployeesTable';
import EmployeeModal from './EmployeeModal';
import EmployeeSearchBar from './EmployeeSearchBar';

import { employeeService } from '../services/employee.service';
import {
  emptyEmployeeForm,
  fromRowToForm,
  toCreatePayload,
  toUpdatePayload,
} from '../mappers/employee.mapper';

const normalizeText = (s) =>
  (s ?? '')
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

const AdminEmployeesPage = () => {
  const token = useMemo(
    () => localStorage.getItem('accessToken') || localStorage.getItem('token') || '',
    []
  );

  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState('');

  const [roles] = useState([
    { id_role: 2, nombre_rol: 'Administrador' },
    { id_role: 1, nombre_rol: 'Empleado' },
  ]);

  const [form, setForm] = useState(emptyEmployeeForm);
  const [errors, setErrors] = useState({});

  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [isSaving, setIsSaving] = useState(false);
  const [deletingUuid, setDeletingUuid] = useState(null);

  const fetchEmployees = async () => {
    const data = await employeeService.list(token);
    const list = Array.isArray(data) ? data : (data?.data || []);
    setEmployees(list);
  };

  useEffect(() => {
    fetchEmployees().catch((err) => {
      console.error(err);
      Swal.fire('Error', 'No se pudieron cargar los empleados', 'error');
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openCreate = () => {
    setIsEditing(false);
    setForm(emptyEmployeeForm);
    setErrors({});
    setShowModal(true);
  };

  const openEdit = (employee) => {
    setIsEditing(true);
    setForm(fromRowToForm(employee));
    setErrors({});
    setShowModal(true);
  };

  const closeModal = () => {
    if (isSaving) return;
    setShowModal(false);
    setIsEditing(false);
    setForm(emptyEmployeeForm);
    setErrors({});
  };

  const onChange = (field) => (e) => {
    let value = e.target.value;
    if (field === 'id_role') value = value === '' ? '' : Number(value);

    setForm((prev) => ({ ...prev, [field]: value }));

    // limpieza del error cuando corrige
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const copy = { ...prev };
      delete copy[field];
      return copy;
    });
  };

  const validate = () => {
    const next = {};

    const nombre = form.nombre.trim();
    const apellido = form.apellido.trim();
    const username = form.username.trim();
    const email = form.email.trim();
    const telefono = (form.telefono || '').trim();
    const id_role = form.id_role;

    if (!nombre) next.nombre = 'El nombre es obligatorio.';
    else if (nombre.length < 2) next.nombre = 'El nombre debe tener al menos 2 caracteres.';

    if (!apellido) next.apellido = 'El apellido es obligatorio.';
    else if (apellido.length < 2) next.apellido = 'El apellido debe tener al menos 2 caracteres.';

    if (!username) next.username = 'El usuario es obligatorio.';
    else if (username.length < 3) next.username = 'El usuario debe tener al menos 3 caracteres.';
    else if (!/^[a-zA-Z0-9._-]+$/.test(username))
      next.username = 'El usuario solo puede tener letras, números, punto, guión y guión bajo.';

    if (!email) next.email = 'El email es obligatorio.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      next.email = 'Ingresa un email válido.';

    if (telefono) {
      if (!/^\d+$/.test(telefono)) next.telefono = 'El teléfono solo debe contener números.';
      else if (telefono.length < 8) next.telefono = 'El teléfono es demasiado corto.';
      else if (telefono.length > 15) next.telefono = 'El teléfono es demasiado largo.';
    }

    if (!id_role) next.id_role = 'Debes seleccionar un rol.';

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSaving(true);
    try {
      if (isEditing) {
        const payload = toUpdatePayload(form);
        await employeeService.update(form.uuid_emps, payload, token);
        await fetchEmployees();
        Swal.fire('Éxito', 'Empleado actualizado correctamente', 'success');
      } else {
        const payload = toCreatePayload(form);
        const res = await employeeService.create(payload, token);
        await fetchEmployees();

        const tempPassword = res?.tempPassword;
        Swal.fire(
          'Éxito',
          tempPassword
            ? `Empleado creado. Contraseña generada: <b>${tempPassword}</b>`
            : 'Empleado creado correctamente.',
          'success'
        );
      }
      closeModal();
    } catch (err) {
      console.error(err);

      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        (isEditing ? 'No se pudo actualizar el empleado.' : 'No se pudo crear el empleado.');

      Swal.fire('Error', msg, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const onDelete = async (employee) => {
    const result = await Swal.fire({
      title: '¿Eliminar empleado?',
      text: `Se eliminará a "${employee.emp_nombre} ${employee.emp_apellido}"`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });

    if (!result.isConfirmed) return;

    setDeletingUuid(employee.uuid_emps);
    try {
      await employeeService.remove(employee.uuid_emps, token);
      await fetchEmployees();
      Swal.fire('Eliminado', 'Empleado eliminado correctamente', 'success');
    } catch (err) {
      console.error(err);
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        'No se pudo eliminar el empleado.';
      Swal.fire('Error', msg, 'error');
    } finally {
      setDeletingUuid(null);
    }
  };

  const filteredEmployees = useMemo(() => {
    const q = normalizeText(search);
    if (!q) return employees;

    return employees.filter((e) => {
      return (
        normalizeText(e.emp_nombre).includes(q) ||
        normalizeText(e.emp_apellido).includes(q) ||
        normalizeText(e.emp_username).includes(q) ||
        normalizeText(e.emp_email).includes(q) ||
        normalizeText(e.emp_telefono).includes(q) ||
        normalizeText(e.nombre_rol).includes(q)
      );
    });
  }, [employees, search]);

  return (
    <div className="container-fluid py-4" style={{ maxWidth: 1400 }}>
      {/* Encabezado + botón arriba, buscador abajo */}
      <EmployeeSearchBar
        title="Gestión de Empleados"
        search={search}
        onSearchChange={setSearch}
        onCreate={openCreate}
      />

      {/* Card contenedor para la tabla */}
      <div className="card shadow border-0 rounded-4 w-100">
        <div className="card-body">
          <EmployeesTable
            employees={filteredEmployees}
            onEdit={openEdit}
            onDelete={onDelete}
            deletingUuid={deletingUuid}
          />
        </div>
      </div>

      <EmployeeModal
        show={showModal}
        isEditing={isEditing}
        form={form}
        roles={roles}
        isSaving={isSaving}
        errors={errors}
        onClose={closeModal}
        onSubmit={onSubmit}
        onChange={onChange}
      />
    </div>
  );
};

export default AdminEmployeesPage;
