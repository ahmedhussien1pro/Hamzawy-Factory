'use client';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Divider,
  useTheme,
  Chip,
} from '@mui/material';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import EmailIcon from '@mui/icons-material/Email';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import SecurityIcon from '@mui/icons-material/Security';
import LockIcon from '@mui/icons-material/Lock';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export default function UserCard({ user }) {
  const theme = useTheme();

  const roleColors = {
    ADMIN: 'error',
    MANAGER: 'primary',
    WAREHOUSE_STAFF: 'success',
    FACTORY_STAFF: 'info',
    ACCOUNTANT: 'secondary',
    SALES: 'warning',
  };

  return (
    <Card
      sx={{
        borderRadius: 3,
        boxShadow: 5,
        overflow: 'hidden',
        transition: '0.3s',
        '&:hover': {
          boxShadow: 9,
          transform: 'translateY(-4px)',
        },
      }}>
      <CardContent sx={{ p: { xs: 3, md: 4 } }}>
        {/* الاسم */}
        <Typography
          variant='h6'
          sx={{
            fontWeight: 700,
            color: theme.palette.primary.main,
            mb: 1,
          }}>
          {user.name}
        </Typography>

        {/* البريد الإلكتروني */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <EmailIcon fontSize='small' color='action' />
          <Typography
            variant='body2'
            sx={{ color: theme.palette.text.secondary }}>
            {user.email}
          </Typography>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* بيانات إضافية */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PhoneIphoneIcon fontSize='small' color='action' />
            <Typography variant='body1'>
              {user.phone ? user.phone : 'غير مسجل'}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CalendarTodayIcon fontSize='small' color='action' />
            <Typography variant='body1'>
              {new Date(user.createdAt).toLocaleDateString('ar-EG', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SecurityIcon fontSize='small' color='action' />
            <Chip
              label={user.role}
              color={roleColors[user.role] || 'default'}
              size='small'
              sx={{ fontWeight: 600 }}
            />
          </Box>

          <Box
            sx={{
              display: 'flex',
              gap: 1,
              alignItems: 'center',
              color: user.isLocked ? 'error.main' : 'success.main',
              fontWeight: 600,
            }}>
            {user.isLocked ? (
              <>
                <LockIcon fontSize='small' color='error' />
                <Typography variant='body1'>الحساب مقفول</Typography>
              </>
            ) : (
              <>
                <CheckCircleIcon fontSize='small' color='success' />
                <Typography variant='body1'>الحساب نشط</Typography>
              </>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
