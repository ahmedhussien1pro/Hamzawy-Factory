'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Box,
  Container,
  Typography,
  Button,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { getCustomers, deleteCustomer } from '@/services/customerService';
import { useAuth } from '@/context/AuthContext';

export default function CustomersPage() {
  const { token } = useAuth();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    getCustomers()
      .then((res) => setCustomers(res.data || res))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [token]);

  const handleDelete = async (id) => {
    if (!confirm('هل تريد حذف العميل؟')) return;
    try {
      await deleteCustomer(id);
      setCustomers((s) => s.filter((c) => c.id !== id));
      alert('تم الحذف');
    } catch (err) {
      console.error(err);
      alert('خطأ عند الحذف');
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', py: 6 }}>
      <Container maxWidth='lg'>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant='h4' fontWeight={700}>
            العملاء
          </Typography>
          <Link href='/customers/new'>
            <Button variant='contained' startIcon={<AddIcon />}>
              إضافة عميل
            </Button>
          </Link>
        </Box>

        {loading ? (
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>الاسم</TableCell>
                  <TableCell>الهاتف</TableCell>
                  <TableCell>البريد</TableCell>
                  <TableCell>الطلبات</TableCell>
                  <TableCell align='center'>إجراءات</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {customers.map((c) => (
                  <TableRow key={c.id} hover>
                    <TableCell>{c.name}</TableCell>
                    <TableCell>{c.phone || '-'}</TableCell>
                    <TableCell>{c.email || '-'}</TableCell>
                    <TableCell>{c.orders?.length || 0}</TableCell>
                    <TableCell align='center'>
                      <Link href={`/customers/${c.id}`}>
                        <Button size='small'>عرض</Button>
                      </Link>
                      <Link href={`/customers/${c.id}/edit`}>
                        <Button size='small'>تعديل</Button>
                      </Link>
                      <Button
                        size='small'
                        color='error'
                        onClick={() => handleDelete(c.id)}>
                        حذف
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Container>
    </Box>
  );
}
