'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Box,
  Container,
  Typography,
  Grid,
  Button,
  CircularProgress,
  Alert,
  Paper,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { getItemCodes } from '@/services/itemCodeService';
import ItemCodeCard from '@/components/itemCodes/ItemCodeCard';
import { useAuth } from '@/context/AuthContext';

const professionalTheme = createTheme({
  direction: 'rtl',
  palette: {
    primary: { main: '#1e40af', light: '#3b82f6', dark: '#1e3a8a' },
    background: { default: '#f1f5f9', paper: '#ffffff' },
  },
  typography: { fontFamily: '"Inter", "Cairo", "Arial", sans-serif' },
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
        const res = await getItemCodes(token);
        setCodes(res?.data || res);
      } catch (err) {
        console.error('Error fetching item codes:', err);
        setError('حدث خطأ أثناء تحميل الأكواد.');
      } finally {
        setLoading(false);
      }
    }

    fetchCodes();
  }, [token]);

  return (
    <ThemeProvider theme={professionalTheme}>
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
          py: 6,
        }}>
        <Container maxWidth='lg'>
          {/* Header */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 4,
            }}>
            <Typography
              variant='h4'
              fontWeight={700}
              color='primary'
              sx={{ textAlign: 'right' }}>
              🏷️ أكواد المنتجات
            </Typography>

            <Link href='/item-codes/new' passHref>
              <Button
                variant='contained'
                color='primary'
                startIcon={<AddIcon />}
                sx={{ fontWeight: 600, borderRadius: 2 }}>
                إضافة كود جديد
              </Button>
            </Link>
          </Box>

          {/* Content */}
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
              <CircularProgress color='primary' />
            </Box>
          ) : error ? (
            <Alert severity='error'>{error}</Alert>
          ) : codes.length === 0 ? (
            <Paper
              sx={{
                textAlign: 'center',
                py: 8,
                borderRadius: 3,
                backgroundColor: 'background.paper',
              }}>
              <Typography variant='h6' color='text.secondary'>
                لا توجد أكواد مسجلة حالياً
              </Typography>
            </Paper>
          ) : (
            <Grid container spacing={3}>
              {codes.map((code) => (
                <Grid item xs={12} sm={6} md={4} key={code.id}>
                  <ItemCodeCard itemCode={code} />
                </Grid>
              ))}
            </Grid>
          )}
        </Container>
      </Box>
    </ThemeProvider>
  );
}
