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
  Divider,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useAuth } from '@/context/AuthContext';
import * as inventoryService from '@/services/inventoryService';

const theme = createTheme({
  direction: 'rtl',
  palette: {
    primary: { main: '#1e40af', light: '#3b82f6', dark: '#1e3a8a' },
    background: { default: '#f1f5f9', paper: '#ffffff' },
  },
  typography: { fontFamily: '"Inter","Cairo","Arial",sans-serif' },
});

function normalizeResToArray(res) {
  // Accept many shapes and always return array
  if (!res) return [];
  // axios response wrapper
  const payload = res?.data ?? res;
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(payload?.data)) return payload.data;
  // sometimes API returns { items: [...], total... }
  if (payload && typeof payload === 'object' && Array.isArray(payload.items))
    return payload.items;
  return [];
}

export default function InventoryMovementDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { token } = useAuth();

  const [movement, setMovement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) {
      setError('يرجى تسجيل الدخول أولاً.');
      setLoading(false);
      return;
    }

    async function fetchMovement() {
      setLoading(true);
      setError(null);
      setMovement(null);

      try {
        if (typeof inventoryService.getMovementsByProduct === 'function') {
          try {
            const res = await inventoryService.getMovementsByProduct(id, token);
            const payload = res?.data ?? res;
            if (payload && payload.id) {
              setMovement(payload);
              return;
            }
            if (payload && typeof payload === 'object') {
              if (payload.movement && payload.movement.id) {
                setMovement(payload.movement);
                return;
              }
              // items array?
              if (Array.isArray(payload.items)) {
                const found = payload.items.find(
                  (m) => String(m.id) === String(id)
                );
                if (found) {
                  setMovement(found);
                  return;
                }
              }
              if (Array.isArray(payload.data)) {
                const found = payload.data.find(
                  (m) => String(m.id) === String(id)
                );
                if (found) {
                  setMovement(found);
                  return;
                }
              }
            }
            // if not found here, fallthrough to full-list search
            console.log(
              'getMovementsByProduct response (not directly a single object):',
              res
            );
          } catch (err) {
            // don't fail immediately — fall back to list search
            console.warn(
              'getMovementsByProduct failed, falling back to fetching list:',
              err
            );
          }
        }

        // Fallback: fetch movements (may return normalized object { items, ... } )
        if (typeof inventoryService.getMovements === 'function') {
          // call without params (or you can pass higher limit if your service supports)
          const res = await inventoryService.getMovements(token);
          // normalize to an array
          const list = normalizeResToArray(res);
          console.log('Normalized movements list (length):', list.length);
          // find by id (compare as strings)
          const found = list.find((m) => String(m.id) === String(id));
          if (found) {
            setMovement(found);
            return;
          }
        } else if (
          typeof inventoryService.getMovementsByProduct === 'function'
        ) {
          // if only product-specific exists, we don't know productId here; skip
          console.warn(
            'getMovements not available; cannot search across all movements.'
          );
        } else {
          setError('خدمة الحركات غير متوفرة في الواجهة الأمامية.');
          return;
        }

        // not found
        setError('لم يتم العثور على الحركة المطلوبة.');
      } catch (err) {
        console.error('Error fetching movement:', err);
        setError(
          err?.response?.data?.error ||
            err?.response?.data?.message ||
            err?.message ||
            'حدث خطأ أثناء جلب بيانات الحركة.'
        );
      } finally {
        setLoading(false);
      }
    }

    fetchMovement();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, token]);

  const formatDate = (d) => {
    if (!d) return '—';
    try {
      return new Date(d).toLocaleString('ar-EG', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return d;
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
        }}
        dir='rtl'>
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
          ) : movement ? (
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
                  تفاصيل الحركة
                </Typography>

                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Link href='/inventory' passHref>
                    <Button
                      variant='outlined'
                      startIcon={<ArrowBackIcon />}
                      sx={{ fontWeight: 600, borderRadius: 2 }}>
                      رجوع للقائمة
                    </Button>
                  </Link>
                </Box>
              </Box>

              {/* Movement info */}
              <TableContainer
                component={Paper}
                sx={{
                  mb: 3,
                  borderRadius: 3,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                }}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#f1f5f9' }}>
                      <TableCell sx={{ fontWeight: 700 }}>الحقل</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>القيمة</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>معرّف الحركة</TableCell>
                      <TableCell>{movement.id}</TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell>المنتج</TableCell>
                      <TableCell>
                        {movement.product?.name ||
                          movement.product?.sku ||
                          movement.productId ||
                          '—'}{' '}
                        {movement.product?.id ? (
                          <Link
                            href={`/products/${movement.product.id}`}
                            passHref>
                            <Button
                              size='small'
                              variant='text'
                              startIcon={<VisibilityIcon />}>
                              عرض المنتج
                            </Button>
                          </Link>
                        ) : null}
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell>النوع</TableCell>
                      <TableCell>{movement.type || '—'}</TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell>السبب</TableCell>
                      <TableCell>{movement.reason || '—'}</TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell>الكمية</TableCell>
                      <TableCell>{movement.quantity ?? '—'}</TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell>تكلفة الوحدة (التقاط)</TableCell>
                      <TableCell>
                        {movement.unitCostSnapshot != null
                          ? Number(movement.unitCostSnapshot).toFixed(2)
                          : '—'}
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell>المتبقي بعد الحركة</TableCell>
                      <TableCell>{movement.remainingAfter ?? '—'}</TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell>المستخدم الذي نفّذ العملية</TableCell>
                      <TableCell>
                        {movement.performedBy?.name ||
                          movement.performedBy?.email ||
                          movement.performedById ||
                          '—'}
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell>تاريخ التنفيذ</TableCell>
                      <TableCell>{formatDate(movement.createdAt)}</TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell>ملاحظات</TableCell>
                      <TableCell>{movement.notes || '—'}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          ) : (
            <Typography textAlign='center' color='text.secondary'>
              لم يتم العثور على الحركة.
            </Typography>
          )}
        </Container>
      </Box>
    </ThemeProvider>
  );
}
