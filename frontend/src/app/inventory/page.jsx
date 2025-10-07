// src/app/inventory/page.jsx
'use client';
import { useEffect, useState, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  TextField,
  Stack,
  InputAdornment,
  IconButton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useAuth } from '@/context/AuthContext';
import { getProducts } from '@/services/productService';
import * as inventoryService from '@/services/inventoryService';

const professionalTheme = createTheme({
  direction: 'rtl',
  palette: {
    primary: { main: '#1e40af' },
    background: { default: '#f1f5f9', paper: '#fff' },
  },
  typography: { fontFamily: '"Inter","Cairo","Arial",sans-serif' },
});

export default function InventoryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productIdFromQuery = searchParams?.get('productId') ?? null;
  const { token } = useAuth();

  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState(null);

  const [movements, setMovements] = useState([]);
  const [movLoading, setMovLoading] = useState(false);
  const [movError, setMovError] = useState(null);

  const [q, setQ] = useState('');

  // fetch products (used for product list and for product meta when showing movements)
  useEffect(() => {
    let mounted = true;
    if (!token) {
      setProductsError('يرجى تسجيل الدخول أولاً.');
      setProductsLoading(false);
      return () => (mounted = false);
    }
    async function fetchProducts() {
      try {
        setProductsLoading(true);
        const res = await getProducts(token);
        const data = Array.isArray(res) ? res : res?.data ?? res;
        if (!mounted) return;
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error loading products:', err);
        if (!mounted) return;
        setProductsError('حدث خطأ أثناء تحميل بيانات المنتجات.');
      } finally {
        if (!mounted) return;
        setProductsLoading(false);
      }
    }
    fetchProducts();
    return () => (mounted = false);
  }, [token]);

  // fetch movements when productId query exists
  useEffect(() => {
    let mounted = true;
    if (!productIdFromQuery) {
      setMovements([]);
      setMovError(null);
      setMovLoading(false);
      return;
    }
    if (!token) {
      setMovError('يرجى تسجيل الدخول أولاً.');
      setMovLoading(false);
      return;
    }

    async function fetchMovements() {
      try {
        setMovLoading(true);
        if (typeof inventoryService.getMovementsByProduct === 'function') {
          const res = await inventoryService.getMovementsByProduct(
            productIdFromQuery,
            token
          );
          const list = res?.data ?? res;
          if (!mounted) return;
          setMovements(Array.isArray(list) ? list : []);
        } else if (typeof inventoryService.getMovements === 'function') {
          const res = await inventoryService.getMovements(token);
          const list = res?.data ?? res;
          if (!mounted) return;
          const arr = Array.isArray(list) ? list : [];
          const filtered = arr.filter(
            (m) =>
              m.productId === productIdFromQuery ||
              m.product?.id === productIdFromQuery
          );
          setMovements(filtered);
        } else {
          throw new Error('خدمة الحركات غير متوفرة في الواجهة الأمامية.');
        }
      } catch (err) {
        console.error('Error loading movements:', err);
        if (!mounted) return;
        setMovError('حدث خطأ أثناء تحميل حركات المنتج.');
      } finally {
        if (!mounted) return;
        setMovLoading(false);
      }
    }

    fetchMovements();
    return () => (mounted = false);
  }, [productIdFromQuery, token]);

  const filteredProducts = useMemo(() => {
    const term = (q || '').trim().toLowerCase();
    if (!term) return products || [];
    return (products || []).filter((p) => {
      const sku = (p.sku || '').toString().toLowerCase();
      const name = (p.name || '').toString().toLowerCase();
      const code = (p.itemCode?.code || '').toString().toLowerCase();
      const id = (p.id || '').toString().toLowerCase();
      return (
        sku.includes(term) ||
        name.includes(term) ||
        code.includes(term) ||
        id.includes(term)
      );
    });
  }, [products, q]);

  const currentProduct = useMemo(
    () => products.find((p) => p.id === productIdFromQuery) || null,
    [products, productIdFromQuery]
  );

  const goToMovements = (pid) => {
    router.push(`/inventory?productId=${pid}`);
  };
  const clearProductFilter = () => {
    router.push('/inventory');
  };

  return (
    <ThemeProvider theme={professionalTheme}>
      <Box
        sx={{
          minHeight: '100vh',
          py: 6,
          px: 2,
          background: 'linear-gradient(135deg,#f8fafc 0%,#e2e8f0 100%)',
        }}
        dir='rtl'>
        <Container maxWidth='lg'>
          {/* Header */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 3,
              gap: 2,
              flexWrap: 'wrap',
            }}>
            <Typography variant='h4' fontWeight={700} color='primary'>
              📦 إدارة المخزون
            </Typography>

            {!productIdFromQuery ? (
              <Stack direction='row' spacing={1} alignItems='center'>
                <TextField
                  size='small'
                  placeholder='ابحث بالاسم أو الكود أو SKU'
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
                        <IconButton size='small' disabled>
                          <SearchIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{ minWidth: 260 }}
                />
                <Link href='/inventory/new' passHref>
                  <Button
                    variant='contained'
                    color='primary'
                    startIcon={<AddIcon />}>
                    إضافة حركة مخزون
                  </Button>
                </Link>
                <Link href='/products' passHref>
                  <Button variant='outlined'>قائمة المنتجات</Button>
                </Link>
              </Stack>
            ) : (
              <Stack direction='row' spacing={1}>
                <Button
                  variant='outlined'
                  startIcon={<ArrowBackIcon />}
                  onClick={clearProductFilter}>
                  رجوع لعرض المنتجات
                </Button>
                <Typography
                  variant='subtitle1'
                  sx={{ alignSelf: 'center', fontWeight: 700 }}>
                  حركات المنتج:{' '}
                  {currentProduct
                    ? `${currentProduct.name}`
                    : productIdFromQuery}
                </Typography>
              </Stack>
            )}
          </Box>

          {/* Content */}
          {productIdFromQuery ? (
            movLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                <CircularProgress />
              </Box>
            ) : movError ? (
              <Alert severity='error'>{movError}</Alert>
            ) : movements.length === 0 ? (
              <Paper sx={{ p: 6, textAlign: 'center' }}>
                <Typography color='text.secondary'>
                  لا توجد حركات مسجلة لهذا المنتج حالياً.
                </Typography>
              </Paper>
            ) : (
              <TableContainer
                component={Paper}
                sx={{ borderRadius: 3, boxShadow: 3, overflowX: 'auto' }}>
                <Table dir='rtl'>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#1e40af' }}>
                      <TableCell
                        sx={{
                          color: 'white',
                          fontWeight: 700,
                          textAlign: 'right',
                        }}>
                        التاريخ
                      </TableCell>
                      <TableCell
                        sx={{
                          color: 'white',
                          fontWeight: 700,
                          textAlign: 'right',
                        }}>
                        النوع
                      </TableCell>
                      <TableCell
                        sx={{
                          color: 'white',
                          fontWeight: 700,
                          textAlign: 'right',
                        }}>
                        السبب
                      </TableCell>
                      <TableCell
                        sx={{
                          color: 'white',
                          fontWeight: 700,
                          textAlign: 'right',
                        }}>
                        الكمية
                      </TableCell>
                      <TableCell
                        sx={{
                          color: 'white',
                          fontWeight: 700,
                          textAlign: 'right',
                        }}>
                        المتبقي بعد الحركة
                      </TableCell>
                      <TableCell
                        sx={{
                          color: 'white',
                          fontWeight: 700,
                          textAlign: 'right',
                        }}>
                        المستخدم
                      </TableCell>
                      <TableCell
                        sx={{
                          color: 'white',
                          fontWeight: 700,
                          textAlign: 'center',
                        }}>
                        تفاصيل
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {movements.map((m) => (
                      <TableRow key={m.id} hover>
                        <TableCell sx={{ textAlign: 'right' }}>
                          {m.createdAt
                            ? new Date(m.createdAt).toLocaleString('ar-EG')
                            : '—'}
                        </TableCell>
                        <TableCell sx={{ textAlign: 'right' }}>
                          {m.type || '—'}
                        </TableCell>
                        <TableCell sx={{ textAlign: 'right' }}>
                          {m.reason || '—'}
                        </TableCell>
                        <TableCell sx={{ textAlign: 'right' }}>
                          {m.quantity ?? '—'}
                        </TableCell>
                        <TableCell sx={{ textAlign: 'right' }}>
                          {m.remainingAfter ?? '—'}
                        </TableCell>
                        <TableCell sx={{ textAlign: 'right' }}>
                          {m.performedBy?.name ||
                            m.performedBy?.email ||
                            m.performedById ||
                            '—'}
                        </TableCell>
                        <TableCell align='center'>
                          <Link href={`/inventory/${m.id}`} passHref>
                            <Button
                              variant='outlined'
                              size='small'
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
            )
          ) : // --- Products view (default) ---
          productsLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
              <CircularProgress />
            </Box>
          ) : productsError ? (
            <Alert severity='error'>{productsError}</Alert>
          ) : filteredProducts.length === 0 ? (
            <Paper sx={{ p: 6, textAlign: 'center' }}>
              <Typography color='text.secondary'>
                لا توجد منتجات مطابقة لبحثك.
              </Typography>
            </Paper>
          ) : (
            <TableContainer
              component={Paper}
              sx={{ borderRadius: 3, boxShadow: 3, overflowX: 'auto' }}>
              <Table dir='rtl'>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#1e40af' }}>
                    <TableCell
                      sx={{
                        color: 'white',
                        fontWeight: 700,
                        textAlign: 'right',
                      }}>
                      الكود
                    </TableCell>
                    <TableCell
                      sx={{
                        color: 'white',
                        fontWeight: 700,
                        textAlign: 'right',
                      }}>
                      الاسم
                    </TableCell>
                    <TableCell
                      sx={{
                        color: 'white',
                        fontWeight: 700,
                        textAlign: 'right',
                      }}>
                      الكمية
                    </TableCell>
                    <TableCell
                      sx={{
                        color: 'white',
                        fontWeight: 700,
                        textAlign: 'right',
                      }}>
                      الحد الأدنى
                    </TableCell>
                    <TableCell
                      sx={{
                        color: 'white',
                        fontWeight: 700,
                        textAlign: 'right',
                      }}>
                      الحالة
                    </TableCell>
                    <TableCell
                      sx={{
                        color: 'white',
                        fontWeight: 700,
                        textAlign: 'center',
                      }}>
                      إجراءات
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredProducts.map((p) => {
                    const qty = typeof p.quantity === 'number' ? p.quantity : 0;
                    const minQ =
                      typeof p.minQuantity === 'number' ? p.minQuantity : 0;
                    const low = minQ > 0 && qty < minQ;
                    const displayCode = p.sku || p.itemCode?.code || p.id;
                    return (
                      <TableRow key={p.id} hover>
                        <TableCell sx={{ textAlign: 'right' }}>
                          {displayCode}
                        </TableCell>
                        <TableCell sx={{ textAlign: 'right' }}>
                          {p.name}
                        </TableCell>
                        <TableCell sx={{ textAlign: 'right' }}>{qty}</TableCell>
                        <TableCell sx={{ textAlign: 'right' }}>
                          {minQ}
                        </TableCell>
                        <TableCell sx={{ textAlign: 'right' }}>
                          {low ? (
                            <Chip label='منخفض' color='error' size='small' />
                          ) : (
                            <Chip label='طبيعي' color='success' size='small' />
                          )}
                        </TableCell>
                        <TableCell align='center'>
                          <Stack
                            direction='row'
                            spacing={1}
                            justifyContent='center'>
                            <Link href={`/products/${p.id}`} passHref>
                              <Button variant='outlined' size='small'>
                                عرض
                              </Button>
                            </Link>

                            <Button
                              variant='contained'
                              size='small'
                              onClick={() => goToMovements(p.id)}>
                              حركات
                            </Button>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Container>
      </Box>
    </ThemeProvider>
  );
}
