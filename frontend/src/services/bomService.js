// src/services/bomService.js
import api from './api';

export async function getBOMs(token, params = {}) {
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const res = await api.get('/boms', { headers, params });
  const payload = res?.data ?? res;
  if (Array.isArray(payload))
    return {
      items: payload,
      total: payload.length,
      page: 1,
      limit: payload.length,
    };
  if (Array.isArray(payload.items)) return payload;
  return { items: [], total: 0, page: 1, limit: 0 };
}

export async function getBOMById(id, token) {
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const res = await api.get(`/boms/${id}`, { headers });
  return res?.data ?? res;
}

export async function createBOM(payload, token) {
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const res = await api.post('/boms', payload, { headers });
  return res?.data ?? res;
}

export async function updateBOM(id, payload, token) {
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const res = await api.put(`/boms/${id}`, payload, { headers });
  return res?.data ?? res;
}

export async function deleteBOM(id, token) {
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const res = await api.delete(`/boms/${id}`, { headers });
  return res?.data ?? res;
}

export async function computeBOM(id, params, token) {
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const res = await api.post(`/boms/${id}/compute`, { params }, { headers });
  return res?.data ?? res;
}

const bomService = {
  getBOMs,
  getBOMById,
  createBOM,
  updateBOM,
  deleteBOM,
  computeBOM,
};

export default bomService;
