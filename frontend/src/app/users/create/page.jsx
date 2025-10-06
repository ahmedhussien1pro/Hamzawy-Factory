'use client';

import { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Paper,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useAuth } from '@/context/AuthContext';
import UserForm from '@/components/users/UserForm';
import { createUser } from '@/services/userService';

const professionalTheme = createTheme({
  direction: 'rtl',
  palette: {
    primary: { main: '#1e40af', light: '#3b82f6', dark: '#1e3a8a' },
    success: { main: '#059669' },
    background: { default: '#f1f5f9', paper: '#ffffff' },
    text: { primary: '#1f2937', secondary: '#6b7280' },
  },
  typography: {
    fontFamily: '"Inter", "Cairo", "Arial", sans-serif',
  },
  shape: { borderRadius: 8 },
});

export default function CreateUserPage() {
  const router = useRouter();
  const { token, loading: authLoading } = useAuth() || {};
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // ⏳ ننتظر الـ AuthContext يجهز
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (!authLoading) setReady(true);
  }, [authLoading]);

  const handleSubmit = async (formData) => {
    setError(null);
    setSuccess(false);

    if (!token) {
      setError('يرجى تسجيل الدخول أولاً لإضافة مستخدم.');
      return;
    }

    setSubmitting(true);
    try {
      await createUser(formData, token);
      setSuccess(true);
      setTimeout(() => router.push('/users'), 1200);
    } catch (err) {
      console.error('Error creating user:', err);
      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err?.message ||
        'حدث خطأ أثناء إضافة المستخدم.';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ThemeProvider theme={professionalTheme}>
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 6,
          px: 2,
        }}>
        <Container maxWidth='sm'>
          <Paper
            elevation={4}
            sx={{
              p: { xs: 3, md: 5 },
              borderRadius: 3,
              backgroundColor: 'background.paper',
            }}>
            {/* Header */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 3,
              }}>
              <Typography variant='h5' fontWeight={700} color='primary'>
                إضافة مستخدم جديد
              </Typography>

              <Link href='/users' passHref>
                <Button
                  variant='outlined'
                  startIcon={<ArrowBackIcon />}
                  sx={{
                    fontWeight: 600,
                    borderRadius: 2,
                    px: 2,
                    py: 0.8,
                  }}>
                  رجوع
                </Button>
              </Link>
            </Box>

            {/* Wait Auth to load */}
            {!ready ? (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  py: 5,
                }}>
                <CircularProgress color='primary' />
              </Box>
            ) : !token ? (
              <Alert severity='warning' sx={{ borderRadius: 2 }}>
                يرجى تسجيل الدخول أولاً لإضافة مستخدم.
              </Alert>
            ) : (
              <>
                {/* Alerts */}
                {error && (
                  <Alert
                    severity='error'
                    sx={{
                      mb: 3,
                      borderRadius: 2,
                      textAlign: 'right',
                    }}>
                    {error}
                  </Alert>
                )}

                {success && (
                  <Alert
                    severity='success'
                    sx={{
                      mb: 3,
                      borderRadius: 2,
                      textAlign: 'right',
                    }}>
                    تم إضافة المستخدم بنجاح 🎉
                  </Alert>
                )}

                {/* Form */}
                <UserForm onSubmit={handleSubmit} />

                {submitting && (
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      mt: 3,
                    }}>
                    <CircularProgress size={26} color='primary' />
                  </Box>
                )}
              </>
            )}
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
