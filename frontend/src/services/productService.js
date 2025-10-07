// src/services/productService.js
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

const handleError = (error) => {
  console.error(
    'API Error (productService):',
    error.response?.data || error.message || error
  );
  throw (
    error.response?.data || { message: error.message || 'حدث خطأ في الشبكة' }
  );
};

const authHeader = (token) =>
  token ? { Authorization: `Bearer ${token}` } : {};

export async function getProducts(token) {
  try {
    const res = await api.get('/products', { headers: authHeader(token) });
    return res.data?.data ?? res.data ?? res;
  } catch (err) {
    handleError(err);
  }
}

export async function getProductById(id, token) {
  try {
    const res = await api.get(`/products/${id}`, {
      headers: authHeader(token),
    });
    return res;
  } catch (err) {
    handleError(err);
  }
}

export async function createProduct(data, token) {
  try {
    const res = await api.get('/products', { headers: authHeader(token) });

    return res.data?.data ?? res.data ?? res;
  } catch (err) {
    handleError(err);
  }
}

export async function updateProduct(id, data, token) {
  try {
    const res = await api.put(`/products/${id}`, data, {
      headers: authHeader(token),
    });
    return res;
  } catch (err) {
    handleError(err);
  }
}

export async function deleteProduct(id, token) {
  try {
    const res = await api.delete(`/products/${id}`, {
      headers: authHeader(token),
    });
    return res;
  } catch (err) {
    handleError(err);
  }
}
export async function searchProducts(query) {
  const res = await api.get('/products', { params: { q: query } });
  return res.data?.data ?? res.data ?? res;
}
