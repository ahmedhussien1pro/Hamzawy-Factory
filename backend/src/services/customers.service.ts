// src/services/customers.service.ts
import prisma from '../prisma/client';

export async function getCustomers() {
  return prisma.customer.findMany({ include: { orders: true } });
}

export async function getCustomerById(id: string) {
  return prisma.customer.findUnique({
    where: { id },
    include: { orders: true },
  });
}

export async function createCustomer(data: {
  name: string;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  notes?: string | null;
}) {
  return prisma.customer.create({ data });
}

export async function updateCustomer(id: string, data: any) {
  return prisma.customer.update({ where: { id }, data });
}

export async function deleteCustomer(id: string) {
  return prisma.customer.delete({ where: { id } });
}
