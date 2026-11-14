import { createHash, randomBytes, randomUUID } from 'node:crypto';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Prisma } from '../../generated/prisma/client.js';
import { prisma } from '../../lib/prisma.js';
import { getJwtAccessSecret } from '../../config/auth-config.js';
import type { LoginBody, RegisterBody } from './auth.schema.js';

export async function getMe(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isBookingBlocked: true,
    },
  });
}

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

export async function login(body: LoginBody) {
  const user = await prisma.user.findUnique({
    where: { email: body.email },
    select: {
      id: true,
      name: true,
      email: true,
      passwordHash: true,
      role: true,
      isBookingBlocked: true,
    },
  });
  if (!user) return null;

  const passwordMatches = await bcrypt.compare(body.password, user.passwordHash);
  if (!passwordMatches) return null;

  const refreshToken = randomBytes(32).toString('base64url');
  const tokenHash = createHash('sha256').update(refreshToken).digest('hex');

  const { passwordHash, ...publicUser } = user;
  const accessToken = jwt.sign({ role: user.role }, getJwtAccessSecret(), {
    algorithm: 'HS256',
    subject: user.id,
    expiresIn: 900,
  });

  const refreshTokenExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      familyId: randomUUID(),
      tokenHash,
      expiresAt: refreshTokenExpiresAt,
    },
  });

  return {
    refreshToken,
    refreshTokenExpiresAt,
    accessToken,
    tokenType: 'Bearer',
    expiresIn: 900,
    user: publicUser,
  };
}
