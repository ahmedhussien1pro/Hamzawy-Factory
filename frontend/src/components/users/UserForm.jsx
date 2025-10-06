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
  FormControlLabel,
  Switch,
  MenuItem,
} from '@mui/material';

const roles = [
  { value: 'ADMIN', label: 'مدير' },
  { value: 'MANAGER', label: 'مشرف' },
  { value: 'WAREHOUSE_STAFF', label: 'موظف مخزن' },
  { value: 'FACTORY_STAFF', label: 'موظف مصنع' },
  { value: 'ACCOUNTANT', label: 'محاسب' },
  { value: 'SALES', label: 'مبيعات' },
];

export default function UserForm({ onSubmit, initialData = {} }) {
  const theme = useTheme();

  const [form, setForm] = useState({
    name: initialData.name || '',
    email: initialData.email || '',
    phone: initialData.phone || '',
    password: '',
    role: initialData.role || 'WAREHOUSE_STAFF',
    isLocked: initialData.isLocked || false,
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleToggle = (e) => setForm({ ...form, isLocked: e.target.checked });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <Paper
      sx={{
        p: { xs: 2, sm: 4, md: 5 },
        borderRadius: 3,
        boxShadow: 6,
        backgroundColor: 'background.paper',
        maxWidth: 900,
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
        {initialData.id ? '✏️ تعديل مستخدم' : '➕ إضافة مستخدم جديد'}
      </Typography>

      <Box component='form' onSubmit={handleSubmit}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              size='medium'
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
              size='medium'
              label='البريد الإلكتروني'
              name='email'
              type='email'
              value={form.email}
              onChange={handleChange}
              required
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              size='medium'
              label='رقم الهاتف'
              name='phone'
              value={form.phone}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              size='medium'
              label={
                initialData.id ? 'كلمة المرور الجديدة (اختياري)' : 'كلمة المرور'
              }
              name='password'
              type='password'
              value={form.password || ''}
              onChange={handleChange}
              required={!initialData.id}
              InputLabelProps={{ shrink: true }}
              placeholder={
                initialData.id
                  ? 'اتركه فارغًا إذا لا تريد تغيير كلمة المرور'
                  : 'أدخل كلمة المرور'
              }
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              select
              fullWidth
              size='medium'
              label='الدور'
              name='role'
              value={form.role}
              onChange={handleChange}
              required
              InputLabelProps={{ shrink: true }}>
              {roles.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={form.isLocked}
                  onChange={handleToggle}
                  color='error'
                />
              }
              label={form.isLocked ? '🚫 مقفول' : '✅ نشط'}
              sx={{ mt: 1 }}
            />
          </Grid>

          <Grid item xs={12}>
            <Button
              type='submit'
              variant='contained'
              fullWidth
              sx={{
                py: 2,
                fontWeight: 700,
                borderRadius: 2,
                fontSize: { xs: '0.95rem', md: '1.05rem' },
                boxShadow: '0 6px 14px rgba(30,64,175,0.25)',
                '&:hover': {
                  backgroundColor: theme.palette.primary.dark,
                },
              }}>
              {initialData.id ? 'تحديث المستخدم' : 'إنشاء المستخدم'}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
}
