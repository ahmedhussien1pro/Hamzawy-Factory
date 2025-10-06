'use client';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  Container,
  Box,
  Typography,
  CircularProgress,
  Button,
  Alert,
  Paper,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Link from 'next/link';
import { getUserById, updateUser } from '@/services/userService';
import { useAuth } from '@/context/AuthContext';
import UserForm from '@/components/users/UserForm';

const professionalTheme = createTheme({
  direction: 'rtl',
  palette: {
    primary: { main: '#1e40af', light: '#3b82f6', dark: '#1e3a8a' },
    background: { default: '#f1f5f9', paper: '#ffffff' },
    text: { primary: '#1f2937', secondary: '#6b7280' },
  },
  typography: { fontFamily: '"Inter","Cairo","Arial",sans-serif' },
});

export default function EditUserPage() {
  const { id } = useParams();
  const { token } = useAuth();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      setError('يرجى تسجيل الدخول أولاً لتعديل المستخدم.');
      setLoading(false);
      return;
    }

    async function fetchUser() {
      try {
        const res = await getUserById(id, token);
        setUser(res.data || res);
      } catch (err) {
        console.error('Error fetching user', err);
        setError('حدث خطأ أثناء تحميل بيانات المستخدم.');
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, [id, token]);

  const handleSubmit = async (formData) => {
    setError(null);
    setSuccess(false);
    setSaving(true);

    try {
      await updateUser(id, formData, token);
      setSuccess(true);
      setTimeout(() => router.push(`/users/${id}`), 1000);
    } catch (err) {
      console.error('Error updating user:', err);
      setError(
        err?.response?.data?.error ||
          err?.response?.data?.message ||
          'حدث خطأ أثناء تحديث المستخدم.'
      );
    } finally {
      setSaving(false);
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
                تعديل بيانات المستخدم
              </Typography>
              <Link href={`/users/${id}`} passHref>
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

            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
                <CircularProgress color='primary' />
              </Box>
            ) : error ? (
              <Alert severity='error' sx={{ borderRadius: 2 }}>
                {error}
              </Alert>
            ) : (
              <>
                {success && (
                  <Alert severity='success' sx={{ mb: 3, borderRadius: 2 }}>
                    ✅ تم تحديث المستخدم بنجاح
                  </Alert>
                )}

                <UserForm onSubmit={handleSubmit} initialData={user} />

                {saving && (
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
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
