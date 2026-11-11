import { loadEnvFile } from 'node:process';

loadEnvFile(new URL('../../../.env', import.meta.url));

export function getAppOrigin(): string {
  const origin = process.env.APP_ORIGIN;
  if (!origin) {
    throw new Error('Missing environment variable: APP_ORIGIN');
  }
  const url = new URL(origin);
  if (!['http:', 'https:'].includes(url.protocol) || url.origin !== origin) {
    throw new Error('APP_ORIGIN must be an HTTP(S) origin without a path or trailing slash');
  }
  return origin;
}

export function getJwtAccessSecret(): string {
  const secret = process.env.JWT_ACCESS_SECRET;
  if (!secret) {
    throw new Error('Missing environment variable: JWT_ACCESS_SECRET');
  }
  if (Buffer.byteLength(secret, 'utf8') < 32 || !secret.trim()) {
    throw new Error('JWT_ACCESS_SECRET must contain at least 32 bytes and not be blank');
  }
  return secret;
}
