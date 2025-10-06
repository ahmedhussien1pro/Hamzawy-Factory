'use client';
import {
  Box,
  Paper,
  Typography,
  Divider,
  Stack,
  useTheme,
  Button,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Link from 'next/link';

export default function ItemCodeCard({ itemCode, onDelete }) {
  const theme = useTheme();

  if (!itemCode) {
    return (
      <Typography
        variant='body1'
        sx={{ textAlign: 'center', color: 'text.secondary', mt: 4 }}>
        لم يتم العثور على بيانات هذا الكود.
      </Typography>
    );
  }

  return (
    <Paper
      elevation={3}
      sx={{
        p: { xs: 3, md: 4 },
        borderRadius: 3,
        backgroundColor: 'background.paper',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        maxWidth: 700,
        mx: 'auto',
      }}>
      <Typography
        variant='h5'
        fontWeight={700}
        color='primary'
        textAlign='center'
        mb={3}>
        🧾 تفاصيل الكود المخزني
      </Typography>

      <Divider sx={{ mb: 3 }} />

      <Stack spacing={2}>
        <InfoRow label='الكود' value={itemCode.code} />
        <InfoRow label='اسم المنتج' value={itemCode.name} />
        <InfoRow label='الوحدة' value={itemCode.unit || '-'} />
        <InfoRow label='الحد الأدنى' value={itemCode.minQuantity} />
        <InfoRow label='الملاحظات' value={itemCode.notes || '—'} />
        <InfoRow
          label='تاريخ الإنشاء'
          value={new Date(itemCode.createdAt).toLocaleDateString('ar-EG')}
        />
        <InfoRow
          label='آخر تعديل'
          value={new Date(itemCode.updatedAt).toLocaleDateString('ar-EG')}
        />
      </Stack>

      <Divider sx={{ my: 3 }} />

      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
        <Link href={`/item-codes/${itemCode.id}/edit`} passHref>
          <Button
            variant='contained'
            color='primary'
            startIcon={<EditIcon />}
            sx={{ borderRadius: 2, fontWeight: 600 }}>
            تعديل
          </Button>
        </Link>

        <Button
          variant='outlined'
          color='error'
          startIcon={<DeleteIcon />}
          onClick={() =>
            confirm('هل أنت متأكد من حذف هذا الكود؟') && onDelete?.(itemCode.id)
          }
          sx={{ borderRadius: 2, fontWeight: 600 }}>
          حذف
        </Button>
      </Box>
    </Paper>
  );
}

function InfoRow({ label, value }) {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 1,
        borderBottom: '1px dashed #e5e7eb',
        pb: 1,
      }}>
      <Typography
        variant='body1'
        sx={{ color: 'text.secondary', fontWeight: 600 }}>
        {label}
      </Typography>
      <Typography
        variant='body1'
        sx={{
          color: 'text.primary',
          fontWeight: 500,
          wordBreak: 'break-word',
          textAlign: 'left',
        }}>
        {value}
      </Typography>
    </Box>
  );
}
