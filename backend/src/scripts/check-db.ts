import { prisma } from '../lib/prisma.js';

try {
  const result = await prisma.$queryRaw<{ value: number }[]>`SELECT 1 AS value`;
  if (result[0]?.value !== 1) {
    throw new Error('Unexpected database response');
  }
  console.log('Database connection OK: SELECT 1 returned 1');
} catch {
  // Do not print connection details or credentials in errors.
  console.error('Database check failed. Check local DB status and .env configuration.');
  process.exitCode = 1;
} finally {
  await prisma.$disconnect();
}
