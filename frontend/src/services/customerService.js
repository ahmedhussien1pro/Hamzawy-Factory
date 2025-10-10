// src/services/customerService.js
import api from './api';

const unwrap = (res) => {
  const d = res?.data;
  if (Array.isArray(d)) return d;
  if (d?.data && Array.isArray(d.data)) return d.data;
  return d ?? res;
};

const handleError = (err, label = '') => {
  console.error(
    `API Error (${label}):`,
    err.response?.data || err.message || err
  );
  throw err.response?.data || err;
};

export async function getCustomers() {
  try {
    const res = await api.get('/customers');
    return unwrap(res);
  } catch (e) {
    handleError(e, 'getCustomers');
  }
}

export async function getCustomerById(id) {
  try {
    const res = await api.get(`/customers/${id}`);
    const d = res?.data?.data ?? res?.data ?? res;
    return d;
  } catch (e) {
    handleError(e, 'getCustomerById');
  }
}

export async function createCustomer(data) {
  try {
    const res = await api.post('/customers', data);
    return res?.data?.data ?? res?.data ?? res;
  } catch (e) {
    handleError(e, 'createCustomer');
  }
}

export async function updateCustomer(id, data) {
  try {
    const res = await api.put(`/customers/${id}`, data);
    return res?.data?.data ?? res?.data ?? res;
  } catch (e) {
    handleError(e, 'updateCustomer');
  }
}

export async function deleteCustomer(id) {
  try {
    const res = await api.delete(`/customers/${id}`);
    return res?.data ?? res;
  } catch (e) {
    handleError(e, 'deleteCustomer');
  }
}

const customerService = {
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
};

export default customerService;
