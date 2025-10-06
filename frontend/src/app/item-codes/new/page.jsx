'use client';
import { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  Grid,
  useTheme,
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { createItemCode } from '@/services/itemCodeService';

const professionalTheme = createTheme({
  direction: 'rtl',
  palette: {
    primary: { main: '#1e40af', light: '#3b82f6', dark: '#1e3a8a' },
    error: { main: '#dc2626' },
    background: { default: '#f1f5f9', paper: '#ffffff' },
  },
  typography: {
    fontFamily: '"Inter","Cairo","Arial",sans-serif',
  },
});

export default function CreateItemCodePage() {
  const theme = useTheme();
  const router = useRouter();
  const { token } = useAuth();

  const [form, setForm] = useState({
    code: '',
    name: '',
    unit: '',
    minQuantity: 0,
    notes: '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createItemCode(form, token);
      alert('✅ تم إضافة الكود بنجاح!');
      router.push('/item-codes');
    } catch (err) {
      console.error('Error creating item code:', err);
      alert('❌ حدث خطأ أثناء إضافة الكود');
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
        <Paper
          sx={{
            p: { xs: 2, sm: 4, md: 5 },
            borderRadius: 3,
            boxShadow: 6,
            backgroundColor: 'background.paper',
            maxWidth: 800,
            mx: 'auto',
          }}>
          <Typography
            variant='h5'
            sx={{
              mb: { xs: 3, md: 5 },
              fontWeight: 700,
              color: theme.palette.primary.main,
              textAlign: 'center',
            }}>
            ➕ إضافة كود جديد
          </Typography>

          <Box component='form' onSubmit={handleSubmit}>
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label='الكود'
                  name='code'
                  value={form.code}
                  onChange={handleChange}
                  required
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label='اسم المنتج'
                  name='name'
                  value={form.name}
                  onChange={handleChange}
                  required
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label='الوحدة'
                  name='unit'
                  value={form.unit}
                  onChange={handleChange}
                  placeholder='مثلاً: قطعة / كجم / لتر'
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label='الحد الأدنى للكمية'
                  name='minQuantity'
                  type='number'
                  value={form.minQuantity}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  minRows={3}
                  label='ملاحظات'
                  name='notes'
                  value={form.notes}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item xs={12}>
                <Button
                  type='submit'
                  variant='contained'
                  fullWidth
                  disabled={loading}
                  sx={{
                    py: 2,
                    fontWeight: 700,
                    borderRadius: 2,
                    fontSize: { xs: '0.95rem', md: '1.05rem' },
                    boxShadow: '0 6px 14px rgba(30,64,175,0.25)',
                  }}>
                  {loading ? 'جاري الحفظ...' : 'حفظ الكود'}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Box>
    </ThemeProvider>
  );
}
