'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Box,
  Container,
  Typography,
  CircularProgress,
  Paper,
  Button,
} from '@mui/material';
import { getCustomerById, deleteCustomer } from '@/services/customerService';
import CustomerCard from '@/components/customers/CustomerCard';

export default function CustomerDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCustomerById(id)
      .then((res) => setCustomer(res.data || res))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!confirm('هل تريد حذف العميل؟')) return;
    try {
      await deleteCustomer(id);
      alert('تم الحذف');
      router.push('/customers');
    } catch (err) {
      console.error(err);
      alert('خطأ');
    }
  };

  if (loading)
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );

  if (!customer)
    return (
      <Container>
        <Typography>لم يتم العثور على العميل</Typography>
      </Container>
    );

  return (
    <Box sx={{ minHeight: '100vh', py: 6 }}>
      <Container maxWidth='md'>
        <CustomerCard customer={customer} />
        <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
          <Button variant='contained' href={`/customers/${id}/edit`}>
            تعديل
          </Button>
          <Button variant='outlined' color='error' onClick={handleDelete}>
            حذف
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
