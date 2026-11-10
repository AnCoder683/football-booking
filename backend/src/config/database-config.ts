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
  if (process.env.NODE_ENV === 'test') {
    const testUrl = required('TEST_DATABASE_URL');
    if (!URL.canParse(testUrl)) {
      throw new Error('TEST_DATABASE_URL must be a valid URL');
    }

    const url = new URL(testUrl);
    if (url.protocol !== 'postgresql:' && url.protocol !== 'postgres:') {
      throw new Error('TEST_DATABASE_URL must use PostgreSQL');
    }
    if (url.pathname !== '/football_booking_test' || url.search || url.hash) {
      throw new Error('TEST_DATABASE_URL must point to football_booking_test without query parameters or fragments');
    }
    if (required('POSTGRES_DB') === 'football_booking_test') {
      throw new Error('Development and test databases must have different names');
    }
    return testUrl;
  }

  const user = encodeURIComponent(required('POSTGRES_USER'));
  const password = encodeURIComponent(required('POSTGRES_PASSWORD'));
  const database = encodeURIComponent(required('POSTGRES_DB'));
  const port = process.env.DB_PORT || '55435';

  // The backend currently runs on the host, outside Docker.
  return `postgresql://${user}:${password}@127.0.0.1:${port}/${database}`;
}
