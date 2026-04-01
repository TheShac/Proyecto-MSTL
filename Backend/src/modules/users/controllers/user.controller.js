import * as UserService from '../services/user.service.js';

export const getAllCustomers = async (req, res) => {
  try {
    const customers = await UserService.getAllCustomers();
    res.json(customers);
  } catch (error) {
    console.error(error);
    const status = error.status ?? 500;
    res.status(status).json({ error: error.message ?? 'Error al obtener los clientes.' });
  }
};

export const getCustomerById = async (req, res) => {
  try {
    const customer = await UserService.getCustomerById(req.params.id);
    res.json(customer);
  } catch (error) {
    console.error(error);
    const status = error.status ?? 500;
    res.status(status).json({ error: error.message ?? 'Error al obtener el cliente.' });
  }
};

export const deleteCustomer = async (req, res) => {
  try {
    await UserService.deleteCustomer(req.params.id);
    res.json({ message: 'Cliente eliminado correctamente.' });
  } catch (error) {
    console.error(error);
    const status = error.status ?? 500;
    res.status(status).json({ error: error.message ?? 'Error al eliminar el cliente.' });
  }
};