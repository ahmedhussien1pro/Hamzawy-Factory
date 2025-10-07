import prisma from '../prisma/client';

type RecordPayload = {
  productId: string;
  type: 'IN' | 'OUT' | 'ADJUST';
  reason: string;
  quantity: number;
  notes?: string;
  relatedEntityId?: string | null;
  performedById?: string | null;
  unitCost?: number | null;
  adjustTo?: number | null;
};

export async function recordMovement(data: RecordPayload) {
  const {
    productId,
    type,
    reason,
    quantity = 0,
    notes,
    relatedEntityId,
    performedById,
    unitCost,
    adjustTo,
  } = data as RecordPayload;

  if (!productId) throw new Error('Missing productId');
  if (!type) throw new Error('Missing type (IN|OUT|ADJUST)');
  if (typeof quantity !== 'number' && typeof adjustTo !== 'number')
    throw new Error('Missing/invalid quantity or adjustTo');

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) throw new Error('Product not found');

  const unitCostSnapshot = unitCost ?? Number(product.purchasePrice ?? 0);

  let newQty: number;
  if (type === 'IN') {
    newQty = (product.quantity ?? 0) + Math.abs(quantity);
  } else if (type === 'OUT') {
    newQty = (product.quantity ?? 0) - Math.abs(quantity);
    if (newQty < 0) {
      throw new Error('Insufficient product quantity for OUT movement');
    }
  } else if (type === 'ADJUST') {
    if (typeof adjustTo === 'number') {
      newQty = adjustTo;
    } else {
      newQty = (product.quantity ?? 0) + Number(quantity);
    }
  } else {
    throw new Error('Invalid movement type');
  }

  const result = await prisma.$transaction(async (tx) => {
    const updatedProduct = await tx.product.update({
      where: { id: productId },
      data: { quantity: newQty },
    });

    const movement = await tx.inventoryMovement.create({
      data: {
        productId,
        type,
        reason: reason as any,
        quantity: Math.abs(quantity),
        performedById: performedById ?? null,
        relatedEntityId: relatedEntityId ?? null,
        unitCostSnapshot:
          typeof unitCostSnapshot === 'number'
            ? unitCostSnapshot.toString()
            : unitCostSnapshot,
        remainingAfter: newQty,
        notes: notes ?? null,
      },
      include: {
        product: true,
        performedBy: true,
      },
    });

    return { movement, updatedProduct };
  });

  return result.movement;
}

export async function getMovements(filters: any = {}) {
  const { productId, type, reason, from, to, page = 1, limit = 50 } = filters;

  const where: any = {};
  if (productId) where.productId = productId;
  if (type) where.type = type;
  if (reason) where.reason = reason;
  if (from || to) {
    where.createdAt = {};
    if (from) where.createdAt['gte'] = new Date(from);
    if (to) where.createdAt['lte'] = new Date(to);
  }

  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    prisma.inventoryMovement.findMany({
      where,
      include: { product: true, performedBy: true },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.inventoryMovement.count({ where }),
  ]);

  return { items, total, page, limit };
}
