'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Swal from 'sweetalert2';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Paper,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useAuth } from '@/context/AuthContext';
import { getItemCodeById, updateItemCode } from '@/services/itemCodeService';

const theme = createTheme({
  direction: 'rtl',
  palette: {
    primary: { main: '#1e40af', light: '#3b82f6', dark: '#1e3a8a' },
    error: { main: '#dc2626' },
    background: { default: '#f1f5f9', paper: '#ffffff' },
  },
  typography: { fontFamily: '"Inter", "Cairo", "Arial", sans-serif' },
});

export default function EditItemCodePage() {
  const { id } = useParams();
  const router = useRouter();
  const { token } = useAuth();

  const [itemCode, setItemCode] = useState({
    code: '',
    name: '',
    description: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!token) {
      setError('يرجى تسجيل الدخول أولاً.');
      setLoading(false);
      return;
    }

    async function fetchItemCode() {
      try {
        const res = await getItemCodeById(id, token);
        const data = res?.data?.data || res?.data || res;
        setItemCode({
          code: data.code || '',
          name: data.name || '',
          description: data.description || '',
        });
      } catch (err) {
        console.error('Error fetching item code:', err);
        setError('حدث خطأ أثناء جلب بيانات الكود.');
      } finally {
        setLoading(false);
      }
    }

    fetchItemCode();
  }, [id, token]);

  const handleChange = (e) => {
    setItemCode({ ...itemCode, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!itemCode.name.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'تنبيه',
        text: 'يرجى إدخال اسم المنتج.',
        confirmButtonText: 'حسناً',
      });
      return;
    }

    setSaving(true);
    try {
      await updateItemCode(id, itemCode, token);
      await Swal.fire({
        icon: 'success',
        title: 'تم التحديث بنجاح ✅',
        text: 'تم تحديث بيانات المنتج بنجاح.',
        confirmButtonText: 'رجوع إلى الصفحة',
      });
      router.push(`/item-codes/${id}`);
    } catch (err) {
      console.error('Error updating item code:', err);
      Swal.fire({
        icon: 'error',
        title: 'حدث خطأ ❌',
        text: 'حدث خطأ أثناء تحديث البيانات.',
        confirmButtonText: 'حسناً',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
          py: 6,
        }}>
        <Container maxWidth='sm'>
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
          ) : (
            <Paper
              sx={{
                p: 4,
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
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
                  ✏️ تعديل بيانات الكود
                </Typography>

                <Link href={`/item-codes/${id}`} passHref>
                  <Button
                    variant='outlined'
                    startIcon={<ArrowBackIcon />}
                    sx={{ fontWeight: 600, borderRadius: 2 }}>
                    رجوع
                  </Button>
                </Link>
              </Box>

              {/* Form */}
              <form onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label='الكود'
                  name='code'
                  value={itemCode.code}
                  onChange={handleChange}
                  sx={{ mb: 3 }}
                  required
                />

                <TextField
                  fullWidth
                  label='اسم المنتج'
                  name='name'
                  value={itemCode.name}
                  onChange={handleChange}
                  sx={{ mb: 3 }}
                  required
                />

                <TextField
                  fullWidth
                  multiline
                  minRows={3}
                  label='الوصف'
                  name='description'
                  value={itemCode.description}
                  onChange={handleChange}
                  sx={{ mb: 3 }}
                />

                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                  <Button
                    type='submit'
                    variant='contained'
                    color='primary'
                    startIcon={<SaveIcon />}
                    disabled={saving}
                    sx={{
                      px: 5,
                      fontWeight: 600,
                      borderRadius: 2,
                    }}>
                    {saving ? 'جاري الحفظ...' : 'حفظ التعديلات'}
                  </Button>

                  <Button
                    variant='outlined'
                    color='error'
                    onClick={() => router.push(`/item-codes/${id}`)}>
                    إلغاء
                  </Button>
                </Box>
              </form>
            </Paper>
          )}
        </Container>
      </Box>
    </ThemeProvider>
  );
}
