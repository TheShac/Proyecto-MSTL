import React from "react";
import { getRoleLabel } from '../mappers/employee.mapper';

const EmployeesTable = ({ employees, onEdit, onDelete }) => {
  return (
    <div className="table-responsive">
      <table className="table table-striped align-middle text-center employees-table">
        <thead className="table-warning">
          <tr>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Usuario</th>
            <th>Email</th>
            <th>Teléfono</th>
            <th>Rol</th>
            <th style={{ width: 220 }}>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {employees.map((e) => (
            <tr key={e.uuid_emps}>
              <td>{e.emp_nombre}</td>
              <td>{e.emp_apellido}</td>
              <td>{e.emp_username}</td>
              <td>{e.emp_email}</td>
              <td>{e.emp_telefono || "—"}</td>
              <td>{getRoleLabel(e.nombre_rol)}</td>
              <td className="employees-actions">
                <div className="d-flex justify-content-center gap-2 flex-wrap">
                  <button className="btn btn-sm btn-info" onClick={() => onEdit(e)}>
                    <i className="bi bi-pencil-square me-1"></i>
                    Editar
                  </button>

                  <button className="btn btn-sm btn-danger" onClick={() => onDelete(e)}>
                    <i className="bi bi-trash me-1"></i>
                    Eliminar
                  </button>
                </div>
              </td>
            </tr>
          ))}

          {employees.length === 0 && (
            <tr>
              <td colSpan={7} className="text-muted text-center py-3">
                No se encontraron empleados.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeesTable;
