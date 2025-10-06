import { OrderStatus } from '@prisma/client';
import prisma from '../prisma/client';

export async function getOrders() {
  return prisma.order.findMany({ include: { items: true, customer: true } });
}

export async function createOrder(data: any) {
  return prisma.order.create({
    data: {
      ...data,
      items: {
        create: data.items,
      },
    },
    include: { items: true },
  });
}

export async function updateOrderStatus(id: string, status: OrderStatus) {
  return prisma.order.update({
    where: { id },
    data: { status },
  });
}

export async function deleteOrder(id: string) {
  return prisma.order.delete({ where: { id } });
}
