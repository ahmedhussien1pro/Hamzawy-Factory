// src/components/customers/CustomerCard.jsx
'use client';
import { Box, Typography, Paper } from '@mui/material';

export default function CustomerCard({ customer }) {
  return (
    <Paper sx={{ p: 3, borderRadius: 3 }}>
      <Typography variant='h6' sx={{ mb: 1 }}>
        {customer.name}
      </Typography>
      <Typography variant='body2'>البريد: {customer.email || '—'}</Typography>
      <Typography variant='body2'>الهاتف: {customer.phone || '—'}</Typography>
      <Typography variant='body2'>
        العنوان: {customer.address || '—'}
      </Typography>
      <Typography variant='body2' sx={{ mt: 2, color: 'text.secondary' }}>
        {customer.notes || 'لا توجد ملاحظات.'}
      </Typography>
    </Paper>
  );
}
