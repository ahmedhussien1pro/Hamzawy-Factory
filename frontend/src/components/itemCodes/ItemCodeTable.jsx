'use client';
import { useState, useMemo } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  TextField,
  InputAdornment,
  Tooltip,
  useTheme,
  Button,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import Link from 'next/link';

export default function ItemCodeTable({ data = [], onDelete }) {
  const theme = useTheme();
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    return data.filter(
      (item) =>
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.code.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, data]);

  return (
    <Box sx={{ py: 3 }}>
      <Paper
        sx={{
          p: 3,
          borderRadius: 3,
          boxShadow: 5,
          backgroundColor: 'background.paper',
        }}>
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'stretch', sm: 'center' },
            mb: 3,
            gap: 2,
          }}>
          <Typography
            variant='h6'
            sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
            🧾 قائمة الأكواد المخزنية
          </Typography>

          <Link href='/item-codes/create' passHref>
            <Button
              variant='contained'
              startIcon={<AddIcon />}
              sx={{
                fontWeight: 600,
                borderRadius: 2,
                py: 1,
              }}>
              إضافة كود جديد
            </Button>
          </Link>
        </Box>

        {/* Search Input */}
        <TextField
          fullWidth
          placeholder='ابحث باسم المنتج أو الكود...'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <SearchIcon color='action' />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 3 }}
        />

        {/* Table */}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>الكود</TableCell>
                <TableCell>اسم المنتج</TableCell>
                <TableCell>الوحدة</TableCell>
                <TableCell>الحد الأدنى</TableCell>
                <TableCell>تاريخ الإنشاء</TableCell>
                <TableCell align='center'>الإجراءات</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filtered.length > 0 ? (
                filtered.map((item) => (
                  <TableRow
                    key={item.id}
                    hover
                    sx={{
                      '&:hover': { backgroundColor: '#f9fafb' },
                      transition: '0.2s ease',
                    }}>
                    <TableCell>{item.code}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.unit || '-'}</TableCell>
                    <TableCell>{item.minQuantity}</TableCell>
                    <TableCell>
                      {new Date(item.createdAt).toLocaleDateString('ar-EG')}
                    </TableCell>
                    <TableCell align='center'>
                      <Tooltip title='تعديل'>
                        <IconButton
                          color='primary'
                          component={Link}
                          href={`/item-codes/${item.id}/edit`}>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title='حذف'>
                        <IconButton
                          color='error'
                          onClick={() =>
                            confirm('هل أنت متأكد من الحذف؟') &&
                            onDelete?.(item.id)
                          }>
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align='center' sx={{ py: 4 }}>
                    <Typography color='text.secondary'>
                      لا توجد بيانات حالياً
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}
