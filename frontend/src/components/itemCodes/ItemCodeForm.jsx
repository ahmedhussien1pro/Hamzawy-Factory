'use client';
import { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Grid,
  Paper,
  Typography,
  CircularProgress,
} from '@mui/material';

export default function ItemCodeForm({
  onSubmit,
  initialData = {},
  loading = false,
}) {
  const [form, setForm] = useState({
    code: initialData.code || '',
    name: initialData.name || '',
    unit: initialData.unit || '',
    minQuantity: initialData.minQuantity || 0,
    notes: initialData.notes || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === 'minQuantity' ? parseInt(value || 0) : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <Paper
      elevation={4}
      sx={{
        p: { xs: 3, md: 5 },
        borderRadius: 3,
        backgroundColor: 'background.paper',
      }}>
      <Typography
        variant='h5'
        fontWeight={700}
        color='primary'
        sx={{ mb: 4, textAlign: 'center' }}>
        {initialData.id ? '✏️ تعديل كود منتج' : '➕ إضافة كود منتج جديد'}
      </Typography>

      <Box component='form' onSubmit={handleSubmit}>
        <Grid container spacing={3}>
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
              label='الاسم'
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
              label='الوحدة (مثلاً: كجم - قطعة)'
              name='unit'
              value={form.unit}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              type='number'
              label='الحد الأدنى للكمية'
              name='minQuantity'
              value={form.minQuantity}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              minRows={2}
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
              color='primary'
              fullWidth
              disabled={loading}
              sx={{
                py: 1.5,
                fontWeight: 700,
                fontSize: '1rem',
                borderRadius: 2,
              }}>
              {loading ? (
                <CircularProgress size={26} color='inherit' />
              ) : initialData.id ? (
                'تحديث الكود'
              ) : (
                'إضافة الكود'
              )}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
}
