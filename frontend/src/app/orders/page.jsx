// src/app/orders/page.jsx
'use client';
import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Button,
  TextField,
  InputAdornment,
} from '@mui/material';
import { Search, Visibility, Edit, Add } from '@mui/icons-material';
import { useRouter } from 'next/navigation';

// بيانات وهمية للعرض
const mockOrders = [
  {
    id: 'ORD-001',
    customerName: 'شركة النور',
    totalAmount: 15000,
    status: 'completed',
    orderDate: '2024-01-15',
    deliveryDate: '2024-01-20',
  },
  {
    id: 'ORD-002',
    customerName: 'مصنع الأمل',
    totalAmount: 8500,
    status: 'processing',
    orderDate: '2024-01-16',
    deliveryDate: '2024-01-25',
  },
  {
    id: 'ORD-003',
    customerName: 'شركة المستقبل',
    totalAmount: 12000,
    status: 'pending',
    orderDate: '2024-01-17',
    deliveryDate: '2024-01-30',
  },
];

const getStatusColor = (status) => {
  switch (status) {
    case 'completed':
      return 'success';
    case 'processing':
      return 'warning';
    case 'pending':
      return 'default';
    default:
      return 'default';
  }
};

const getStatusText = (status) => {
  switch (status) {
    case 'completed':
      return 'مكتمل';
    case 'processing':
      return 'قيد المعالجة';
    case 'pending':
      return 'معلق';
    default:
      return status;
  }
};

export default function OrdersPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [orders] = useState(mockOrders);

  const filteredOrders = orders.filter(
    (order) =>
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        py: 4,
        px: 2,
      }}>
      <Container maxWidth='xl'>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant='h3'
            component='h1'
            sx={{
              fontWeight: 700,
              color: 'primary.main',
              mb: 2,
            }}>
            إدارة الطلبات
          </Typography>
          <Typography variant='h6' sx={{ color: 'text.secondary' }}>
            عرض وإدارة جميع طلبات العملاء
          </Typography>
        </Box>

        {/* Actions Bar */}
        <Paper
          sx={{
            p: 3,
            mb: 3,
            borderRadius: 3,
            background: 'white',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 2,
            }}>
            <TextField
              placeholder='ابحث برقم الطلب أو اسم العميل...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{
                minWidth: 300,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <Search />
                  </InputAdornment>
                ),
              }}
            />

            <Button
              variant='contained'
              startIcon={<Add />}
              onClick={() => router.push('/orders/create')}
              sx={{
                borderRadius: 2,
                px: 3,
                py: 1,
              }}>
              طلب جديد
            </Button>
          </Box>
        </Paper>

        {/* Orders Table */}
        <Paper
          sx={{
            borderRadius: 3,
            overflow: 'hidden',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          }}>
          <TableContainer>
            <Table>
              <TableHead sx={{ backgroundColor: 'primary.main' }}>
                <TableRow>
                  <TableCell sx={{ color: 'white', fontWeight: 600 }}>
                    رقم الطلب
                  </TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 600 }}>
                    اسم العميل
                  </TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 600 }}>
                    المبلغ الإجمالي
                  </TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 600 }}>
                    الحالة
                  </TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 600 }}>
                    تاريخ الطلب
                  </TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 600 }}>
                    تاريخ التسليم
                  </TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 600 }}>
                    الإجراءات
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow
                    key={order.id}
                    sx={{
                      '&:hover': {
                        backgroundColor: 'action.hover',
                      },
                    }}>
                    <TableCell>
                      <Typography variant='body2' fontWeight='600'>
                        {order.id}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant='body2'>
                        {order.customerName}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant='body2' fontWeight='600'>
                        {order.totalAmount.toLocaleString()} ج.م
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getStatusText(order.status)}
                        color={getStatusColor(order.status)}
                        size='small'
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant='body2'>
                        {new Date(order.orderDate).toLocaleDateString('ar-EG')}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant='body2'>
                        {new Date(order.deliveryDate).toLocaleDateString(
                          'ar-EG'
                        )}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton
                          size='small'
                          onClick={() => router.push(`/orders/${order.id}`)}
                          sx={{
                            color: 'primary.main',
                            '&:hover': {
                              backgroundColor: 'primary.light',
                              color: 'white',
                            },
                          }}>
                          <Visibility />
                        </IconButton>
                        <IconButton
                          size='small'
                          sx={{
                            color: 'warning.main',
                            '&:hover': {
                              backgroundColor: 'warning.light',
                              color: 'white',
                            },
                          }}>
                          <Edit />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Empty State */}
          {filteredOrders.length === 0 && (
            <Box
              sx={{
                py: 8,
                textAlign: 'center',
                color: 'text.secondary',
              }}>
              <Typography variant='h6'>لا توجد طلبات</Typography>
              <Typography variant='body2' sx={{ mt: 1 }}>
                {searchTerm
                  ? 'لم يتم العثور على طلبات تطابق بحثك'
                  : 'لم يتم إضافة أي طلبات بعد'}
              </Typography>
            </Box>
          )}
        </Paper>

        {/* Footer Stats */}
        <Paper
          sx={{
            mt: 3,
            p: 3,
            borderRadius: 3,
            background: 'white',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-around',
              flexWrap: 'wrap',
              gap: 3,
            }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant='h4' fontWeight='700' color='primary.main'>
                {orders.length}
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                إجمالي الطلبات
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant='h4' fontWeight='700' color='success.main'>
                {orders.filter((o) => o.status === 'completed').length}
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                طلبات مكتملة
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant='h4' fontWeight='700' color='warning.main'>
                {orders.filter((o) => o.status === 'processing').length}
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                قيد المعالجة
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
