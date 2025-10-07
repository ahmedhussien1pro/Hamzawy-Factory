'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
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
  TableCell,
  TableContainer,
  TableRow,
  TableHead,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useAuth } from '@/context/AuthContext';
import { getItemCodeById, deleteItemCode } from '@/services/itemCodeService';

const theme = createTheme({
  direction: 'rtl',
  palette: {
    primary: { main: '#1e40af', light: '#3b82f6', dark: '#1e3a8a' },
    error: { main: '#dc2626' },
    background: { default: '#f1f5f9', paper: '#ffffff' },
  },
  typography: {
    fontFamily: '"Inter", "Cairo", "Arial", sans-serif',
  },
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
        setError('حدث خطأ أثناء جلب بيانات الكود.');
      } finally {
        setLoading(false);
      }
    }

    fetchItemCode();
  }, [id, token]);

  const handleDelete = async () => {
    if (!confirm('هل أنت متأكد من حذف هذا الكود؟')) return;
    try {
      await deleteItemCode(id, token);
      alert('تم حذف الكود بنجاح');
      router.push('/item-codes');
    } catch (err) {
      console.error(err);
      alert('حدث خطأ أثناء حذف الكود');
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
          py: 6,
          px: 2,
        }}>
        <Container maxWidth='lg'>
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
          ) : itemCode ? (
            <>
              {/* Header */}
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

              <TableContainer
                component={Paper}
                sx={{
                  mb: 5,
                  borderRadius: 3,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  overflow: 'hidden',
                }}>
                <Table dir='rtl'>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#f1f5f9' }}>
                      <TableCell sx={{ fontWeight: 700 }}>العنصر</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>القيمة</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>رقم الكود</TableCell>
                      <TableCell>{itemCode.code}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>الاسم</TableCell>
                      <TableCell>{itemCode.name || 'غير محدد'}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>الوصف</TableCell>
                      <TableCell>{itemCode.description || '—'}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>عدد المنتجات المرتبطة</TableCell>
                      <TableCell>{itemCode.products?.length || 0}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>تاريخ الإنشاء</TableCell>
                      <TableCell>
                        {new Date(itemCode.createdAt).toLocaleDateString(
                          'ar-EG'
                        )}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Table - المنتجات المرتبطة */}
              <Typography
                variant='h6'
                fontWeight={700}
                color='primary'
                sx={{ mb: 2 }}>
                المنتجات المرتبطة بالكود
              </Typography>

              {itemCode.products?.length > 0 ? (
                <TableContainer
                  component={Paper}
                  sx={{
                    borderRadius: 3,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  }}>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: '#f1f5f9' }}>
                        <TableCell sx={{ fontWeight: 700 }}>الكود</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>
                          اسم المنتج
                        </TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>الوحدة</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>
                          الحد الأدنى
                        </TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>ملاحظات</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>التفاصيل</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {itemCode.products.map((p) => (
                        <TableRow key={p.id}>
                          <TableCell>{p.code}</TableCell>
                          <TableCell>{p.name}</TableCell>
                          <TableCell>{p.unit || '-'}</TableCell>
                          <TableCell>{p.minQuantity || '-'}</TableCell>
                          <TableCell>{p.notes || '—'}</TableCell>
                          <TableCell>
                            <Link href={`/products/${p.id}`}>
                              <Button
                                size='small'
                                variant='outlined'
                                startIcon={<VisibilityIcon />}>
                                عرض
                              </Button>
                            </Link>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Paper
                  sx={{
                    textAlign: 'center',
                    py: 5,
                    borderRadius: 3,
                    color: 'text.secondary',
                  }}>
                  لا توجد منتجات مرتبطة بهذا الكود.
                </Paper>
              )}

              {/* Actions */}
              <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
                <Link href={`/item-codes/${id}/edit`} passHref>
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
              لم يتم العثور على الكود.
            </Typography>
          )}
        </Container>
      </Box>
    </ThemeProvider>
  );
}
