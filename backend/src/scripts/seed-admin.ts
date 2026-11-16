import bcrypt from 'bcrypt';
import { prisma } from '../lib/prisma.js';
import { registerBodySchema } from '../modules/auth/auth.schema.js';

async function seedAdmin() {
  const result = registerBodySchema.safeParse({
    name: 'Admin',
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD,
  });
  if (!result.success) {
    console.error('Seed ADMIN failed: cần ADMIN_EMAIL hợp lệ và ADMIN_PASSWORD ít nhất 15 ký tự, tối đa 72 byte UTF-8.');
    process.exitCode = 1;
    return;
  }

  const databases = await prisma.$queryRaw<{ name: string }[]>`SELECT current_database() AS name`;
  const expectedDatabase = process.env.NODE_ENV === 'test' ? 'football_booking_test' : process.env.POSTGRES_DB;
  if (databases[0]?.name !== expectedDatabase) {
    console.error('Seed ADMIN failed: database hiện tại không khớp cấu hình.');
    process.exitCode = 1;
    return;
  }

  const { email, password, name } = result.data;
  const existingUser = await prisma.user.findUnique({ where: { email }, select: { role: true } });
  if (existingUser) {
    if (existingUser.role === 'ADMIN') {
      console.log('Seed ADMIN OK: tài khoản đã tồn tại, giữ nguyên thông tin và mật khẩu.');
    } else {
      console.error('Seed ADMIN failed: email thuộc CUSTOMER, không tự nâng quyền.');
      process.exitCode = 1;
    }
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.user.create({ data: { name, email, passwordHash, role: 'ADMIN' } });
  console.log('Seed ADMIN OK: đã tạo tài khoản quản trị.');
}

try {
  await seedAdmin();
} catch {
  console.error('Seed ADMIN failed: kiểm tra kết nối DB, migration hoặc email trùng khi chạy đồng thời.');
  process.exitCode = 1;
} finally {
  await prisma.$disconnect();
}
