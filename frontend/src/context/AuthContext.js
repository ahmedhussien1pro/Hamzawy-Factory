// src/context/AuthContext.js
'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authAPI } from '@/services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const router = useRouter();
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ استرجاع البيانات من localStorage عند أول تحميل
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (savedToken) setToken(savedToken);
    if (savedUser && savedUser !== 'undefined') {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.warn('Invalid user JSON in localStorage, clearing it.');
        localStorage.removeItem('user');
      }
    }

    setLoading(false);
  }, []);

  // ✅ تسجيل الدخول
  const login = async (identifier, password) => {
    setLoading(true);
    setError(null);

    try {
      const res = await authAPI.login({ identifier, password });
      const { token, user } = res.data?.data || res.data;

      if (!token || !user) {
        throw new Error('بيانات تسجيل الدخول غير صحيحة');
      }

      // حفظهم في localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      setToken(token);
      setUser(user);

      // ✅ توجيه بعد الدخول الناجح
      router.push('/dashboard');
    } catch (err) {
      // نطبع فقط في dev mode مش في الـ console العام
      if (process.env.NODE_ENV === 'development') {
        console.warn('Login error:', err);
      }

      setError(
        err?.response?.data?.error ||
          err?.response?.data?.message ||
          err.message ||
          'خطأ في تسجيل الدخول'
      );
    } finally {
      setLoading(false);
    }
  };

  // ✅ تسجيل الخروج
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider
      value={{ token, user, login, logout, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
