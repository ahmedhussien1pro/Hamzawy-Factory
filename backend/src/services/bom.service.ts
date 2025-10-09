// src/services/bom.service.ts
import { Parser } from 'expr-eval';
import prisma from '../prisma/client';

type ComputeParams = Record<string, number | string | null>;

type ComputedItem = {
  productId: string;
  productName?: string | null;
  unit?: string | null;
  baseQty: number;
  qtyWithWaste: number;
  finalQty: number;
  roundMode?: string | null;
  unitCost?: number | null;
  totalCost?: number | null;
  note?: string | null;
  rawFormula?: string | null;
};

function toNumberSafe(v: any, fallback = 0) {
  if (v === null || v === undefined) return fallback;
  if (typeof v === 'number') return v;
  if (typeof v === 'string' && v.trim() === '') return fallback;
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

function applyRounding(value: number, mode?: string | null) {
  if (mode === 'CEIL') return Math.ceil(value);
  if (mode === 'FLOOR') return Math.floor(value);
  if (mode === 'ROUND') return Math.round(value);
  return Math.round((value + Number.EPSILON) * 1e6) / 1e6;
}

export async function computeBOM(
  bomId: string,
  inputParams: ComputeParams = {}
) {
  const bom = await prisma.bom.findUnique({
    where: { id: bomId },
    include: {
      components: {
        include: { product: true },
      },
      parameters: true,
    },
  });

  if (!bom) throw new Error('BOM not found');

  const ctx: Record<string, number> = {};
  if (bom.parameters && Array.isArray(bom.parameters)) {
    for (const p of bom.parameters) {
      const name = p.name;
      const def = toNumberSafe(p.default, NaN);
      if (!Number.isNaN(def)) ctx[name] = def;
    }
  }
  for (const k of Object.keys(inputParams || {})) {
    const raw = inputParams[k];
    ctx[k] = toNumberSafe(raw, NaN);
  }

  const wasteFactor = toNumberSafe(bom.wasteFactor ?? 0, 0);

  const results: ComputedItem[] = [];

  for (const comp of bom.components) {
    let baseQty = 0;
    let usedFormula: string | null = null;

    if (comp.quantityFormula && comp.quantityFormula.trim() !== '') {
      usedFormula = comp.quantityFormula;
      try {
        const parser = new Parser({
          operators: {
            add: true,
            subtract: true,
            multiply: true,
            divide: true,
            power: true,
            factorial: false,
            logical: false,
            comparison: true,
            conditional: false,
          },
        });
        const expr = parser.parse(comp.quantityFormula);
        const evalResult = expr.evaluate(ctx);
        baseQty = toNumberSafe(evalResult, 0);
      } catch (e) {
        console.warn(`Failed to evaluate formula for component ${comp.id}:`, e);
        baseQty = comp.qtyPerUnit ? Number(comp.qtyPerUnit) : 0;
      }
    } else if (comp.qtyPerUnit != null) {
      const qtyParam = ctx.qty ?? 1;
      baseQty = Number(comp.qtyPerUnit) * Number(qtyParam);
    } else {
      baseQty = 0;
    }

    const qtyWithWaste = baseQty * (1 + wasteFactor);

    const finalQty = applyRounding(
      Number(qtyWithWaste),
      comp.roundMode ?? null
    );

    const unitCost = comp.product?.purchasePrice
      ? Number(comp.product.purchasePrice)
      : 0;
    const totalCost = Number(finalQty) * unitCost;

    results.push({
      productId: comp.productId,
      productName: comp.product?.name ?? null,
      unit: comp.unit ?? comp.product?.unit ?? null,
      baseQty: Number(baseQty),
      qtyWithWaste: Number(qtyWithWaste),
      finalQty: Number(finalQty),
      roundMode: comp.roundMode ?? null,
      unitCost: unitCost ?? null,
      totalCost: totalCost ?? null,
      note: comp.note ?? null,
      rawFormula: usedFormula,
    });
  }

  const summary = {
    bomId: bom.id,
    bomCode: bom.code,
    bomName: bom.name,
    params: inputParams,
    wasteFactor,
    items: results,
    totalCost: results.reduce((s, it) => s + (it.totalCost ?? 0), 0),
  };

  return summary;
}
