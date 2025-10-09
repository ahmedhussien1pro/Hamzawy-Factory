'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Box,
  Container,
  Typography,
  CircularProgress,
  Paper,
} from '@mui/material';
import { getCustomerById, updateCustomer } from '@/services/customerService';
import CustomerForm from '@/components/customers/CustomerForm';

export default function EditCustomerPage() {
  const { id } = useParams();
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getCustomerById(id)
      .then((res) => setData(res.data || res))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (form) => {
    setSaving(true);
    try {
      await updateCustomer(id, form);
      alert('تم التحديث');
      router.push(`/customers/${id}`);
    } catch (err) {
      console.error(err);
      alert('خطأ أثناء التحديث');
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );

  return (
    <Box sx={{ minHeight: '100vh', py: 6 }}>
      <Container maxWidth='sm'>
        <Paper sx={{ p: 4 }}>
          <Typography variant='h5' sx={{ mb: 2 }}>
            تعديل العميل
          </Typography>
          <CustomerForm
            initialData={data}
            onSubmit={handleSubmit}
            saving={saving}
          />
        </Paper>
      </Container>
    </Box>
  );
}
