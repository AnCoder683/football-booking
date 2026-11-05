import { loadEnvFile } from 'node:process';

// Both src/config/ and dist/config/ are three levels below the root .env.
loadEnvFile(new URL('../../../.env', import.meta.url));

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

export function getDatabaseUrl(): string {
  const user = encodeURIComponent(required('POSTGRES_USER'));
  const password = encodeURIComponent(required('POSTGRES_PASSWORD'));
  const database = encodeURIComponent(required('POSTGRES_DB'));
  const port = process.env.DB_PORT || '55435';

  // The backend currently runs on the host, outside Docker.
  return `postgresql://${user}:${password}@127.0.0.1:${port}/${database}`;
}
