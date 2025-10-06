// frontend/src/app/users/page.jsx
'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Box,
  Container,
  Typography,
  Button,
  CircularProgress,
  TextField,
  Alert,
  Paper,
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import UserTable from '@/components/users/UserTable';
import { getUsers } from '@/services/userService';

const professionalTheme = createTheme({
  direction: 'rtl',
  palette: {
    primary: {
      main: '#1e40af',
      light: '#3b82f6',
      dark: '#1e3a8a',
    },
    success: {
      main: '#059669',
    },
    background: {
      default: '#f1f5f9',
      paper: '#ffffff',
    },
    text: {
      primary: '#1f2937',
      secondary: '#6b7280',
    },
  },
  typography: {
    fontFamily: '"Inter", "Cairo", "Arial", sans-serif',
  },
  shape: {
    borderRadius: 8,
  },
});

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token =
    typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  useEffect(() => {
    let mounted = true;
    async function fetchUsers() {
      setLoading(true);
      setError(null);

      if (!token) {
        setError('مطلوب تسجيل الدخول للوصول إلى قائمة المستخدمين.');
        setLoading(false);
        return;
      }

      try {
        const res = await getUsers(token);
        const data = res?.data?.data ?? res?.data ?? [];
        if (mounted) setUsers(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Users fetch error', err);
        const msg =
          err?.response?.data?.error ||
          err?.response?.data?.message ||
          err?.message ||
          'حدثت مشكلة أثناء جلب المستخدمين';
        if (mounted) setError(msg);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchUsers();
    return () => {
      mounted = false;
    };
  }, [token]);

  const filtered = useMemo(() => {
    if (!query) return users;
    const q = query.trim().toLowerCase();
    return users.filter((u) => {
      return (
        (u.name || '').toLowerCase().includes(q) ||
        (u.email || '').toLowerCase().includes(q) ||
        (u.phone || '').toLowerCase().includes(q) ||
        (u.role || '').toLowerCase().includes(q)
      );
    });
  }, [users, query]);

  return (
    <ThemeProvider theme={professionalTheme}>
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
          py: { xs: 4, md: 8 },
        }}>
        <Container maxWidth='lg'>
          {/* header row */}
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              alignItems: 'center',
              justifyContent: 'space-between',
              flexDirection: { xs: 'column', sm: 'row' },
              mb: 3,
            }}>
            <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
              <Typography
                variant='h4'
                sx={{
                  fontWeight: 700,
                  color: 'primary.main',
                  mb: 0.5,
                }}>
                قائمة المستخدمين
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                إدارة المستخدمين — إضافة، تعديل، عرض الحالة ومحاولات الدخول
              </Typography>
            </Box>

            <Box
              sx={{
                display: 'flex',
                gap: 2,
                width: { xs: '100%', sm: 'auto' },
                mt: { xs: 2, sm: 0 },
                alignItems: 'center',
              }}>
              <TextField
                placeholder='ابحث بالاسم، البريد، رقم الهاتف أو الدور'
                size='small'
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                sx={{
                  backgroundColor: 'background.paper',
                  borderRadius: 1,
                  width: { xs: '100%', sm: 360 },
                }}
                inputProps={{ style: { textAlign: 'right' } }}
              />

              <Link href='/users/create' passHref>
                <Button
                  variant='contained'
                  sx={{
                    whiteSpace: 'nowrap',
                    px: 3,
                    py: { xs: '8px', md: '10px' },
                    boxShadow: '0 6px 14px rgba(30,64,175,0.12)',
                  }}>
                  إضافة مستخدم
                </Button>
              </Link>
            </Box>
          </Box>

          {/* content */}
          {loading ? (
            <Paper
              sx={{
                p: 6,
                borderRadius: 3,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <CircularProgress color='primary' />
            </Paper>
          ) : error ? (
            <Alert severity='error' sx={{ borderRadius: 2 }}>
              {error}
            </Alert>
          ) : filtered.length === 0 ? (
            <Paper
              sx={{
                p: 6,
                borderRadius: 3,
                textAlign: 'center',
              }}>
              <Typography variant='h6' sx={{ mb: 1 }}>
                لا توجد مستخدمين
              </Typography>
              <Typography color='text.secondary'>
                يمكنك إضافة مستخدم جديد بالضغط على زر "إضافة مستخدم".
              </Typography>
            </Paper>
          ) : (
            <Box>
              <UserTable users={filtered} />
            </Box>
          )}
        </Container>
      </Box>
    </ThemeProvider>
  );
}
