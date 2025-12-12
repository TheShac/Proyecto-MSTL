// src/services/EmployeeService.js
import axios from 'axios';

const API_URL = 'http://localhost:3000/api/employees';

const authHeaders = (token) => ({
  Authorization: token ? `Bearer ${token}` : '',
});

export const getAllEmployees = async (token) => {
  const res = await axios.get(API_URL, { headers: authHeaders(token) });
  return res.data;
};

export const createEmployee = async (payload, token) => {
  const res = await axios.post(API_URL, payload, { headers: authHeaders(token) });
  return res.data;
};

export const updateEmployee = async (uuid_emps, payload, token) => {
  const res = await axios.put(`${API_URL}/${uuid_emps}`, payload, {
    headers: authHeaders(token),
  });
  return res.data;
};

export const deleteEmployee = async (uuid_emps, token) => {
  const res = await axios.delete(`${API_URL}/${uuid_emps}`, {
    headers: authHeaders(token),
  });
  return res.data;
};
