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
  Alert,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Link from 'next/link';
import Autocomplete from '@mui/material/Autocomplete';
import { useAuth } from '@/context/AuthContext';
import { getItemCodes } from '@/services/itemCodeService';
import { createProduct } from '@/services/productService';

const theme = createTheme({
  direction: 'rtl',
  palette: {
    primary: { main: '#1e40af' },
    background: { default: '#f1f5f9', paper: '#fff' },
  },
  typography: { fontFamily: '"Inter","Cairo","Arial",sans-serif' },
});

export default function NewProductPage() {
  const { token } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [codes, setCodes] = useState([]);
  const [searchLoading, setSearchLoading] = useState(true);

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
    if (!token) {
      setSearchLoading(false);
      return;
    }
    async function fetchCodes() {
      try {
        const res = await getItemCodes(token);
        const data = res?.data?.data ?? res?.data ?? res;
        setCodes(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error fetching item codes', err);
      } finally {
        setSearchLoading(false);
      }
    }
    fetchCodes();
  }, [token]);

  const handleSelectCode = (event, value) => {
    // value can be a full itemCode object or a string (free input)
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
      // user typed a free string (use as SKU)
      setForm({ ...form, sku: value, itemCodeId: '', name: form.name });
      return;
    }
    // value is an object (itemCode)
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
    setError(null);
    // basic validation
    if (!form.name.trim()) {
      setError('الرجاء إدخال اسم المنتج.');
      return;
    }
    setSaving(true);
    try {
      // prepare payload
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
      router.push('/products');
    } catch (err) {
      console.error('Error creating product', err);
      setError(
        err?.response?.data?.message ||
          err?.message ||
          'حدث خطأ أثناء إنشاء المنتج.'
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
                إضافة منتج جديد
              </Typography>
              <Link href='/products' passHref>
                <Button variant='outlined' startIcon={<ArrowBackIcon />}>
                  رجوع
                </Button>
              </Link>
            </Box>

            {error && (
              <Alert severity='error' sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <Autocomplete
              freeSolo
              options={codes}
              getOptionLabel={(option) =>
                typeof option === 'string'
                  ? option
                  : option.code + ' — ' + option.name
              }
              loading={searchLoading}
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
                        {searchLoading ? <CircularProgress size={20} /> : null}
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
                label='سعر الشراء'
                name='purchasePrice'
                value={form.purchasePrice}
                onChange={handleChange}
                type='number'
                fullWidth
                sx={{ mb: 2 }}
              />
              <TextField
                label='سعر البيع'
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
