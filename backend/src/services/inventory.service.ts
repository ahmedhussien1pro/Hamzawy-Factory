import prisma from '../prisma/client';

export async function recordMovement(data: any) {
  return prisma.inventoryMovement.create({ data });
}

export async function getMovements() {
  return prisma.inventoryMovement.findMany({
    include: { product: true, performedBy: true },
  });
}
