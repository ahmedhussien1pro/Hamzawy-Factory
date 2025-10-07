// src/app/products/page.jsx
'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Box,
  Container,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useAuth } from '@/context/AuthContext';
import { getProducts, deleteProduct } from '@/services/productService';

const professionalTheme = createTheme({
  direction: 'rtl',
  palette: {
    primary: { main: '#1e40af', light: '#3b82f6', dark: '#1e3a8a' },
    background: { default: '#f1f5f9', paper: '#ffffff' },
  },
  typography: { fontFamily: '"Inter", "Cairo", "Arial", sans-serif' },
});

export default function ProductsPage() {
  const { token } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  useEffect(() => {
    if (!token) {
      setError('يرجى تسجيل الدخول أولاً.');
      setLoading(false);
      return;
    }

    async function fetchProducts() {
      try {
        const res = await getProducts(token);
        const data = res?.data?.data ?? res?.data ?? res;
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('حدث خطأ أثناء تحميل المنتجات.');
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [token]);

  const handleDelete = async (id) => {
    if (!confirm('هل أنت متأكد من حذف هذا المنتج؟')) return;
    try {
      setDeletingId(id);
      await deleteProduct(id, token);
      setProducts((s) => s.filter((p) => p.id !== id));
      alert('تم حذف المنتج بنجاح');
    } catch (err) {
      console.error('Delete error:', err);
      alert('حدث خطأ أثناء حذف المنتج');
    } finally {
      setDeletingId(null);
    }
  };
  const rows = Array.isArray(products) ? products : [];
  return (
    <ThemeProvider theme={professionalTheme}>
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg,#f8fafc 0%,#e2e8f0 100%)',
          py: 6,
        }}>
        <Container maxWidth='lg'>
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
              🛍️ قائمة المنتجات
            </Typography>

            <Link href='/products/new' passHref>
              <Button
                variant='contained'
                color='primary'
                startIcon={<AddIcon />}
                sx={{ fontWeight: 600, borderRadius: 2 }}>
                إضافة منتج جديد
              </Button>
            </Link>
          </Box>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
              <CircularProgress color='primary' />
            </Box>
          ) : error ? (
            <Alert severity='error'>{error}</Alert>
          ) : products.length === 0 ? (
            <Paper
              sx={{
                textAlign: 'center',
                py: 8,
                borderRadius: 3,
                backgroundColor: 'background.paper',
              }}>
              <Typography variant='h6' color='text.secondary'>
                لا توجد منتجات مسجلة حالياً
              </Typography>
            </Paper>
          ) : (
            <TableContainer
              component={Paper}
              sx={{ borderRadius: 3, overflow: 'hidden', boxShadow: 3 }}>
              <Table>
                <TableHead sx={{ backgroundColor: '#1e40af' }}>
                  <TableRow>
                    <TableCell sx={{ color: 'white', fontWeight: 600 }}>
                      الكود
                    </TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 600 }}>
                      اسم المنتج
                    </TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 600 }}>
                      الكمية
                    </TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 600 }}>
                      الوحدة
                    </TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 600 }}>
                      سعر البيع
                    </TableCell>
                    <TableCell
                      sx={{
                        color: 'white',
                        fontWeight: 600,
                        textAlign: 'center',
                      }}>
                      الإجراءات
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((p) => (
                    <TableRow key={p.id} hover>
                      <TableCell>
                        {p.sku || (p.itemCode?.code ?? p.id)}
                      </TableCell>
                      <TableCell>{p.name}</TableCell>
                      <TableCell>{p.quantity ?? 0}</TableCell>
                      <TableCell>{p.unit || '-'}</TableCell>
                      <TableCell>{p.salePrice || '-'}</TableCell>
                      <TableCell align='center'>
                        <Link href={`/products/${p.id}`}>
                          <Button variant='outlined' color='primary'>
                            عرض
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Container>
      </Box>
    </ThemeProvider>
  );
}
