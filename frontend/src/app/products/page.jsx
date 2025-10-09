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
import Swal from 'sweetalert2';

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
    async function fetch() {
      try {
        const res = await getProducts();
        setProducts(res); // بعد توحيد الإرجاع في service
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('حدث خطأ أثناء تحميل المنتجات.');
      } finally {
        setLoading(false);
      }
    }
    fetch();
  }, [token]);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'هل أنت متأكد؟',
      text: 'لن يمكنك التراجع بعد الحذف!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'نعم، احذف',
      cancelButtonText: 'إلغاء',
      confirmButtonColor: '#d33',
    });

    if (!result.isConfirmed) return;

    try {
      setDeletingId(id);
      await deleteProduct(id);
      setProducts((s) => s.filter((p) => p.id !== id));
      Swal.fire('تم الحذف', 'تم حذف المنتج بنجاح', 'success');
    } catch (err) {
      console.error('Delete error:', err);
      Swal.fire('خطأ', 'حدث خطأ أثناء حذف المنتج', 'error');
    } finally {
      setDeletingId(null);
    }
  };

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
                      الوحدة
                    </TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 600 }}>
                      الكمية
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
                  {products.map((p) => (
                    <TableRow key={p.id} hover>
                      <TableCell sx={{ py: 1.5 }}>
                        {p.sku || (p.itemCode?.code ?? p.id)}
                      </TableCell>
                      <TableCell sx={{ py: 1.5 }}>{p.name}</TableCell>
                      <TableCell sx={{ py: 1.5 }}>{p.unit || '-'}</TableCell>
                      <TableCell sx={{ py: 1.5 }}>{p.quantity ?? 0}</TableCell>
                      <TableCell sx={{ py: 1.5 }}>
                        {p.salePrice
                          ? `${Number(p.salePrice).toFixed(2)} ج.م`
                          : '-'}
                      </TableCell>
                      <TableCell align='center'>
                        <Box
                          sx={{
                            display: 'flex',
                            gap: 1,
                            justifyContent: 'center',
                          }}>
                          <Link href={`/products/${p.id}`} passHref>
                            <Button
                              size='small'
                              variant='outlined'
                              sx={{ borderRadius: 2, fontWeight: 600 }}>
                              عرض
                            </Button>
                          </Link>
                          <Link href={`/products/${p.id}/edit`} passHref>
                            <Button
                              size='small'
                              variant='contained'
                              color='primary'
                              sx={{ borderRadius: 2, fontWeight: 600 }}>
                              تعديل
                            </Button>
                          </Link>
                          <Button
                            size='small'
                            variant='outlined'
                            color='error'
                            onClick={() => handleDelete(p.id)}
                            disabled={deletingId === p.id}>
                            {deletingId === p.id ? 'جارٍ الحذف...' : 'حذف'}
                          </Button>
                        </Box>
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
