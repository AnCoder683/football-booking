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

type UserRow = {
  id: string;
  role: string;
};

export async function refresh(refreshToken: string | undefined) {
  if (!refreshToken) return { status: 'UNAUTHENTICATED' as const };

  // DB chỉ lưu hash; lần tra này chỉ xác định User cần khóa, chưa quyết định token hợp lệ.
  const tokenHash = createHash('sha256').update(refreshToken).digest('hex');
  const token = await prisma.refreshToken.findUnique({
    where: { tokenHash },
    select: { userId: true },
  });
  if (!token) return { status: 'UNAUTHENTICATED' as const };

  return prisma.$transaction(async (tx) => {
    // FOR UPDATE lấy khóa dòng User; request khác xin cùng khóa phải chờ đến khi commit/rollback.
    const users = await tx.$queryRaw<UserRow[]>`
      SELECT "id", "role" FROM "User" WHERE "id" = ${token.userId}::uuid FOR UPDATE
    `;
    const user = users[0];
    if (!user) return { status: 'UNAUTHENTICATED' as const };

    // Đọc lại sau khi lấy khóa vì request trước có thể đã dùng hoặc thu hồi token trong lúc mình chờ.
    const currentToken = await tx.refreshToken.findUnique({
      where: { tokenHash, userId: user.id },
    });
    // usedAt: thời điểm token đã được dùng để đổi lấy token mới.
    // revokedAt: thời điểm bị thu hồi; ví dụ logout thu hồi cả token chưa dùng (usedAt vẫn null).
    // Token không còn tồn tại hoặc đã bị thu hồi thì từ chối refresh.
    if (!currentToken || currentToken.revokedAt !== null) {
      return { status: 'UNAUTHENTICATED' as const };
    }

    // Lấy thời gian sau khi chờ khóa; chạm đúng expiresAt cũng được coi là hết hạn.
    const now = new Date();
    if (currentToken.expiresAt <= now) {
      return { status: 'REFRESH_TOKEN_EXPIRED' as const };
    }

    if (currentToken.usedAt !== null) {
      // Reuse: thu hồi cả token mới trong cùng nhóm phiên, không ảnh hưởng lần đăng nhập khác.
      await tx.refreshToken.updateMany({
        where: { userId: user.id, familyId: currentToken.familyId, revokedAt: null },
        data: { revokedAt: now },
      });
      // Return để commit việc thu hồi; throw ở đây sẽ rollback và làm mất thay đổi đó.
      return { status: 'UNAUTHENTICATED' as const };
    }

    // Refresh token mới có hạn 7 ngày; access token dùng role hiện hành của User trong DB.
    const newRefreshToken = randomBytes(32).toString('base64url');
    const newTokenHash = createHash('sha256').update(newRefreshToken).digest('hex');
    const refreshTokenExpiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const accessToken = jwt.sign({ role: user.role }, getJwtAccessSecret(), {
      algorithm: 'HS256',
      subject: user.id,
      expiresIn: 900,
    });

    // Đánh dấu token cũ và lưu token mới cùng transaction: lỗi thì rollback cả hai.
    await tx.refreshToken.update({
      where: { id: currentToken.id },
      data: { usedAt: now },
    });
    await tx.refreshToken.create({
      data: {
        userId: user.id,
        familyId: currentToken.familyId,
        tokenHash: newTokenHash,
        expiresAt: refreshTokenExpiresAt,
      },
    });

    return {
      status: 'SUCCESS' as const,
      refreshToken: newRefreshToken,
      refreshTokenExpiresAt,
      accessToken,
      tokenType: 'Bearer',
      expiresIn: 900,
    };
  }, { isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted });
}
