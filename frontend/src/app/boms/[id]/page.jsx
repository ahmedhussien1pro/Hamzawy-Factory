// src/app/boms/[id]/page.jsx
'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Container,
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
  Button,
  Divider,
  TextField,
  Stack,
  Tooltip,
} from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import DownloadIcon from '@mui/icons-material/Download';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CalculateIcon from '@mui/icons-material/Calculate';
import { getBOMById } from '@/services/bomService';
import { getProductById } from '@/services/productService';
import { useAuth } from '@/context/AuthContext';

function safeNum(v, fallback = 0) {
  if (v === null || v === undefined || v === '') return fallback;
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

function roundTo(n, digits = 3) {
  const p = Math.pow(10, digits);
  return Math.round(n * p) / p;
}

export default function BomDetails() {
  const { id } = useParams();
  const router = useRouter();
  const { token } = useAuth();

  const [bom, setBom] = useState(null);
  const [loading, setLoading] = useState(true);

  const [unitsMode, setUnitsMode] = useState('units'); // 'units' | 'dimension'
  const [units, setUnits] = useState(1);
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [Bfactor, setBfactor] = useState(1);
  const [calc, setCalc] = useState(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await getBOMById(id, token);
        // service returns res?.data or res
        const data = res?.data?.data || res?.data || res;
        if (!data) {
          setBom(null);
          return;
        }

        // Ensure components product objects exist; if only productId provided, fetch product
        const comps = data.components || [];
        const needFetch = comps
          .filter((c) => !c.product && c.productId)
          .map((c) => c.productId);
        if (needFetch.length > 0) {
          // fetch missing products in parallel (deduplicate ids)
          const ids = Array.from(new Set(needFetch));
          const fetches = await Promise.allSettled(
            ids.map((pid) => getProductById(pid, token))
          );
          const map = {};
          fetches.forEach((p, idx) => {
            if (p.status === 'fulfilled') {
              const payload = p.value?.data?.data || p.value?.data || p.value;
              map[ids[idx]] = payload || null;
            } else {
              map[ids[idx]] = null;
            }
          });
          // attach product objects back to components
          data.components = comps.map((c) => ({
            ...c,
            product: c.product || map[c.productId] || null,
          }));
        }

        setBom({
          ...data,
          wasteFactor: data.wasteFactor ?? 0,
        });
      } catch (e) {
        console.error('fetch BOM error', e);
        alert('حدث خطأ أثناء جلب بيانات الـ BOM.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id, token]);

  function compute() {
    if (!bom) return;
    let computedUnits = Math.max(0, safeNum(units, 0));
    if (unitsMode === 'dimension') {
      const w = safeNum(width, 0);
      const h = safeNum(height, 0);
      const B = safeNum(Bfactor, 0);
      if (!w || !h || !B) {
        alert('يرجى إدخال الطول و العرض و B صحيحين.');
        return;
      }
      // هنا استخدمنا الصيغة اللي اتفقتوا عليها: units = ceil((width * height) / B)
      computedUnits = Math.ceil((w * h) / B);
    }

    const wf = safeNum(bom.wasteFactor, 0); // قد يكون decimal string
    const rows = (bom.components || []).map((c) => {
      const qtyPerUnit = safeNum(c.qtyPerUnit ?? c.qty_per_unit ?? 0, 0);
      const requiredRaw = qtyPerUnit * computedUnits * (1 + wf);
      const required = roundTo(requiredRaw, 3);
      const inStock = safeNum(c.product?.quantity ?? c.currentStock ?? 0, 0);
      const shortage = Math.max(0, Math.ceil(required - inStock));
      return {
        productId:
          c.product?.id ?? c.productId ?? (c.product && c.product.id) ?? c.id,
        productName: c.product?.name ?? c.product?.sku ?? '—',
        sku: c.product?.sku ?? '—',
        unit: c.product?.unit ?? '—',
        qtyPerUnit,
        required,
        inStock,
        shortage,
      };
    });

    setCalc({ computedUnits, rows });
  }

  function printView() {
    window.print();
  }

  function downloadCSV() {
    if (!calc) {
      alert('يرجى إجراء عملية الحساب أولاً (احسب) قبل التصدير.');
      return;
    }
    const header = [
      'productId',
      'productName',
      'sku',
      'unit',
      'qtyPerUnit',
      'required',
      'inStock',
      'shortage',
    ];
    const lines = [header.join(',')];
    calc.rows.forEach((r) => {
      // escape commas by wrapping fields in quotes
      const row = [
        `"${r.productId}"`,
        `"${r.productName}"`,
        `"${r.sku}"`,
        `"${r.unit}"`,
        r.qtyPerUnit,
        r.required,
        r.inStock,
        r.shortage,
      ].join(',');
      lines.push(row);
    });
    const blob = new Blob([lines.join('\n')], {
      type: 'text/csv;charset=utf-8;',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${bom?.code || bom?.name || 'bom'}-suggestion.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function suggestPurchase() {
    if (!calc) {
      alert('نفّذ الحساب أولاً لتوليد اقتراح الشراء.');
      return;
    }
    const items = calc.rows
      .filter((r) => r.shortage > 0)
      .map((r) => ({
        productId: r.productId,
        qty: r.shortage,
        sku: r.sku,
        name: r.productName,
      }));

    if (items.length === 0) {
      alert('لا توجد عناصر ناقصة — لا حاجة لاقتراح شراء.');
      return;
    }

    // حفظ الاقتراح مؤقتًا في localStorage وفتح صفحة إنشاء مشتريات جديدة
    const suggestion = {
      source: 'bom',
      bomId: id,
      bomCode: bom?.code,
      computedUnits: calc.computedUnits,
      items,
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem('purchaseSuggestion', JSON.stringify(suggestion));
    router.push(`/purchases/new?fromBom=${encodeURIComponent(id)}`);
  }

  if (loading) {
    return (
      <Container maxWidth='lg' sx={{ py: 3 }}>
        <Typography>جارٍ التحميل...</Typography>
      </Container>
    );
  }

  if (!bom) {
    return (
      <Container maxWidth='lg' sx={{ py: 3 }}>
        <Typography color='error'>
          لم يتم العثور على الـ BOM المطلوب.
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth='lg' sx={{ py: 3 }} dir='rtl'>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
        }}>
        <Typography variant='h5'>{bom.name} — BOM</Typography>

        <Stack direction='row' spacing={1}>
          <Tooltip title='طباعة'>
            <Button
              variant='outlined'
              startIcon={<PrintIcon />}
              onClick={printView}>
              طباعة
            </Button>
          </Tooltip>

          <Tooltip title='تنزيل CSV للاقتراح'>
            <Button
              variant='outlined'
              startIcon={<DownloadIcon />}
              onClick={downloadCSV}>
              تنزيل CSV
            </Button>
          </Tooltip>

          <Tooltip title='إنشاء اقتراح شراء من النواقص'>
            <Button
              variant='contained'
              startIcon={<ShoppingCartIcon />}
              onClick={suggestPurchase}>
              اقتراح شراء
            </Button>
          </Tooltip>
        </Stack>
      </Box>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography>كود: {bom.code ?? '—'}</Typography>
        <Typography>الاسم: {bom.name ?? '—'}</Typography>
        <Typography>
          وقت التصنيع (دقائق): {bom.expectedManufactureTime ?? '—'}
        </Typography>
        <Typography>عامل الهدر: {bom.wasteFactor ?? 0}</Typography>
      </Paper>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant='h6'>حساب الكميات</Typography>
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            mt: 1,
            flexWrap: 'wrap',
            alignItems: 'center',
          }}>
          <Button
            variant={unitsMode === 'units' ? 'contained' : 'outlined'}
            onClick={() => setUnitsMode('units')}>
            حسب عدد وحدات
          </Button>
          <Button
            variant={unitsMode === 'dimension' ? 'contained' : 'outlined'}
            onClick={() => setUnitsMode('dimension')}>
            حسب الطول × العرض
          </Button>

          {unitsMode === 'units' ? (
            <TextField
              label='عدد الوحدات'
              type='number'
              value={units}
              onChange={(e) => setUnits(e.target.value)}
              sx={{ width: 160 }}
            />
          ) : (
            <>
              <TextField
                label='الطول'
                type='number'
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                sx={{ width: 120 }}
              />
              <TextField
                label='العرض'
                type='number'
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                sx={{ width: 120 }}
              />
              <TextField
                label='B (عامل)'
                type='number'
                value={Bfactor}
                onChange={(e) => setBfactor(e.target.value)}
                sx={{ width: 120 }}
              />
            </>
          )}

          <Button
            variant='contained'
            startIcon={<CalculateIcon />}
            onClick={compute}>
            احسب
          </Button>
        </Box>
      </Paper>

      {calc && (
        <>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant='subtitle1'>
              وحدات محسوبة: {calc.computedUnits}
            </Typography>
          </Paper>

          <Paper sx={{ mb: 2, p: 1 }}>
            <Table size='small'>
              <TableHead>
                <TableRow>
                  <TableCell>المنتج</TableCell>
                  <TableCell>كمية لكل وحدة</TableCell>
                  <TableCell>المطلوب</TableCell>
                  <TableCell>المخزون الحالي</TableCell>
                  <TableCell>مقترح شراء</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {calc.rows.map((r) => (
                  <TableRow key={r.productId}>
                    <TableCell>
                      {r.productName} {r.sku && `(${r.sku})`}
                    </TableCell>
                    <TableCell>
                      {r.qtyPerUnit} {r.unit}
                    </TableCell>
                    <TableCell>{r.required}</TableCell>
                    <TableCell>{r.inStock}</TableCell>
                    <TableCell
                      sx={{ color: r.shortage > 0 ? 'crimson' : 'green' }}>
                      {r.shortage > 0 ? r.shortage : 'لا'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </>
      )}

      <Divider sx={{ my: 2 }} />

      <Typography variant='h6'>مكونات الـ BOM</Typography>
      <Paper sx={{ mt: 1, mb: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>المنتج</TableCell>
              <TableCell>كمية لكل وحدة</TableCell>
              <TableCell>الوحدة</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(bom.components || []).map((c, idx) => (
              <TableRow key={c.product?.id ?? c.productId ?? idx}>
                <TableCell>
                  {c.product?.name ?? c.product?.sku ?? '—'}
                </TableCell>
                <TableCell>{c.qtyPerUnit ?? '—'}</TableCell>
                <TableCell>{c.product?.unit ?? '—'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      <style>{`
        @media print {
          body * { visibility: visible; }
          #__next * { visibility: visible; }
          .no-print, button, a { display: none !important; }
        }
        /* improve table wrapping on small screens */
        table { word-break: break-word; }
      `}</style>
    </Container>
  );
}
