// src/app/products/[id]/edit/page.jsx
'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Swal from 'sweetalert2';
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  CircularProgress,
  Alert,
  MenuItem,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useAuth } from '@/context/AuthContext';
import { getProductById, updateProduct } from '@/services/productService';
import { getItemCodes } from '@/services/itemCodeService';

const theme = createTheme({
  direction: 'rtl',
  palette: {
    primary: { main: '#1e40af' },
    background: { default: '#f1f5f9', paper: '#fff' },
  },
  typography: { fontFamily: '"Inter", "Cairo", "Arial", sans-serif' },
});

export default function EditProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const { token } = useAuth();

  const [form, setForm] = useState({
    sku: '',
    name: '',
    description: '',
    purchasePrice: '',
    salePrice: '',
    quantity: '',
    unit: '',
    itemCodeId: '',
    isManufactured: false,
  });
  const [loading, setLoading] = useState(true);
  const [codesLoading, setCodesLoading] = useState(true);
  const [codes, setCodes] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) {
      setError('يرجى تسجيل الدخول أولاً.');
      setLoading(false);
      setCodesLoading(false);
      return;
    }
    async function fetch() {
      try {
        const [resProduct, resCodes] = await Promise.all([
          getProductById(id, token),
          getItemCodes(token),
        ]);
        const product =
          resProduct?.data?.data || resProduct?.data || resProduct || {};
        setForm({
          sku: product.sku || '',
          name: product.name || '',
          description: product.description || '',
          purchasePrice: product.purchasePrice ?? '',
          salePrice: product.salePrice ?? '',
          quantity: product.quantity ?? '',
          unit: product.unit || '',
          itemCodeId: product.itemCodeId || product.itemCode?.id || '',
          isManufactured: !!product.isManufactured,
        });
        setCodes(resCodes?.data || resCodes || []);
      } catch (err) {
        console.error('Error loading product or codes:', err);
        setError('حدث خطأ أثناء تحميل بيانات المنتج.');
      } finally {
        setLoading(false);
        setCodesLoading(false);
      }
    }
    fetch();
  }, [id, token]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((s) => ({ ...s, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      await Swal.fire({
        icon: 'warning',
        title: 'تنبيه',
        text: 'يرجى إدخال اسم المنتج.',
        confirmButtonText: 'حسناً',
      });
      return;
    }
    setSaving(true);
    try {
      const payload = {
        sku: form.sku || undefined,
        name: form.name,
        description: form.description || undefined,
        purchasePrice: form.purchasePrice
          ? Number(form.purchasePrice)
          : undefined,
        salePrice: form.salePrice ? Number(form.salePrice) : undefined,
        quantity: form.quantity ? parseInt(form.quantity, 10) : 0,
        unit: form.unit || undefined,
        itemCodeId: form.itemCodeId || undefined,
        isManufactured: !!form.isManufactured,
      };
      await updateProduct(id, payload, token);

      await Swal.fire({
        icon: 'success',
        title: 'تم التحديث',
        text: 'تم تحديث المنتج بنجاح.',
        confirmButtonText: 'العودة إلى صفحة المنتج',
      });

      router.push(`/products/${id}`);
    } catch (err) {
      console.error('Error updating product:', err);
      await Swal.fire({
        icon: 'error',
        title: 'خطأ',
        text: 'حدث خطأ أثناء تحديث المنتج.',
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
          background: 'linear-gradient(135deg,#f8fafc 0%,#e2e8f0 100%)',
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
            <Alert severity='error'>{error}</Alert>
          ) : (
            <Paper sx={{ p: 4, borderRadius: 3 }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 3,
                }}>
                <Typography variant='h5' fontWeight={700} color='primary'>
                  ✏️ تعديل المنتج
                </Typography>
                <Link href={`/products/${id}`} passHref>
                  <Button variant='outlined' startIcon={<ArrowBackIcon />}>
                    رجوع
                  </Button>
                </Link>
              </Box>

              <form onSubmit={handleSubmit}>
                <TextField
                  name='sku'
                  label='الكود (SKU)'
                  fullWidth
                  value={form.sku}
                  onChange={handleChange}
                  sx={{ mb: 2 }}
                />
                <TextField
                  name='name'
                  label='اسم المنتج'
                  fullWidth
                  required
                  value={form.name}
                  onChange={handleChange}
                  sx={{ mb: 2 }}
                />
                <TextField
                  name='description'
                  label='الوصف'
                  fullWidth
                  multiline
                  minRows={3}
                  value={form.description}
                  onChange={handleChange}
                  sx={{ mb: 2 }}
                />

                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                  <TextField
                    name='purchasePrice'
                    label='سعر الشراء'
                    type='number'
                    value={form.purchasePrice}
                    onChange={handleChange}
                    sx={{ flex: 1 }}
                  />
                  <TextField
                    name='salePrice'
                    label='سعر البيع'
                    type='number'
                    value={form.salePrice}
                    onChange={handleChange}
                    sx={{ flex: 1 }}
                  />
                </Box>

                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                  <TextField
                    name='quantity'
                    label='الكمية'
                    type='number'
                    value={form.quantity}
                    onChange={handleChange}
                    sx={{ flex: 1 }}
                  />
                  <TextField
                    name='unit'
                    label='الوحدة'
                    value={form.unit}
                    onChange={handleChange}
                    sx={{ flex: 1 }}
                  />
                </Box>

                <TextField
                  select
                  label='كود مرجعي (اختياري)'
                  name='itemCodeId'
                  value={form.itemCodeId}
                  onChange={handleChange}
                  fullWidth
                  sx={{ mb: 3 }}
                  disabled={codesLoading}>
                  <MenuItem value=''>— بدون —</MenuItem>
                  {codes.map((c) => (
                    <MenuItem key={c.id} value={c.id}>
                      {c.code} — {c.name}
                    </MenuItem>
                  ))}
                </TextField>

                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                  <Button
                    type='submit'
                    variant='contained'
                    color='primary'
                    startIcon={<SaveIcon />}
                    disabled={saving}
                    sx={{ px: 5, fontWeight: 700 }}>
                    {saving ? 'جاري الحفظ...' : 'حفظ التعديلات'}
                  </Button>
                  <Link href={`/products/${id}`} passHref>
                    <Button variant='outlined'>إلغاء</Button>
                  </Link>
                </Box>
              </form>
            </Paper>
          )}
        </Container>
      </Box>
    </ThemeProvider>
  );
}
