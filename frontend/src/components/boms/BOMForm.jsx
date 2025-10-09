'use client';
import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  TextField,
  Button,
  IconButton,
  Paper,
  Grid,
  Typography,
  Autocomplete,
  Divider,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import { useTheme } from '@mui/material/styles';
import { searchProducts } from '@/services/productService';

export default function BOMForm({
  initial = {},
  onSubmit,
  token,
  saving = false,
}) {
  const theme = useTheme();
  const [form, setForm] = useState({
    code: initial.code || '',
    name: initial.name || '',
    targetProduct: initial.targetProduct || null, // whole product object
    wasteFactor: initial.wasteFactor ?? 0,
    expectedManufactureTime: initial.expectedManufactureTime || '',
    components:
      initial.components?.map((c) => ({
        product: c.product || null,
        qtyPerUnit: c.qtyPerUnit ?? 0,
      })) || [],
  });

  // search results per-row
  const [searchResults, setSearchResults] = useState({});
  const searchTimers = useRef({});

  useEffect(() => {
    // cleanup timers on unmount
    return () => {
      Object.values(searchTimers.current).forEach((t) => clearTimeout(t));
    };
  }, []);

  // debounce helper (no external lib)
  const doSearch = (query, rowIndex) => {
    if (searchTimers.current[rowIndex])
      clearTimeout(searchTimers.current[rowIndex]);

    // set a small delay
    searchTimers.current[rowIndex] = setTimeout(async () => {
      if (!query || query.trim().length < 1) {
        setSearchResults((s) => ({ ...s, [rowIndex]: [] }));
        return;
      }
      try {
        const res = await searchProducts(query, token);
        // searchProducts may return array or { items }
        const list = Array.isArray(res)
          ? res
          : res?.data ?? res?.items ?? res ?? [];
        setSearchResults((s) => ({ ...s, [rowIndex]: list }));
      } catch (err) {
        console.error('searchProducts error', err);
        setSearchResults((s) => ({ ...s, [rowIndex]: [] }));
      }
    }, 300);
  };

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  function handleComponentChange(index, key, value) {
    setForm((f) => {
      const components = [...f.components];
      components[index] = { ...components[index], [key]: value };
      return { ...f, components };
    });
  }

  function addComponent() {
    setForm((f) => ({
      ...f,
      components: [...f.components, { product: null, qtyPerUnit: 0 }],
    }));
  }

  function removeComponent(index) {
    setForm((f) => {
      const components = [...f.components];
      components.splice(index, 1);
      return { ...f, components };
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name || !form.name.trim()) return alert('يرجى إدخال اسم الـ BOM');

    // map payload to expected backend shape:
    const payload = {
      code: form.code || undefined,
      name: form.name,
      targetProductId: form.targetProduct?.id ?? null,
      wasteFactor:
        form.wasteFactor !== undefined && form.wasteFactor !== null
          ? String(form.wasteFactor)
          : undefined,
      expectedManufactureTime:
        form.expectedManufactureTime !== undefined &&
        form.expectedManufactureTime !== ''
          ? Number(form.expectedManufactureTime)
          : undefined,
      components: form.components
        .filter((c) => c.product && c.product.id)
        .map((c) => ({
          productId: c.product.id,
          qtyPerUnit: String(c.qtyPerUnit ?? 0),
        })),
    };

    // minimal validation
    if (payload.components.length === 0) {
      if (
        !confirm('لم تضف أي مكونات. هل تريد المتابعة وحفظ الـ BOM بدون مكونات؟')
      ) {
        return;
      }
    }

    // call parent handler
    onSubmit(payload);
  }

  return (
    <Paper sx={{ p: 3 }}>
      <form onSubmit={handleSubmit} dir='rtl'>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              label='كود الـ BOM'
              name='code'
              value={form.code}
              onChange={handleChange}
              fullWidth
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              label='اسم الـ BOM'
              name='name'
              value={form.name}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Autocomplete
              options={searchResults['target'] || []}
              getOptionLabel={(opt) =>
                opt ? `${opt.name}${opt.sku ? ` (${opt.sku})` : ''}` : ''
              }
              isOptionEqualToValue={(o, v) => o?.id === v?.id}
              value={form.targetProduct}
              onChange={(e, v) => setForm((f) => ({ ...f, targetProduct: v }))}
              onInputChange={(e, value) => doSearch(value, 'target')}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label='المنتج الهدف (اختياري)'
                  placeholder='ابحث باسم أو SKU'
                />
              )}
              fullWidth
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <TextField
              label='عامل الهدر (wasteFactor)'
              name='wasteFactor'
              value={form.wasteFactor}
              onChange={(e) =>
                setForm((f) => ({ ...f, wasteFactor: e.target.value }))
              }
              fullWidth
              type='number'
              inputProps={{ step: '0.0001' }}
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <TextField
              label='وقت التصنيع (دقائق)'
              name='expectedManufactureTime'
              value={form.expectedManufactureTime}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  expectedManufactureTime: e.target.value,
                }))
              }
              fullWidth
              type='number'
            />
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 1 }} />
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                mb: 2,
              }}>
              <Typography variant='h6'>مكونات الـ BOM</Typography>
              <Button
                startIcon={<AddIcon />}
                size='small'
                onClick={addComponent}>
                إضافة مكوّن
              </Button>
            </Box>

            {form.components.map((c, idx) => (
              <Grid
                container
                spacing={1}
                key={idx}
                sx={{ mb: 1, alignItems: 'center' }}>
                <Grid item xs={12} md={6}>
                  <Autocomplete
                    options={searchResults[idx] || []}
                    getOptionLabel={(opt) =>
                      opt ? `${opt.name}${opt.sku ? ` (${opt.sku})` : ''}` : ''
                    }
                    isOptionEqualToValue={(o, v) => o?.id === v?.id}
                    value={c.product}
                    onChange={(e, v) =>
                      handleComponentChange(idx, 'product', v)
                    }
                    onInputChange={(e, value) => doSearch(value, idx)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label='اختر/ابحث عن منتج'
                        placeholder='ابحث باسم أو SKU'
                      />
                    )}
                    fullWidth
                  />
                </Grid>

                <Grid item xs={8} md={4}>
                  <TextField
                    label='الكمية لكل وحدة (qtyPerUnit)'
                    value={c.qtyPerUnit}
                    onChange={(e) =>
                      handleComponentChange(
                        idx,
                        'qtyPerUnit',
                        Number(e.target.value)
                      )
                    }
                    type='number'
                    fullWidth
                    inputProps={{ step: '0.001' }}
                  />
                </Grid>

                <Grid
                  item
                  xs={4}
                  md={2}
                  sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <IconButton
                    color='error'
                    onClick={() => removeComponent(idx)}>
                    <DeleteIcon />
                  </IconButton>
                </Grid>
              </Grid>
            ))}
          </Grid>

          <Grid item xs={12} sx={{ mt: 2 }}>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button
                variant='contained'
                type='submit'
                startIcon={<SaveIcon />}
                disabled={saving}>
                {saving ? 'جاري الحفظ...' : 'حفظ'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
}
