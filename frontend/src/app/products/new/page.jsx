'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  CircularProgress,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Link from 'next/link';
import Autocomplete from '@mui/material/Autocomplete';
import { useAuth } from '@/context/AuthContext';
import { getItemCodes } from '@/services/itemCodeService';
import { createProduct } from '@/services/productService';
import Swal from 'sweetalert2';

const theme = createTheme({
  direction: 'rtl',
  palette: {
    primary: { main: '#1e40af', light: '#3b82f6', dark: '#1e3a8a' },
    background: { default: '#f1f5f9', paper: '#fff' },
  },
  typography: { fontFamily: '"Inter","Cairo","Arial",sans-serif' },
});

export default function NewProductPage() {
  const { token } = useAuth();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [codes, setCodes] = useState([]);
  const [loadingCodes, setLoadingCodes] = useState(true);

  const [form, setForm] = useState({
    sku: '',
    name: '',
    description: '',
    quantity: 0,
    unit: '',
    purchasePrice: '',
    salePrice: '',
    itemCodeId: '',
    minQuantity: 0,
    notes: '',
  });

  useEffect(() => {
    if (!token) return setLoadingCodes(false);
    async function fetchCodes() {
      try {
        const res = await getItemCodes(token);
        const data = res?.data?.data ?? res?.data ?? res;
        setCodes(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error fetching item codes:', err);
      } finally {
        setLoadingCodes(false);
      }
    }
    fetchCodes();
  }, [token]);

  const handleSelectCode = (event, value) => {
    if (!value) {
      setForm({
        ...form,
        itemCodeId: '',
        sku: '',
        name: '',
        unit: '',
        minQuantity: 0,
      });
      return;
    }
    if (typeof value === 'string') {
      setForm({ ...form, sku: value });
      return;
    }
    setForm((prev) => ({
      ...prev,
      itemCodeId: value.id,
      sku: value.code || prev.sku,
      name: value.name || prev.name,
      unit: value.unit || prev.unit,
      minQuantity: value.minQuantity ?? prev.minQuantity,
    }));
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      Swal.fire('تنبيه', 'الرجاء إدخال اسم المنتج.', 'warning');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        sku: form.sku || undefined,
        name: form.name,
        description: form.description || undefined,
        quantity: Number(form.quantity) || 0,
        unit: form.unit || undefined,
        purchasePrice: form.purchasePrice
          ? Number(form.purchasePrice)
          : undefined,
        salePrice: form.salePrice ? Number(form.salePrice) : undefined,
        itemCodeId: form.itemCodeId || undefined,
        minQuantity: form.minQuantity ? Number(form.minQuantity) : undefined,
        notes: form.notes || undefined,
      };

      await createProduct(payload, token);
      Swal.fire({
        icon: 'success',
        title: 'تم الحفظ بنجاح!',
        text: 'تم إنشاء المنتج بنجاح.',
        confirmButtonText: 'حسناً',
      }).then(() => router.push('/products'));
    } catch (err) {
      console.error('Error creating product:', err);
      Swal.fire(
        'خطأ',
        err?.response?.data?.message ||
          err?.message ||
          'حدث خطأ أثناء إنشاء المنتج.',
        'error'
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: '100vh',
          py: 6,
          px: 2,
          background: 'linear-gradient(135deg,#f8fafc 0%,#e2e8f0 100%)',
        }}>
        <Container maxWidth='sm'>
          <Paper sx={{ p: 4, borderRadius: 3 }}>
            <Box
              sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant='h5' fontWeight={700} color='primary'>
                ➕ إضافة منتج جديد
              </Typography>
              <Link href='/products' passHref>
                <Button variant='outlined' startIcon={<ArrowBackIcon />}>
                  رجوع
                </Button>
              </Link>
            </Box>

            <Autocomplete
              freeSolo
              options={codes}
              getOptionLabel={(option) =>
                typeof option === 'string'
                  ? option
                  : `${option.code} — ${option.name}`
              }
              loading={loadingCodes}
              onChange={handleSelectCode}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label='بحث عن كود مرجعي أو اكتب كود جديد'
                  variant='outlined'
                  margin='normal'
                  fullWidth
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {loadingCodes ? <CircularProgress size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />

            <Box component='form' onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <TextField
                label='الكود (SKU)'
                name='sku'
                value={form.sku}
                onChange={handleChange}
                fullWidth
                sx={{ mb: 2 }}
              />
              <TextField
                label='اسم المنتج'
                name='name'
                value={form.name}
                onChange={handleChange}
                required
                fullWidth
                sx={{ mb: 2 }}
              />
              <TextField
                label='الوحدة'
                name='unit'
                value={form.unit}
                onChange={handleChange}
                fullWidth
                sx={{ mb: 2 }}
              />
              <TextField
                label='الحد الأدنى'
                name='minQuantity'
                value={form.minQuantity}
                onChange={handleChange}
                type='number'
                fullWidth
                sx={{ mb: 2 }}
              />
              <TextField
                label='الكمية الابتدائية'
                name='quantity'
                value={form.quantity}
                onChange={handleChange}
                type='number'
                fullWidth
                sx={{ mb: 2 }}
              />
              <TextField
                label='سعر الشراء (ج.م)'
                name='purchasePrice'
                value={form.purchasePrice}
                onChange={handleChange}
                type='number'
                fullWidth
                sx={{ mb: 2 }}
              />
              <TextField
                label='سعر البيع (ج.م)'
                name='salePrice'
                value={form.salePrice}
                onChange={handleChange}
                type='number'
                fullWidth
                sx={{ mb: 2 }}
              />
              <TextField
                label='ملاحظات'
                name='notes'
                value={form.notes}
                onChange={handleChange}
                multiline
                rows={3}
                fullWidth
                sx={{ mb: 2 }}
              />

              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                <Button
                  type='submit'
                  variant='contained'
                  color='primary'
                  startIcon={<SaveIcon />}
                  disabled={saving}>
                  {saving ? 'جاري الحفظ...' : 'إنشاء المنتج'}
                </Button>
                <Link href='/products'>
                  <Button variant='outlined'>إلغاء</Button>
                </Link>
              </Box>
            </Box>
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
