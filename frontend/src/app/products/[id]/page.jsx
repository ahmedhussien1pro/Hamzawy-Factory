// src/app/products/[id]/page.jsx
'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Swal from 'sweetalert2';
import {
  Box,
  Container,
  Typography,
  CircularProgress,
  Button,
  Alert,
  Paper,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useAuth } from '@/context/AuthContext';
import { getProductById, deleteProduct } from '@/services/productService';

const theme = createTheme({
  direction: 'rtl',
  palette: {
    primary: { main: '#1e40af', light: '#3b82f6', dark: '#1e3a8a' },
    error: { main: '#dc2626' },
    background: { default: '#f1f5f9', paper: '#ffffff' },
  },
  typography: { fontFamily: '"Inter", "Cairo", "Arial", sans-serif' },
});

export default function ProductDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { token } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) {
      setError('يرجى تسجيل الدخول أولاً.');
      setLoading(false);
      return;
    }
    async function fetch() {
      try {
        const res = await getProductById(id, token);
        setProduct(res?.data?.data || res?.data || res);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('حدث خطأ أثناء جلب بيانات المنتج.');
      } finally {
        setLoading(false);
      }
    }
    fetch();
  }, [id, token]);

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: 'هل أنت متأكد؟',
      text: 'هل تريد حذف هذا المنتج نهائيًا؟',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'نعم، احذفه',
      cancelButtonText: 'إلغاء',
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    try {
      await deleteProduct(id, token);
      await Swal.fire({
        icon: 'success',
        title: 'تم الحذف',
        text: 'تم حذف المنتج بنجاح.',
        confirmButtonText: 'حسناً',
      });
      router.push('/products');
    } catch (err) {
      console.error(err);
      await Swal.fire({
        icon: 'error',
        title: 'حدث خطأ',
        text: 'حدث خطأ أثناء حذف المنتج.',
        confirmButtonText: 'حسناً',
      });
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg,#f8fafc 0%,#e2e8f0 100%)',
          py: 6,
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
          ) : product ? (
            <>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 3,
                }}>
                <Typography variant='h5' fontWeight={700} color='primary'>
                  تفاصيل المنتج
                </Typography>
                <Link href='/products' passHref>
                  <Button
                    variant='outlined'
                    startIcon={<ArrowBackIcon />}
                    sx={{ fontWeight: 600 }}>
                    رجوع
                  </Button>
                </Link>
              </Box>

              <TableContainer component={Paper} sx={{ mb: 4, borderRadius: 3 }}>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700 }}>
                        الكود (SKU)
                      </TableCell>
                      <TableCell>
                        {product.sku || (product.itemCode?.code ?? '-')}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700 }}>الاسم</TableCell>
                      <TableCell>{product.name}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700 }}>الوصف</TableCell>
                      <TableCell>{product.description || '—'}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700 }}>الكمية</TableCell>
                      <TableCell>{product.quantity ?? 0}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700 }}>الوحدة</TableCell>
                      <TableCell>{product.unit || '-'}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700 }}>سعر الشراء</TableCell>
                      <TableCell>
                        {product.purchasePrice
                          ? Number(product.purchasePrice).toFixed(2)
                          : '-'}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700 }}>سعر البيع</TableCell>
                      <TableCell>
                        {product.salePrice
                          ? Number(product.salePrice).toFixed(2)
                          : '-'}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700 }}>
                        مُرتبط بكود
                      </TableCell>
                      <TableCell>
                        {product.itemCode?.code
                          ? `${product.itemCode.code} — ${product.itemCode.name}`
                          : '-'}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700 }}>
                        تاريخ الإضافة
                      </TableCell>
                      <TableCell>
                        {product.createdAt
                          ? new Date(product.createdAt).toLocaleDateString(
                              'ar-EG'
                            )
                          : '-'}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>

              <Box sx={{ display: 'flex', gap: 2 }}>
                <Link href={`/products/${id}/edit`} passHref>
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
              لم يتم العثور على المنتج.
            </Typography>
          )}
        </Container>
      </Box>
    </ThemeProvider>
  );
}
