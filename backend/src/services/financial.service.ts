import prisma from '../prisma/client';

export async function recordTransaction(data: any) {
  return prisma.financialTransaction.create({ data });
}

export async function recordPayment(data: any) {
  return prisma.payment.create({ data });
}

export async function getTransactions() {
  return prisma.financialTransaction.findMany({
    include: { recordedBy: true },
  });
}

export async function getPayments() {
  return prisma.payment.findMany({
    include: { order: true, recordedBy: true },
  });
}
