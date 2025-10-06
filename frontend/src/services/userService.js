import api from './api';

const handleError = (error) => {
  const message =
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    'حدث خطأ غير متوقع';
  console.error('API Error:', message);
  throw new Error(message);
};

export const getUsers = async () => {
  try {
    const res = await api.get('/users');
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const getUserById = async (id, token) => {
  try {
    const res = await api.get(`/users/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const createUser = async (data, token) => {
  try {
    const res = await api.post('/users', data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const updateUser = async (id, data, token) => {
  try {
    const res = await api.put(`/users/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const deleteUser = async (id, token) => {
  try {
    const res = await api.delete(`/users/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    handleError(error);
  }
};
