// src/services/inventoryService.js
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api',
});

function normalizeMovementsResponse(res) {
  if (!res) return { items: [], total: 0, page: 1, limit: 50 };

  const payload = res?.data ?? res;

  if (Array.isArray(payload)) {
    return {
      items: payload,
      total: payload.length,
      page: 1,
      limit: payload.length || 50,
    };
  }

  if (payload && Array.isArray(payload.items)) {
    return {
      items: payload.items,
      total:
        typeof payload.total === 'number'
          ? payload.total
          : payload.items.length,
      page: payload.page ?? 1,
      limit: payload.limit ?? payload.items.length ?? 50,
    };
  }

  if (payload && Array.isArray(payload.data)) {
    return {
      items: payload.data,
      total: payload.data.length,
      page: 1,
      limit: payload.data.length || 50,
    };
  }

  if (payload && payload.data && Array.isArray(payload.data.items)) {
    return {
      items: payload.data.items,
      total:
        typeof payload.data.total === 'number'
          ? payload.data.total
          : payload.data.items.length,
      page: payload.data.page ?? 1,
      limit: payload.data.limit ?? payload.data.items.length ?? 50,
    };
  }

  return { items: [], total: 0, page: 1, limit: 50 };
}

export async function getMovements(token, params = {}) {
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const res = await api.get('/inventory', { headers, params });
  return normalizeMovementsResponse(res);
}

export async function getMovementsByProduct(productId, token) {
  const obj = await getMovements(token, { productId });
  return obj.items;
}

export async function createMovement(payload, token) {
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const res = await api.post('/inventory', payload, { headers });
  const data = res?.data ?? res;
  if (data?.movement) return data.movement;
  if (data?.data && typeof data.data === 'object') return data.data;
  return data;
}

export async function getStock(token) {
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const res = await api.get('/products', { headers });
  const payload = res?.data ?? res;
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.items)) return payload.items;
  return [];
}

const inventoryService = {
  getMovements,
  getMovementsByProduct,
  createMovement,
  getStock,
};

export default inventoryService;
