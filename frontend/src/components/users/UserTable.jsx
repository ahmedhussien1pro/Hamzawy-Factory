'use client';
import { DataGrid } from '@mui/x-data-grid';
import Link from 'next/link';
import { Box, Button, Paper, Typography, useTheme } from '@mui/material';

export default function UserTable({ users }) {
  const theme = useTheme();

  const columns = [
    {
      field: 'name',
      headerName: 'الاسم',
      flex: 1,
      minWidth: 150,
      renderCell: (params) => (
        <Typography sx={{ fontWeight: 600, fontSize: '0.95rem' }}>
          {params.value}
        </Typography>
      ),
    },
    {
      field: 'email',
      headerName: 'البريد الإلكتروني',
      flex: 1.2,
      minWidth: 220,
      renderCell: (params) => (
        <Typography sx={{ fontSize: '0.9rem', color: 'text.secondary' }}>
          {params.value}
        </Typography>
      ),
    },
    {
      field: 'phone',
      headerName: 'الهاتف',
      flex: 1,
      minWidth: 160,
    },
    {
      field: 'role',
      headerName: 'الدور',
      flex: 1,
      minWidth: 180,
      renderCell: (params) => (
        <Typography
          sx={{
            px: 2,
            py: 0.4,
            borderRadius: 1,
            fontSize: '0.85rem',
            fontWeight: 600,
            color: theme.palette.primary.dark,
            backgroundColor: theme.palette.primary.light + '22',
          }}>
          {params.value}
        </Typography>
      ),
    },
    {
      field: 'isLocked',
      headerName: 'الحالة',
      flex: 0.8,
      minWidth: 80,
      renderCell: (params) =>
        params.value ? (
          <Typography
            sx={{
              color: theme.palette.error.main,
              fontWeight: 600,
              fontSize: '0.9rem',
            }}>
            🚫 مقفول
          </Typography>
        ) : (
          <Typography
            sx={{
              color: theme.palette.success.main,
              fontWeight: 600,
              fontSize: '0.9rem',
            }}>
            ✅ نشط
          </Typography>
        ),
    },
    {
      field: 'failedLoginAttempts',
      headerName: 'محاولات خاطئة',
      flex: 0.8,
      minWidth: 140,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'actions',
      headerName: 'الإجراءات',
      flex: 1,
      minWidth: 180,
      sortable: false,
      filterable: false,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
          <Link href={`/users/${params.row.id}`} passHref>
            <Button
              variant='contained'
              size='small'
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                borderRadius: 2,
                px: 2,
                fontSize: '0.85rem',
                boxShadow: '0 3px 8px rgba(30,64,175,0.25)',
                '&:hover': {
                  backgroundColor: theme.palette.primary.dark,
                },
              }}>
              عرض
            </Button>
          </Link>
        </Box>
      ),
    },
  ];

  return (
    <Paper
      sx={{
        p: { xs: 1, sm: 2 },
        borderRadius: 3,
        boxShadow: 4,
        backgroundColor: 'background.paper',
        width: '100%',
        overflowX: 'auto',
      }}>
      <Box sx={{ minWidth: 700 }}>
        <DataGrid
          rows={users}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10, 20, 50]}
          autoHeight
          disableRowSelectionOnClick
          getRowId={(row) => row.id}
          sx={{
            border: '1px solid #e5e7eb',
            textAlign: 'center !important',
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: theme.palette.primary.main,
              color: 'primary.main',
              fontWeight: 800,
              fontSize: '1.06rem',
              borderRadius: '8px 8px 0 0',
              mx: 'auto',
            },
            '& .MuiDataGrid-columnHeaders:hover .MuiSvgIcon-root': {
              color: 'primary.main',
            },
            '& .MuiDataGrid-cell': {
              fontSize: '0.9rem',
              borderLeft: '1px solid #e7e7eb',
              textAlign: 'center !important',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            },

            '& .MuiDataGrid-row': {
              borderBottom: '1px solid #e5e7eb',
            },
            '& .MuiDataGrid-row:hover': {
              backgroundColor: '#f9fafb',
            },
            '& .MuiDataGrid-footerContainer': {
              backgroundColor: '#f8fafc',
              borderTop: '1px solid #e5e7eb',
            },
          }}
        />
      </Box>
    </Paper>
  );
}
