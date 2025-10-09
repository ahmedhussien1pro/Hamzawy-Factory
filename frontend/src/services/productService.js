// src/services/productService.js
import api from './api';
const authHeader = (token) =>
  token ? { Authorization: `Bearer ${token}` } : {};
const unwrap = (res) => {
  const d = res?.data;
  if (Array.isArray(d)) return d;
  if (d?.data && Array.isArray(d.data)) return d.data;
  return d ?? res;
};
export const getProducts = async (params = {}) => {
  try {
    const res = await api.get('/products', { params });
    return unwrap(res);
  } catch (err) {
    console.error(
      'API Error (getProducts):',
      err.response?.data || err.message
    );
    throw err.response?.data || err;
  }
};

export const getProductById = async (id) => {
  try {
    const res = await api.get(`/products/${id}`);
    return res.data?.data ?? res.data ?? res;
  } catch (error) {
    console.error(
      'API Error (getProductById):',
      error.response?.data || error.message
    );
    throw error.response?.data || error;
  }
};

export const createProduct = async (data) => {
  try {
    const res = await api.post('/products', data);
    return res.data?.data ?? res.data ?? res;
  } catch (error) {
    console.error(
      'API Error (createProduct):',
      error.response?.data || error.message
    );
    throw error.response?.data || error;
  }
};

export const updateProduct = async (id, data) => {
  try {
    const res = await api.put(`/products/${id}`, data);
    return res.data?.data ?? res.data ?? res;
  } catch (error) {
    console.error(
      'API Error (updateProduct):',
      error.response?.data || error.message
    );
    throw error.response?.data || error;
  }
};

export const deleteProduct = async (id) => {
  try {
    const res = await api.delete(`/products/${id}`);
    return res.data?.data ?? res.data ?? res;
  } catch (error) {
    console.error(
      'API Error (deleteProduct):',
      error.response?.data || error.message
    );
    throw error.response?.data || error;
  }
};

export const searchProducts = async (query, token) => {
  try {
    const res = await api.get('/products', {
      headers: authHeader(token),
      params: { q: query },
    });
    return res.data?.data ?? res.data ?? res;
  } catch (error) {
    console.error(
      'API Error (searchProducts):',
      error.response?.data || error.message
    );
    throw error.response?.data || error;
  }
};
