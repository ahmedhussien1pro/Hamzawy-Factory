import prisma from '../prisma/client';
import { JobStatus } from '@prisma/client';

export async function createJob(data: any) {
  return prisma.manufacturingJob.create({ data });
}

export async function updateJobStatus(id: string, status: JobStatus) {
  return prisma.manufacturingJob.update({
    where: { id },
    data: { status },
  });
}

export async function getJobs() {
  return prisma.manufacturingJob.findMany({
    include: { targetProduct: true, bom: true },
  });
}
