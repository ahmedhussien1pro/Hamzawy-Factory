import prisma from '../prisma/client';

/**
 * Generic duplicate checker
 * @param model - e.g. prisma.user, prisma.product
 * @param field - field name to check (string)
 * @param value - value to check
 */
export async function checkDuplicate(model: any, field: string, value: any) {
  const record = await model.findUnique({
    where: { [field]: value },
  });
  if (record) {
    throw new Error(`${field} already exists`);
  }
  return false;
}
