import { CustomerModel } from '../models/customer.model.js';

export const getAllCustomers = async () => {
  return CustomerModel.findAll();
};

export const getCustomerById = async (id) => {
  const customer = await CustomerModel.findById(id);
  if (!customer) throw { status: 404, message: 'Cliente no encontrado.' };
  return customer;
};

export const deleteCustomer = async (id) => {
  const affected = await CustomerModel.delete(id);
  if (!affected) throw { status: 404, message: 'Cliente no encontrado.' };
};