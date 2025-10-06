'use client';
import { useParams } from 'next/navigation';
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
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Link from 'next/link';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import UserCard from '@/components/users/UserCard';
import { getUserById, deleteUser } from '@/services/userService';
import { useAuth } from '@/context/AuthContext';
import Swal from 'sweetalert2';

const professionalTheme = createTheme({
  direction: 'rtl',
  palette: {
    primary: { main: '#1e40af', light: '#3b82f6', dark: '#1e3a8a' },
    error: { main: '#dc2626' },
    background: { default: '#f1f5f9', paper: '#ffffff' },
  },
  typography: {
    fontFamily: '"Inter","Cairo","Arial",sans-serif',
  },
});

export default function UserDetailsPage() {
  const { id } = useParams();
  const { token } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) {
      setError('يرجى تسجيل الدخول أولاً.');
      setLoading(false);
      return;
    }

    async function fetchUser() {
      try {
        const res = await getUserById(id, token);
        setUser(res?.data?.data || res?.data || res);
      } catch (err) {
        console.error('Error fetching user', err);
        setError('حدث خطأ أثناء جلب بيانات المستخدم.');
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, [id, token]);

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: 'هل أنت متأكد؟',
      text: 'سيتم حذف هذا المستخدم بشكل نهائي!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'نعم، احذف',
      cancelButtonText: 'إلغاء',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      reverseButtons: true, // مناسب أكثر للـ RTL
    });

    if (!result.isConfirmed) return;

    try {
      await deleteUser(id, token);

      await Swal.fire({
        icon: 'success',
        title: 'تم الحذف',
        text: 'تم حذف المستخدم بنجاح.',
        confirmButtonText: 'حسنًا',
      });

      window.location.href = '/users';
    } catch (err) {
      await Swal.fire({
        icon: 'error',
        title: 'خطأ',
        text: 'حدث خطأ أثناء حذف المستخدم. حاول مرة أخرى لاحقًا.',
        confirmButtonText: 'حسنًا',
      });
    }
  };

  return (
    <ThemeProvider theme={professionalTheme}>
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
          py: 6,
          px: 2,
        }}>
        <Container maxWidth='md'>
          {loading ? (
            <Paper
              sx={{
                p: 6,
                borderRadius: 3,
                display: 'flex',
                justifyContent: 'center',
              }}>
              <CircularProgress color='primary' />
            </Paper>
          ) : error ? (
            <Alert severity='error' sx={{ borderRadius: 2 }}>
              {error}
            </Alert>
          ) : user ? (
            <>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 3,
                }}>
                <Typography variant='h5' fontWeight={700} color='primary'>
                  تفاصيل المستخدم
                </Typography>

                <Link href='/users' passHref>
                  <Button
                    variant='outlined'
                    startIcon={<ArrowBackIcon />}
                    sx={{ fontWeight: 600, borderRadius: 2 }}>
                    رجوع
                  </Button>
                </Link>
              </Box>

              <UserCard user={user} />

              <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
                <Link href={`/users/${id}/edit`} passHref>
                  <Button
                    variant='contained'
                    color='primary'
                    startIcon={<EditIcon />}>
                    تعديل
                  </Button>
                </Link>
                <Button
                  variant='outlined'
                  color='error'
                  startIcon={<DeleteIcon />}
                  onClick={handleDelete}>
                  حذف
                </Button>
              </Box>
            </>
          ) : (
            <Typography textAlign='center' color='text.secondary'>
              لم يتم العثور على المستخدم.
            </Typography>
          )}
        </Container>
      </Box>
    </ThemeProvider>
  );
}
