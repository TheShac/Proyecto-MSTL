export const emptyEmployeeForm = {
  uuid_emps: '',
  nombre: '',
  apellido: '',
  username: '',
  email: '',
  telefono: '',
  id_role: '',
  image_profile: null,
};

export const fromRowToForm = (employee) => ({
  uuid_emps: employee.uuid_emps,
  nombre: employee.emp_nombre || '',
  apellido: employee.emp_apellido || '',
  username: employee.emp_username || '',
  email: employee.emp_email || '',
  telefono: employee.emp_telefono || '',
  id_role: employee.id_role ?? '',
  image_profile: employee.emp_image_profile ?? null,
});

export const toCreatePayload = (form) => ({
  username: form.username.trim(),
  email: form.email.trim(),
  nombre: form.nombre.trim(),
  apellido: form.apellido.trim(),
  telefono: (form.telefono || '').trim(),
  image_profile: form.image_profile ?? null,
  id_role: Number(form.id_role),
});

export const toUpdatePayload = (form) => ({
  username: form.username.trim(),
  email: form.email.trim(),
  nombre: form.nombre.trim(),
  apellido: form.apellido.trim(),
  telefono: (form.telefono || '').trim(),
  image_profile: form.image_profile ?? null,
  id_role: Number(form.id_role),
});

export const getRoleLabel = (rawRole) => {
  const map = {
    stl_superadministrador: 'Administrador',
    stl_administrador: 'Administrador',
    stl_emp: 'Empleado',
  };
  return map[rawRole] || rawRole || 'N/A';
};
