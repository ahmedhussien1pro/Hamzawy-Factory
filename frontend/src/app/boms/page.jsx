'use client';
import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  TableContainer,
  Box,
  CircularProgress,
  Alert,
  Stack,
  IconButton,
  Tooltip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { getBOMs, deleteBOM } from '@/services/bomService';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function BomsPage() {
  const { token } = useAuth();
  const [boms, setBoms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await getBOMs(token);
        let items = [];
        if (!res) items = [];
        else if (Array.isArray(res)) items = res;
        else if (Array.isArray(res.items)) items = res.items;
        else if (Array.isArray(res.data)) items = res.data;
        else items = [];

        if (mounted) setBoms(items);
      } catch (e) {
        console.error('Error loading BOMs', e);
        if (mounted)
          setError(
            e?.message ||
              e?.error ||
              'حدث خطأ أثناء تحميل الـ BOMs. تحقق من السيرفر.'
          );
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [token]);

  const handleDelete = async (id) => {
    if (!confirm('هل تريد حذف هذا الـ BOM نهائياً؟')) return;
    try {
      setDeletingId(id);
      await deleteBOM(id, token);
      setBoms((prev) => prev.filter((b) => b.id !== id));
    } catch (err) {
      console.error('Delete BOM error', err);
      alert(
        err?.message ||
          err?.error ||
          'حدث خطأ أثناء حذف الـ BOM. تأكد أن لهش تبعيات.'
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <Container sx={{ py: 3 }} dir='rtl'>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
          mb: 2,
          flexWrap: 'wrap',
        }}>
        <Typography variant='h4' component='h1' mb={1}>
          قوائم المواد (BOMs)
        </Typography>

        <Stack direction='row' spacing={1}>
          <Link href='/boms/new' passHref>
            <Button variant='contained' startIcon={<AddIcon />}>
              إنشاء BOM
            </Button>
          </Link>
        </Stack>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity='error'>{error}</Alert>
      ) : boms.length === 0 ? (
        <Paper sx={{ p: 6, textAlign: 'center' }}>
          <Typography color='text.secondary'>لا توجد BOMs حالياً.</Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f7fb' }}>
                <TableCell sx={{ fontWeight: 700 }}>الكود</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>الاسم</TableCell>
                <TableCell sx={{ fontWeight: 700, width: 120 }}>
                  المكونات
                </TableCell>
                <TableCell
                  sx={{ fontWeight: 700, textAlign: 'center', width: 220 }}>
                  إجراءات
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {boms.map((b) => (
                <TableRow key={b.id} hover>
                  <TableCell>{b.code || b.id}</TableCell>
                  <TableCell>{b.name}</TableCell>
                  <TableCell>{b.components?.length ?? 0}</TableCell>
                  <TableCell align='center'>
                    <Stack direction='row' spacing={1} justifyContent='center'>
                      <Link href={`/boms/${b.id}`} passHref>
                        <Tooltip title='عرض'>
                          <IconButton size='small' color='primary'>
                            <VisibilityIcon fontSize='small' />
                          </IconButton>
                        </Tooltip>
                      </Link>

                      <Link href={`/boms/${b.id}/edit`} passHref>
                        <Tooltip title='تعديل'>
                          <IconButton size='small' color='info'>
                            <EditIcon fontSize='small' />
                          </IconButton>
                        </Tooltip>
                      </Link>

                      <Tooltip title='حذف'>
                        <span>
                          <IconButton
                            size='small'
                            color='error'
                            onClick={() => handleDelete(b.id)}
                            disabled={deletingId === b.id}>
                            <DeleteIcon fontSize='small' />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
}
