import { defineConfig } from 'prisma/config';
import { getDatabaseUrl } from './src/config/database-config.js';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx src/scripts/seed.ts',
  },
  datasource: {
    url: getDatabaseUrl(),
  },
});
