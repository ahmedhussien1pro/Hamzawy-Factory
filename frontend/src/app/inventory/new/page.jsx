// src/app/inventory/new/page.jsx
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
  MenuItem,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Autocomplete from '@mui/material/Autocomplete';
import Link from 'next/link';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useAuth } from '@/context/AuthContext';
import { getProducts } from '@/services/productService';
import { createMovement } from '@/services/inventoryService';

const theme = createTheme({
  direction: 'rtl',
  palette: { primary: { main: '#1e40af' }, background: { default: '#f1f5f9' } },
  typography: { fontFamily: '"Inter","Cairo","Arial",sans-serif' },
});

const types = [
  { value: 'IN', label: 'وارد (IN)' },
  { value: 'OUT', label: 'منصرف (OUT)' },
  { value: 'ADJUST', label: 'تعديل (ADJUST)' },
];

const reasons = [
  { value: 'PURCHASE', label: 'شراء' },
  { value: 'SALE_CONSUME', label: 'بيع / استهلاك' },
  { value: 'MANUFACTURE_CONSUME', label: 'استهلاك تصنيع' },
  { value: 'MANUFACTURE_RETURN', label: 'إرجاع تصنيع' },
  { value: 'ADJUSTMENT', label: 'تسوية / تعديل' },
];

export default function NewMovementPage() {
  const { token } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({
    productId: '',
    type: 'IN',
    reason: 'PURCHASE',
    quantity: 1,
    notes: '',
  });

  useEffect(() => {
    if (!token) {
      setError('يرجى تسجيل الدخول أولاً.');
      setLoading(false);
      return;
    }
    async function fetch() {
      try {
        const res = await getProducts(token);
        const data = Array.isArray(res) ? res : res?.data ?? res;
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setError('فشل تحميل قائمة المنتجات.');
      } finally {
        setLoading(false);
      }
    }
    fetch();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.productId) {
      setError('اختر منتج أولاً');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await createMovement(form, token);
      router.push('/inventory');
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || 'حدث خطأ أثناء إنشاء الحركة.');
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
                إضافة حركة مخزون
              </Typography>
              <Link href='/inventory' passHref>
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

            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
              </Box>
            ) : (
              <Box component='form' onSubmit={handleSubmit}>
                <Autocomplete
                  options={products}
                  getOptionLabel={(opt) =>
                    `${opt.sku || (opt.itemCode?.code ?? '')} — ${opt.name}`
                  }
                  onChange={(e, v) =>
                    setForm({ ...form, productId: v ? v.id : '' })
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label='اختر منتج'
                      required
                      margin='normal'
                    />
                  )}
                />

                <TextField
                  select
                  fullWidth
                  label='نوع الحركة'
                  name='type'
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  sx={{ my: 1 }}>
                  {types.map((t) => (
                    <MenuItem key={t.value} value={t.value}>
                      {t.label}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  select
                  fullWidth
                  label='السبب'
                  name='reason'
                  value={form.reason}
                  onChange={(e) => setForm({ ...form, reason: e.target.value })}
                  sx={{ my: 1 }}>
                  {reasons.map((r) => (
                    <MenuItem key={r.value} value={r.value}>
                      {r.label}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  fullWidth
                  label='الكمية'
                  name='quantity'
                  value={form.quantity}
                  onChange={(e) =>
                    setForm({ ...form, quantity: Number(e.target.value) })
                  }
                  type='number'
                  sx={{ my: 1 }}
                />

                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label='ملاحظات'
                  name='notes'
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  sx={{ my: 1 }}
                />

                <Box
                  sx={{
                    display: 'flex',
                    gap: 2,
                    justifyContent: 'center',
                    mt: 2,
                  }}>
                  <Button
                    type='submit'
                    variant='contained'
                    startIcon={<SaveIcon />}
                    disabled={saving}>
                    {saving ? 'جاري الحفظ...' : 'إضافة الحركة'}
                  </Button>
                  <Link href='/inventory'>
                    <Button variant='outlined'>إلغاء</Button>
                  </Link>
                </Box>
              </Box>
            )}
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
