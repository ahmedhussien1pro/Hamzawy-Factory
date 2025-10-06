// src/app/login/page.jsx
'use client';
import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Alert,
  CircularProgress,
  TextField,
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useAuth } from '@/context/AuthContext';

const professionalTheme = createTheme({
  direction: 'rtl',
  palette: {
    primary: {
      main: '#1e40af',
      light: '#3b82f6',
      dark: '#1e3a8a',
    },
    success: {
      main: '#059669',
    },
    background: {
      default: '#f1f5f9',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Inter", "Cairo", "Arial", sans-serif',
    h3: {
      fontWeight: 700,
      fontSize: '2rem',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            backgroundColor: '#ffffff',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
          fontSize: '1rem',
        },
      },
    },
  },
});

export default function LoginPage() {
  return (
    <ThemeProvider theme={professionalTheme}>
      <LoginContent />
    </ThemeProvider>
  );
}

function LoginContent() {
  const { login, loading, error } = useAuth();
  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
  });
  const [localError, setLocalError] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (localError) setLocalError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.identifier.trim() || !formData.password.trim()) {
      setLocalError('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    try {
      await login(formData.identifier, formData.password);
      // التنقل بيتم داخل AuthContext بعد النجاح ✅
    } catch {
      // نكتفي بالـ error من الـ context (مافيش console)
    }
  };

  const displayError = localError || error;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
      }}>
      <Container
        maxWidth='lg'
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Box
          sx={{
            display: 'flex',
            width: '100%',
            maxWidth: 1000,
            boxShadow: 3,
            borderRadius: 3,
            overflow: 'hidden',
          }}>
          {/* Right Side - Login Form */}
          <Box
            sx={{
              flex: 1,
              background: 'white',
              p: { xs: 4, md: 6 },
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}>
            {/* Header */}
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Typography
                variant='h4'
                sx={{
                  fontWeight: 600,
                  color: 'primary.main',
                  mb: 1,
                }}>
                تسجيل الدخول
              </Typography>
              <Typography
                variant='body1'
                color='text.secondary'
                sx={{ fontSize: '1.1rem' }}>
                أدخل بيانات الدخول للوصول إلى النظام
              </Typography>
            </Box>

            {/* Error Alert */}
            {displayError && (
              <Alert
                severity='error'
                sx={{
                  mb: 3,
                  borderRadius: 2,
                  textAlign: 'right',
                  alignItems: 'center',
                }}>
                {displayError}
              </Alert>
            )}

            {/* Login Form */}
            <Box component='form' onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <Box sx={{ mb: 3 }}>
                <TextField
                  name='identifier'
                  label='البريد الإلكتروني أو رقم الهاتف'
                  value={formData.identifier}
                  onChange={handleChange}
                  required
                  fullWidth
                  size='medium'
                  placeholder='example@company.com أو 01012345678'
                  error={!!displayError}
                />
              </Box>

              <Box sx={{ mb: 4 }}>
                <TextField
                  name='password'
                  label='كلمة المرور'
                  type='password'
                  value={formData.password}
                  onChange={handleChange}
                  required
                  fullWidth
                  size='medium'
                  placeholder='أدخل كلمة المرور'
                  error={!!displayError}
                />
              </Box>

              {/* Submit Button */}
              <button
                type='submit'
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '14px',
                  background: loading ? '#9ca3af' : '#1e40af',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: 600,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  marginBottom: '16px',
                  boxShadow: '0 2px 8px rgba(30, 64, 175, 0.3)',
                  transition: 'all 0.2s ease-in-out',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
                onMouseOver={(e) => {
                  if (!loading) {
                    e.target.style.background = '#1e3a8a';
                    e.target.style.boxShadow =
                      '0 4px 12px rgba(30, 64, 175, 0.4)';
                  }
                }}
                onMouseOut={(e) => {
                  if (!loading) {
                    e.target.style.background = '#1e40af';
                    e.target.style.boxShadow =
                      '0 2px 8px rgba(30, 64, 175, 0.3)';
                  }
                }}>
                {loading ? (
                  <>
                    <CircularProgress size={20} sx={{ color: 'white' }} />
                    جاري التسجيل...
                  </>
                ) : (
                  'تسجيل الدخول'
                )}
              </button>

              {/* Forgot Password */}
              <Box sx={{ textAlign: 'center', mt: 3 }}>
                <button
                  type='button'
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#1e40af',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 500,
                    textDecoration: 'underline',
                  }}>
                  نسيت كلمة المرور؟
                </button>
              </Box>
            </Box>

            {/* Footer */}
            <Box
              sx={{
                textAlign: 'center',
                mt: 4,
                pt: 3,
                borderTop: '1px solid #e5e7eb',
              }}>
              <Typography variant='caption' color='#6b7280'>
                © 2025 مصنع حمزاوي . جميع الحقوق محفوظة.
              </Typography>
            </Box>
          </Box>

          {/* Left Side - Branding */}
          <Box
            sx={{
              flex: 1,
              background:
                'url(https://images.pexels.com/photos/50594/sea-bay-waterfront-beach-50594.jpeg?_gl=1*1onipfo*_ga*Nzc5MjEzOTg1LjE3NTgwNjExNzU.*_ga_8JE65Q40S6*czE3NTkxMDQyNzIkbzIkZzEkdDOI3NTkxMDQyODUkajQ3JGwwJGgw) no-repeat center/cover',
              color: 'white',
              p: 5,
              display: { xs: 'none', md: 'flex' },
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
            }}>
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'rgba(0,0,0,0.3)',
                backdropFilter: 'blur(.9px)',
                zIndex: 0,
              }}
            />
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Typography
                variant='h3'
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  textShadow: '0 2px 4px rgba(0,0,0,0.6)',
                }}>
                مصنع حمزاوي
              </Typography>

              <Typography
                variant='h5'
                sx={{
                  mb: 4,
                  opacity: 0.9,
                  fontWeight: 500,
                }}>
                للصناعات المعدنية
              </Typography>

              <Box
                sx={{
                  width: 120,
                  height: 120,
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 4,
                  border: '2px solid rgba(255,255,255,0.2)',
                }}>
                <Typography variant='h4' sx={{ opacity: 0.8 }}>
                  ⚙️
                </Typography>
              </Box>

              <Typography
                variant='body1'
                sx={{
                  opacity: 0.85,
                  maxWidth: 300,
                  lineHeight: 1.6,
                }}>
                نظام متكامل لإدارة المصنع والمخزن بكفاءة وسهولة.
              </Typography>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
