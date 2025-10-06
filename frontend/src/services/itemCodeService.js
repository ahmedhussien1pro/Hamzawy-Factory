// src/services/itemCodeService.js
import api from './api';

export const getItemCodes = async () => {
  try {
    const res = await api.get('/item-codes');
    return res.data?.data || res.data;
  } catch (error) {
    console.error(
      'API Error (getItemCodes):',
      error.response?.data || error.message
    );
    throw error;
  }
};

export const getItemCodeById = async (id) => {
  try {
    const res = await api.get(`/item-codes/${id}`);
    return res.data?.data || res.data;
  } catch (error) {
    console.error(
      'API Error (getItemCodeById):',
      error.response?.data || error.message
    );
    throw error;
  }
};

export const createItemCode = async (data) => {
  try {
    const res = await api.post('/item-codes', data);
    return res.data?.data || res.data;
  } catch (error) {
    console.error(
      'API Error (createItemCode):',
      error.response?.data || error.message
    );
    throw error;
  }
};

export const updateItemCode = async (id, data) => {
  try {
    const res = await api.put(`/item-codes/${id}`, data);
    return res.data?.data || res.data;
  } catch (error) {
    console.error(
      'API Error (updateItemCode):',
      error.response?.data || error.message
    );
    throw error;
  }
};

export const deleteItemCode = async (id) => {
  try {
    const res = await api.delete(`/item-codes/${id}`);
    return res.data?.data || res.data;
  } catch (error) {
    console.error(
      'API Error (deleteItemCode):',
      error.response?.data || error.message
    );
    throw error;
  }
};
