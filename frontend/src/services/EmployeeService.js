import axios from 'axios';

const API_URL = 'http://localhost:3000/api/employees';

// Axios instance opcional (mejor para proyectos grandes)
const api = axios.create({
  baseURL: API_URL,
});

// → Middleware opcional para agregar token automáticamente
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

export const EmployeeService = {
  async getById(uuid) {
    return api.get(`/${uuid}`);
  },

  async update(uuid, employeeData) {
    return api.put(`/${uuid}`, employeeData);
  },

  async delete(uuid) {
    return api.delete(`/${uuid}`);
  },
};

// Funciones sueltas (también válidas)

export const getAllEmployees = async (token) => {
  const response = await axios.get(API_URL, {
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },
  });
  return response.data;
};

export const createEmployee = async (employeeData) => {
  const response = await api.post('/', employeeData);
  return response.data;
};
