import { UserRole } from '@prisma/client';
import prisma from '../prisma/client';
import { hashPassword } from '../utils/password';

export async function getUsers() {
  return prisma.user.findMany();
}

export async function getUserById(id: string) {
  return prisma.user.findUnique({ where: { id } });
}

export async function createUser(data: {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role?: UserRole;
  isLocked?: boolean;
}) {
  const passwordHash = await hashPassword(data.password);

  return prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone,
      passwordHash, // ✅ الحقل الصحيح في الـ model
      role: data.role || 'WAREHOUSE_STAFF',
      isLocked: data.isLocked ?? false,
    },
  });
}

export async function updateUser(id: string, data: any) {
  const updateData: any = { ...data };

  if (updateData.password && updateData.password.trim() !== '') {
    const hashed = await hashPassword(updateData.password);
    updateData.passwordHash = hashed;
  }

  delete updateData.password;

  Object.keys(updateData).forEach((key) => {
    if (
      updateData[key] === null ||
      updateData[key] === undefined ||
      updateData[key] === ''
    ) {
      delete updateData[key];
    }
  });

  console.log('🟢 Updating user with:', updateData);

  return prisma.user.update({
    where: { id },
    data: updateData,
  });
}

export async function deleteUser(id: string) {
  return prisma.user.delete({ where: { id } });
}
