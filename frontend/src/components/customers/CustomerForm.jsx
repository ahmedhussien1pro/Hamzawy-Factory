// src/components/customers/CustomerForm.jsx
'use client';
import { useState } from 'react';
import { Box, Grid, TextField, Button } from '@mui/material';

export default function CustomerForm({
  initialData = {},
  onSubmit,
  saving = false,
}) {
  const [form, setForm] = useState({
    name: initialData.name || '',
    phone: initialData.phone || '',
    email: initialData.email || '',
    address: initialData.address || '',
    notes: initialData.notes || '',
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  return (
    <Box
      component='form'
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(form);
      }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label='الاسم'
            name='name'
            value={form.name}
            onChange={handleChange}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label='الهاتف'
            name='phone'
            value={form.phone}
            onChange={handleChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label='البريد الإلكتروني'
            name='email'
            value={form.email}
            onChange={handleChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label='العنوان'
            name='address'
            value={form.address}
            onChange={handleChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label='ملاحظات'
            name='notes'
            value={form.notes}
            onChange={handleChange}
            fullWidth
            multiline
            rows={3}
          />
        </Grid>

        <Grid item xs={12}>
          <Button type='submit' variant='contained' fullWidth disabled={saving}>
            {saving ? 'جاري الحفظ...' : 'حفظ'}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}
