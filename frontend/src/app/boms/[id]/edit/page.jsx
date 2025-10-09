// src/app/boms/[id]/edit/page.jsx
'use client';
import { useEffect, useState } from 'react';
import {
  Container,
  Box,
  Typography,
  CircularProgress,
  Alert,
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import BOMForm from '@/components/boms/BOMForm';
import { useAuth } from '@/context/AuthContext';
import * as bomService from '@/services/bomService';
import { getProductById } from '@/services/productService';
import { useRouter, useParams } from 'next/navigation';

const theme = createTheme({
  direction: 'rtl',
  palette: { primary: { main: '#1e40af' } },
});

export default function EditBOMPage() {
  const { token } = useAuth();
  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  const [initial, setInitial] = useState(null); // initial shape expected by BOMForm
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    let mounted = true;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await bomService.getBOMById(id, token);
        const data = res?.data?.data ?? res?.data ?? res; // support shapes

        if (!data) {
          throw new Error('لم يتم العثور على الـ BOM');
        }

        // components may have product object or only productId
        const comps = Array.isArray(data.components) ? data.components : [];

        // collect missing productIds
        const missingIds = comps
          .filter((c) => !c.product && (c.productId || c.product_id))
          .map((c) => c.productId ?? c.product_id);

        // dedupe
        const uniqMissing = Array.from(new Set(missingIds));

        const productMap = {};
        if (uniqMissing.length > 0) {
          // fetch in parallel
          const promises = uniqMissing.map((pid) =>
            getProductById(pid, token).catch((e) => {
              console.warn('Failed to fetch product', pid, e);
              return null;
            })
          );
          const results = await Promise.all(promises);
          results.forEach((r, idx) => {
            const payload = r?.data?.data ?? r?.data ?? r;
            productMap[uniqMissing[idx]] = payload ?? null;
          });
        }

        // build BOMForm initial object
        const mapped = {
          code: data.code ?? '',
          name: data.name ?? '',
          targetProduct: data.targetProduct ?? null, // if backend includes product object
          // if backend only has targetProductId, try to fetch (optional)
          wasteFactor: data.wasteFactor ?? 0,
          expectedManufactureTime: data.expectedManufactureTime ?? '',
          components: comps.map((c) => {
            const prodObj =
              c.product ?? productMap[c.productId ?? c.product_id] ?? null;
            // qty field naming can vary; try common variants
            const rawQty = c.qtyPerUnit ?? c.qty_per_unit ?? c.quantity ?? 0;
            return {
              product: prodObj,
              qtyPerUnit:
                typeof rawQty === 'string' ? Number(rawQty) : rawQty ?? 0,
            };
          }),
        };

        if (mounted) setInitial(mapped);
      } catch (err) {
        console.error('Error loading BOM for edit:', err);
        if (mounted) setError(err?.message || 'فشل تحميل بيانات الـ BOM');
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, [id, token]);

  async function handleSubmit(payload) {
    setSaving(true);
    setError(null);
    try {
      // payload is shaped by BOMForm (components: [{ productId, qtyPerUnit }...])
      await bomService.updateBOM(id, payload, token);
      // success — redirect to details page
      router.push(`/boms/${id}`);
    } catch (err) {
      console.error('Error updating BOM:', err);
      setError(
        err?.response?.data?.error ||
          err?.response?.data?.message ||
          err?.message ||
          'فشل التحديث'
      );
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setSaving(false);
    }
  }

  if (loading)
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ minHeight: '100vh', py: 6, px: 2 }} dir='rtl'>
        <Container maxWidth='md'>
          <Typography
            variant='h5'
            fontWeight={700}
            color='primary'
            sx={{ mb: 2 }}>
            تعديل BOM
          </Typography>

          {error && (
            <Alert severity='error' sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {initial ? (
            <BOMForm
              initial={initial}
              onSubmit={handleSubmit}
              saving={saving}
              token={token}
            />
          ) : (
            <Alert severity='info'>لا توجد بيانات لعرضها.</Alert>
          )}
        </Container>
      </Box>
    </ThemeProvider>
  );
}
