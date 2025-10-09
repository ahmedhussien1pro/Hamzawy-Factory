// src/services/orderService.js
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

export async function getOrders() {
  try {
    const res = await api.get('/orders');
    return unwrap(res);
  } catch (e) {
    handleError(e, 'getOrders');
  }
}

export async function getOrderById(id) {
  try {
    const res = await api.get(`/orders/${id}`);
    return res?.data?.data ?? res?.data ?? res;
  } catch (e) {
    handleError(e, 'getOrderById');
  }
}

export async function createOrder(data) {
  try {
    const res = await api.post('/orders', data);
    return res?.data?.data ?? res?.data ?? res;
  } catch (e) {
    handleError(e, 'createOrder');
  }
}

export async function updateOrderStatus(id, status) {
  try {
    const res = await api.patch(`/orders/${id}/status`, { status });
    return res?.data?.data ?? res?.data ?? res;
  } catch (e) {
    handleError(e, 'updateOrderStatus');
  }
}

export async function deleteOrder(id) {
  try {
    const res = await api.delete(`/orders/${id}`);
    return res?.data ?? res;
  } catch (e) {
    handleError(e, 'deleteOrder');
  }
}

export default {
  getOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  deleteOrder,
};
