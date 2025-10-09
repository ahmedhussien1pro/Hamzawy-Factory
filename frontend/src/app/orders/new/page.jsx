'use client';
import { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem,
} from '@mui/material';
import { getCustomers } from '@/services/customerService';
import { createOrder } from '@/services/orderService';
import { useRouter } from 'next/navigation';

export default function NewOrderPage() {
  const router = useRouter();
  const [customers, setCustomers] = useState([]);
  const [loadingCust, setLoadingCust] = useState(true);
  const [form, setForm] = useState({
    customerId: '',
    deliveryAddress: '',
    notes: '',
    items: [
      { productId: '', quantity: 1, priceSnapshot: 0, unitCostSnapshot: 0 },
    ],
  });

  useEffect(() => {
    getCustomers()
      .then((res) => setCustomers(res.data || res))
      .catch(console.error)
      .finally(() => setLoadingCust(false));
  }, []);

  const addItem = () =>
    setForm((f) => ({
      ...f,
      items: [
        ...f.items,
        { productId: '', quantity: 1, priceSnapshot: 0, unitCostSnapshot: 0 },
      ],
    }));
  const removeItem = (i) =>
    setForm((f) => ({ ...f, items: f.items.filter((_, idx) => idx !== i) }));
  const updateItem = (i, key, value) =>
    setForm((f) => {
      const items = [...f.items];
      items[i] = { ...items[i], [key]: value };
      return { ...f, items };
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.customerId) {
      alert('اختر العميل');
      return;
    }
    try {
      await createOrder(form);
      alert('تم إنشاء الطلب');
      router.push('/orders');
    } catch (err) {
      console.error(err);
      alert('خطأ');
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', py: 6 }}>
      <Container maxWidth='md'>
        <Paper sx={{ p: 4 }}>
          <Typography variant='h5' sx={{ mb: 2 }}>
            إنشاء طلب جديد
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              select
              fullWidth
              label='العميل'
              value={form.customerId}
              onChange={(e) => setForm({ ...form, customerId: e.target.value })}
              sx={{ mb: 2 }}>
              {customers.map((c) => (
                <MenuItem key={c.id} value={c.id}>
                  {c.name}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              fullWidth
              label='عنوان التسليم'
              value={form.deliveryAddress}
              onChange={(e) =>
                setForm({ ...form, deliveryAddress: e.target.value })
              }
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label='ملاحظات'
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              multiline
              rows={3}
              sx={{ mb: 2 }}
            />

            <Typography variant='subtitle1' sx={{ mt: 2, mb: 1 }}>
              بنود الطلب
            </Typography>
            {form.items.map((it, idx) => (
              <Grid container spacing={1} key={idx} sx={{ mb: 1 }}>
                <Grid item xs={12} sm={5}>
                  <TextField
                    fullWidth
                    label='Product ID'
                    value={it.productId}
                    onChange={(e) =>
                      updateItem(idx, 'productId', e.target.value)
                    }
                  />
                </Grid>
                <Grid item xs={6} sm={2}>
                  <TextField
                    fullWidth
                    label='كمية'
                    type='number'
                    value={it.quantity}
                    onChange={(e) =>
                      updateItem(idx, 'quantity', Number(e.target.value))
                    }
                  />
                </Grid>
                <Grid item xs={6} sm={2}>
                  <TextField
                    fullWidth
                    label='سعر'
                    type='number'
                    value={it.priceSnapshot}
                    onChange={(e) =>
                      updateItem(idx, 'priceSnapshot', Number(e.target.value))
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={3} sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant='outlined'
                    color='error'
                    onClick={() => removeItem(idx)}>
                    حذف
                  </Button>
                </Grid>
              </Grid>
            ))}

            <Button variant='outlined' onClick={addItem} sx={{ mb: 2 }}>
              إضافة بند
            </Button>

            <Box>
              <Button type='submit' variant='contained'>
                إنشاء الطلب
              </Button>
            </Box>
          </form>
        </Paper>
      </Container>
    </Box>
  );
}
