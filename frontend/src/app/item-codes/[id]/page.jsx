'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Container,
  Box,
  Typography,
  CircularProgress,
  Alert,
  Button,
  ThemeProvider,
  createTheme,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ItemCodeCard from '@/components/itemCodes/ItemCodeCard';
import { useAuth } from '@/context/AuthContext';
import { getItemCodeById, deleteItemCode } from '@/services/itemCodeService';
import Link from 'next/link';

const professionalTheme = createTheme({
  direction: 'rtl',
  palette: {
    primary: { main: '#1e40af', light: '#3b82f6', dark: '#1e3a8a' },
    error: { main: '#dc2626' },
    background: { default: '#f1f5f9', paper: '#ffffff' },
  },
  typography: { fontFamily: '"Inter","Cairo","Arial",sans-serif' },
});

export default function ItemCodeDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { token } = useAuth();

  const [itemCode, setItemCode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) {
      setError('يرجى تسجيل الدخول أولاً.');
      setLoading(false);
      return;
    }

    async function fetchItemCode() {
      try {
        const res = await getItemCodeById(id, token);
        setItemCode(res?.data?.data || res?.data || res);
      } catch (err) {
        console.error('Error fetching item code:', err);
        setError('حدث خطأ أثناء تحميل بيانات الكود.');
      } finally {
        setLoading(false);
      }
    }

    fetchItemCode();
  }, [id, token]);

  const handleDelete = async (itemId) => {
    if (!confirm('هل أنت متأكد من حذف هذا الكود؟')) return;
    try {
      await deleteItemCode(itemId, token);
      alert('تم حذف الكود بنجاح ✅');
      router.push('/item-codes');
    } catch (err) {
      console.error('Error deleting code:', err);
      alert('حدث خطأ أثناء الحذف ❌');
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
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
              <CircularProgress color='primary' />
            </Box>
          ) : error ? (
            <Alert severity='error' sx={{ borderRadius: 2 }}>
              {error}
            </Alert>
          ) : itemCode ? (
            <>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 3,
                }}>
                <Typography variant='h5' fontWeight={700} color='primary'>
                  تفاصيل الكود
                </Typography>

                <Link href='/item-codes' passHref>
                  <Button
                    variant='outlined'
                    startIcon={<ArrowBackIcon />}
                    sx={{ fontWeight: 600, borderRadius: 2 }}>
                    رجوع
                  </Button>
                </Link>
              </Box>

              <ItemCodeCard itemCode={itemCode} onDelete={handleDelete} />
            </>
          ) : (
            <Typography textAlign='center' color='text.secondary'>
              لم يتم العثور على الكود المطلوب.
            </Typography>
          )}
        </Container>
      </Box>
    </ThemeProvider>
  );
}
