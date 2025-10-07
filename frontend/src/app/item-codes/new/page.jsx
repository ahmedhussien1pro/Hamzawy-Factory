'use client';
import { useState } from 'react';
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
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { createItemCode } from '@/services/itemCodeService';

const professionalTheme = createTheme({
  direction: 'rtl',
  palette: {
    primary: { main: '#1e40af', light: '#3b82f6', dark: '#1e3a8a' },
    background: { default: '#f1f5f9', paper: '#ffffff' },
  },
  typography: { fontFamily: '"Inter", "Cairo", "Arial", sans-serif' },
});

export default function NewItemCodePage() {
  const { token } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({
    code: '',
    name: '',
    unit: '',
    minQuantity: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!form.code || !form.name) {
      setError('يرجى ملء الحقول الإلزامية.');
      return;
    }

    setLoading(true);
    try {
      // ✅ تأكدنا أن minQuantity يتحول لرقم فعلاً
      const payload = {
        ...form,
        minQuantity: form.minQuantity ? Number(form.minQuantity) : 0,
      };

      await createItemCode(payload, token);
      setSuccess(true);

      // تنظيف الفورم بعد الإضافة
      setForm({
        code: '',
        name: '',
        unit: '',
        minQuantity: '',
        notes: '',
      });

      setTimeout(() => router.push('/item-codes'), 1200);
    } catch (err) {
      console.error('Error creating item code:', err);
      setError(
        err?.response?.data?.error ||
          err?.response?.data?.message ||
          'حدث خطأ أثناء إنشاء الكود.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={professionalTheme}>
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
          py: 6,
          px: 2,
        }}>
        <Container maxWidth='sm'>
          <Paper
            elevation={4}
            sx={{
              p: { xs: 3, md: 5 },
              borderRadius: 3,
              backgroundColor: 'background.paper',
            }}>
            {/* Header */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 3,
              }}>
              <Typography variant='h5' fontWeight={700} color='primary'>
                إضافة كود جديد
              </Typography>

              <Link href='/item-codes' passHref>
                <Button
                  variant='outlined'
                  startIcon={<ArrowBackIcon />}
                  sx={{
                    fontWeight: 600,
                    borderRadius: 2,
                    px: 2,
                    py: 0.8,
                  }}>
                  رجوع
                </Button>
              </Link>
            </Box>

            {error && (
              <Alert severity='error' sx={{ mb: 3, borderRadius: 2 }}>
                {error}
              </Alert>
            )}
            {success && (
              <Alert severity='success' sx={{ mb: 3, borderRadius: 2 }}>
                ✅ تم إنشاء الكود بنجاح
              </Alert>
            )}

            <Box component='form' onSubmit={handleSubmit}>
              <TextField
                label='الكود'
                name='code'
                value={form.code}
                onChange={handleChange}
                fullWidth
                required
                margin='normal'
              />

              <TextField
                label='اسم المنتج'
                name='name'
                value={form.name}
                onChange={handleChange}
                fullWidth
                required
                margin='normal'
              />

              <TextField
                label='الوحدة (مثلاً: قطعة / متر)'
                name='unit'
                value={form.unit}
                onChange={handleChange}
                fullWidth
                margin='normal'
              />

              <TextField
                label='الحد الأدنى للكمية'
                name='minQuantity'
                value={form.minQuantity}
                onChange={handleChange}
                type='number'
                fullWidth
                margin='normal'
              />

              <TextField
                label='ملاحظات'
                name='notes'
                value={form.notes}
                onChange={handleChange}
                fullWidth
                margin='normal'
                multiline
                rows={3}
              />

              <Button
                type='submit'
                variant='contained'
                color='primary'
                fullWidth
                disabled={loading}
                sx={{ mt: 3, py: 1.5, fontWeight: 600 }}>
                {loading ? (
                  <>
                    <CircularProgress
                      size={22}
                      sx={{ color: 'white', mr: 1 }}
                    />
                    جاري الحفظ...
                  </>
                ) : (
                  'إضافة الكود'
                )}
              </Button>
            </Box>
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
