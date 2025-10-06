'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  CircularProgress,
  Box,
  Typography,
  Collapse,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { paths } from '@/paths';

export default function DashboardPage() {
  const { token, user, loading } = useAuth();
  const router = useRouter();
  const [openMenus, setOpenMenus] = useState({});

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !token) {
      router.replace('/login');
    }
  }, [loading, token, router]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress color='primary' />
      </Box>
    );
  }

  if (!token) return null;

  // Helper to toggle dropdown
  const handleToggle = (key) => {
    setOpenMenus((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Render a single item or dropdown
  const renderPathItem = (key, value) => {
    // Skip dynamic routes like /orders/[id]
    if (value.path?.includes('[')) return null;

    // If nested object
    if (typeof value === 'object' && !value.path) {
      const hasChildren = Object.values(value).some((v) => v?.path);
      if (!hasChildren) return null;

      const Icon = value.icon || null;

      return (
        <Box key={key}>
          <ListItemButton onClick={() => handleToggle(key)}>
            {Icon && (
              <ListItemIcon>
                <Icon color='primary' />
              </ListItemIcon>
            )}
            <ListItemText primary={value.title || key} />
            {openMenus[key] ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>

          <Collapse in={openMenus[key]} timeout='auto' unmountOnExit>
            <List component='div' disablePadding sx={{ pl: 4 }}>
              {Object.entries(value).map(([subKey, subVal]) => {
                if (!subVal.path || subVal.path.includes('[')) return null;
                const SubIcon = subVal.icon || null;
                return (
                  <Link
                    key={`${key}.${subKey}`}
                    href={subVal.path}
                    style={{ textDecoration: 'none', color: 'inherit' }}>
                    <ListItemButton>
                      {SubIcon && (
                        <ListItemIcon>
                          <SubIcon color='primary' fontSize='small' />
                        </ListItemIcon>
                      )}
                      <ListItemText primary={subVal.title || subKey} />
                    </ListItemButton>
                  </Link>
                );
              })}
            </List>
          </Collapse>
        </Box>
      );
    }

    // Simple link
    const Icon = value.icon || null;
    return (
      <Link
        key={key}
        href={value.path}
        style={{ textDecoration: 'none', color: 'inherit' }}>
        <ListItemButton>
          {Icon && (
            <ListItemIcon>
              <Icon color='primary' />
            </ListItemIcon>
          )}
          <ListItemText primary={value.title || key} />
        </ListItemButton>
      </Link>
    );
  };

  return (
    <Box sx={{ textAlign: 'center', mt: 5 }}>
      <Typography variant='h4' sx={{ mb: 3 }}>
        مرحباً، {user?.name || 'مستخدم'}
      </Typography>

      <Box
        sx={{
          maxWidth: 500,
          mx: 'auto',
          textAlign: 'right',
          bgcolor: '#fafafa',
          borderRadius: 2,
          boxShadow: 1,
        }}>
        <List>
          {Object.entries(paths).map(([key, value]) =>
            renderPathItem(key, value)
          )}
        </List>
      </Box>
    </Box>
  );
}
