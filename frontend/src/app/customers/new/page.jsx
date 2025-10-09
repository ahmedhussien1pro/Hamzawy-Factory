'use client';
import { useRouter } from 'next/navigation';
import { Box, Container, Typography, Paper, Alert } from '@mui/material';
import { createCustomer } from '@/services/customerService';
import CustomerForm from '@/components/customers/CustomerForm';

export default function NewCustomerPage() {
  const router = useRouter();
  const handleSubmit = async (data) => {
    try {
      await createCustomer(data);
      alert('تم الإنشاء');
      router.push('/customers');
    } catch (err) {
      console.error(err);
      alert('خطأ أثناء الإنشاء');
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', py: 6 }}>
      <Container maxWidth='sm'>
        <Paper sx={{ p: 4 }}>
          <Typography variant='h5' sx={{ mb: 2 }}>
            إضافة عميل جديد
          </Typography>
          <CustomerForm onSubmit={handleSubmit} />
        </Paper>
      </Container>
    </Box>
  );
}
