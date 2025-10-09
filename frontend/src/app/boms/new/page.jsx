'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Box, Typography, Alert } from '@mui/material';
import BOMForm from '@/components/boms/BOMForm';
import { createBOM } from '@/services/bomService';
import { useAuth } from '@/context/AuthContext';

export default function NewBomPage() {
  const { token } = useAuth();
  const router = useRouter();
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(payload) {
    try {
      setError(null);
      setSaving(true);

      await createBOM(payload, token);

      alert('✅ تم إنشاء الـ BOM بنجاح');
      router.push('/boms');
    } catch (err) {
      console.error('Error creating BOM:', err);
      setError(
        err?.response?.data?.error ||
          err?.response?.data?.message ||
          err?.message ||
          'حدث خطأ أثناء الحفظ.'
      );
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setSaving(false);
    }
  }

  return (
    <Container maxWidth='md' sx={{ py: 4 }} dir='rtl'>
      <Typography variant='h5' mb={2}>
        إنشاء BOM جديد
      </Typography>

      {error && (
        <Alert severity='error' sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <BOMForm onSubmit={handleSubmit} token={token} saving={saving} />
    </Container>
  );
}
