'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  CircularProgress,
  Alert,
  Grid,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useAuth } from '@/context/AuthContext';
import { getAllItemCodes, deleteItemCode } from '@/services/itemCodeService';
import ItemCodeCard from '@/components/itemCodes/ItemCodeCard';

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

export default function ItemCodesPage() {
  const { token } = useAuth();
  const [codes, setCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) {
      setError('يرجى تسجيل الدخول أولاً.');
      setLoading(false);
      return;
    }

    async function fetchCodes() {
      try {
        const res = await getAllItemCodes(token);
        setCodes(res?.data?.data || res?.data || []);
      } catch (err) {
        console.error('Error fetching item codes:', err);
        setError('حدث خطأ أثناء تحميل الأكواد.');
      } finally {
        setLoading(false);
      }
    }

    fetchCodes();
  }, [token]);

  const handleDelete = async (id) => {
    if (!confirm('هل أنت متأكد من حذف هذا الكود؟')) return;
    try {
      await deleteItemCode(id, token);
      setCodes(codes.filter((code) => code.id !== id));
      alert('✅ تم حذف الكود بنجاح');
    } catch (err) {
      console.error('Error deleting code:', err);
      alert('❌ حدث خطأ أثناء حذف الكود');
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
        <Container maxWidth='lg'>
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
                mb: 4,
                flexWrap: 'wrap',
                gap: 2,
              }}>
              <Typography
                variant='h5'
                fontWeight={700}
                color='primary'
                textAlign='right'>
                قائمة الأكواد المخزنية
              </Typography>

              <Link href='/item-codes/create' passHref>
                <Button
                  variant='contained'
                  startIcon={<AddIcon />}
                  sx={{
                    fontWeight: 600,
                    borderRadius: 2,
                    px: 3,
                    py: 1,
                  }}>
                  إضافة كود جديد
                </Button>
              </Link>
            </Box>

            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                <CircularProgress color='primary' />
              </Box>
            ) : error ? (
              <Alert severity='error' sx={{ borderRadius: 2 }}>
                {error}
              </Alert>
            ) : codes.length === 0 ? (
              <Typography textAlign='center' color='text.secondary'>
                لا توجد أكواد مسجلة بعد.
              </Typography>
            ) : (
              <Grid container spacing={3}>
                {codes.map((code) => (
                  <Grid item xs={12} sm={6} md={4} key={code.id}>
                    <ItemCodeCard itemCode={code} onDelete={handleDelete} />
                  </Grid>
                ))}
              </Grid>
            )}
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
