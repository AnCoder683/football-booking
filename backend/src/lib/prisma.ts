import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client.js';
import { getDatabaseUrl } from '../config/database-config.js';

const adapter = new PrismaPg({
  connectionString: getDatabaseUrl(),
  connectionTimeoutMillis: 5000,
});

export const prisma = new PrismaClient({ adapter });
