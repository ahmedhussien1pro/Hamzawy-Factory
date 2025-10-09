'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import {
  Box,
  Container,
  Typography,
  Paper,
  CircularProgress,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
} from '@mui/material';
import { getOrderById, updateOrderStatus } from '@/services/orderService';

export default function OrderDetailsPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrderById(id)
      .then((res) => setOrder(res.data || res))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const changeStatus = async (status) => {
    try {
      await updateOrderStatus(id, status);
      setOrder((o) => ({ ...o, status }));
      alert('تم تحديث الحالة');
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
  if (!order)
    return (
      <Container>
        <Typography>لم يُعثر على الطلب</Typography>
      </Container>
    );

  return (
    <Box sx={{ minHeight: '100vh', py: 6 }}>
      <Container maxWidth='md'>
        <Paper sx={{ p: 3 }}>
          <Typography variant='h5'>
            تفاصيل الطلب - {order.orderNumber || order.id}
          </Typography>
          <Typography>العميل: {order.customer?.name || '-'}</Typography>
          <Typography>الحالة: {order.status}</Typography>
          <Typography>العنوان: {order.deliveryAddress || '-'}</Typography>

          <Table sx={{ mt: 2 }}>
            <TableHead>
              <TableRow>
                <TableCell>المنتج</TableCell>
                <TableCell>الكمية</TableCell>
                <TableCell>السعر</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {order.items?.map((i) => (
                <TableRow key={i.id}>
                  <TableCell>{i.productId}</TableCell>
                  <TableCell>{i.quantity}</TableCell>
                  <TableCell>{i.priceSnapshot}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <Button
              variant='contained'
              onClick={() => changeStatus('CONFIRMED')}>
              تأكيد
            </Button>
            <Button
              variant='outlined'
              onClick={() => changeStatus('CANCELLED')}>
              إلغاء
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
