import bcrypt from 'bcrypt';
import { Prisma } from '../../generated/prisma/client.js';
import { prisma } from '../../lib/prisma.js';
import type { RegisterBody } from './auth.schema.js';

export async function register(body: RegisterBody) {
  const passwordHash = await bcrypt.hash(body.password, 12);
  try {
    return await prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        passwordHash,
        role: 'CUSTOMER',
        isBookingBlocked: false,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isBookingBlocked: true,
        createdAt: true,
      },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      // This adapter omits meta.target; confirm email rather than treating every unique conflict as an email conflict.
      const existingUser = await prisma.user.findUnique({
        where: { email: body.email },
        select: { id: true },
      });
      if (existingUser) {
        return null;
      }
    }
    throw error;
  }
}
