'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Box,
  Container,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { getItemCodes } from '@/services/itemCodeService';
import { useAuth } from '@/context/AuthContext';

const professionalTheme = createTheme({
  direction: 'rtl',
  palette: {
    primary: { main: '#1e40af', light: '#3b82f6', dark: '#1e3a8a' },
    background: { default: '#f1f5f9', paper: '#ffffff' },
  },
  typography: { fontFamily: '"Inter", "Cairo", "Arial", sans-serif' },
});

export default function ItemCodesPage() {
  const { token } = useAuth();
  const [codes, setCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) {
      setError('يرجى تسجيل الدخول أولاً.');
      setLoading(false);
      return;
    }

    async function fetchCodes() {
      try {
        const res = await getItemCodes(token);
        setCodes(res?.data || res);
      } catch (err) {
        console.error('Error fetching item codes:', err);
        setError('حدث خطأ أثناء تحميل الأكواد.');
      } finally {
        setLoading(false);
      }
    }

    fetchCodes();
  }, [token]);

  return (
    <ThemeProvider theme={professionalTheme}>
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
          py: 6,
        }}>
        <Container maxWidth='lg'>
          {/* Header */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 4,
            }}>
            <Typography
              variant='h4'
              fontWeight={700}
              color='primary'
              sx={{ textAlign: 'right' }}>
              🏷️ أكواد المنتجات
            </Typography>

            <Link href='/item-codes/new' passHref>
              <Button
                variant='contained'
                color='primary'
                startIcon={<AddIcon />}
                sx={{ fontWeight: 600, borderRadius: 2 }}>
                إضافة كود جديد
              </Button>
            </Link>
          </Box>

          {/* Content */}
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
              <CircularProgress color='primary' />
            </Box>
          ) : error ? (
            <Alert severity='error'>{error}</Alert>
          ) : codes.length === 0 ? (
            <Paper
              sx={{
                textAlign: 'center',
                py: 8,
                borderRadius: 3,
                backgroundColor: 'background.paper',
              }}>
              <Typography variant='h6' color='text.secondary'>
                لا توجد أكواد مسجلة حالياً
              </Typography>
            </Paper>
          ) : (
            <TableContainer
              component={Paper}
              sx={{
                borderRadius: 3,
                overflow: 'hidden',
                boxShadow: 3,
              }}>
              <Table>
                <TableHead sx={{ backgroundColor: '#1e40af' }}>
                  <TableRow>
                    <TableCell sx={{ color: 'white', fontWeight: 600 }}>
                      الكود
                    </TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 600 }}>
                      اسم المنتج
                    </TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 600 }}>
                      الوحدة
                    </TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 600 }}>
                      الحد الأدنى
                    </TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 600 }}>
                      ملاحظات
                    </TableCell>
                    <TableCell
                      sx={{
                        color: 'white',
                        fontWeight: 600,
                        textAlign: 'center',
                      }}>
                      التفاصيل
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {codes.map((code) => (
                    <TableRow key={code.id} hover>
                      <TableCell>{code.code}</TableCell>
                      <TableCell>{code.name}</TableCell>
                      <TableCell>{code.unit || '-'}</TableCell>
                      <TableCell>{code.minQuantity ?? 0}</TableCell>
                      <TableCell>{code.notes || '-'}</TableCell>
                      <TableCell align='center'>
                        <Link href={`/item-codes/${code.id}`} passHref>
                          <Button
                            variant='outlined'
                            color='primary'
                            sx={{ borderRadius: 2, fontWeight: 600 }}>
                            عرض
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Container>
      </Box>
    </ThemeProvider>
  );
}
