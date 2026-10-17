import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { kv } from '@vercel/kv';

const dataFilePath = path.join(process.cwd(), 'src', 'data-store.json');
const DATA_KEY = 'attri:data-store';

/* ------------------------------------------------------------------ */
/* Data store (Vercel KV in production, local JSON file otherwise)     */
/* ------------------------------------------------------------------ */

async function readFromKV() {
  try {
    const data = await kv.get(DATA_KEY);
    if (data) return data;
  } catch (err) {
    console.error('Error reading from KV:', err);
  }
  return null;
}

async function writeToKV(data: any) {
  try {
    await kv.set(DATA_KEY, data);
    return true;
  } catch (err) {
    console.error('Error writing to KV:', err);
    return false;
  }
}

function readFromFile() {
  try {
    if (fs.existsSync(dataFilePath)) {
      const dataStr = fs.readFileSync(dataFilePath, 'utf8');
      return JSON.parse(dataStr);
    }
  } catch (err) {
    console.error('Error reading data file:', err);
  }
  return null;
}

function writeToFile(data: any) {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Error writing to data file:', err);
    return false;
  }
}

export async function readDataStore() {
  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    return await readFromKV();
  }
  return readFromFile();
}

export async function writeDataStore(data: any) {
  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    return await writeToKV(data);
  }
  return writeToFile(data);
}

/* ------------------------------------------------------------------ */
/* Auth                                                                */
/*                                                                     */
/* Sessions are HMAC-signed stateless tokens with a 7-day expiry.      */
/* The signing secret is AUTH_SECRET when set, otherwise derived from  */
/* the admin password. Tokens are random per login and cannot be       */
/* reversed into the password. There is NO hardcoded fallback password:*/
/* if ADMIN_PASSWORD is not configured, admin login is disabled.       */
/* ------------------------------------------------------------------ */

const TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export function getAdminPassword(): string | null {
  const pw = process.env.ADMIN_PASSWORD;
  return pw && pw.trim() ? pw : null;
}

function getAuthSecret(): string | null {
  if (process.env.AUTH_SECRET && process.env.AUTH_SECRET.trim()) {
    return process.env.AUTH_SECRET.trim();
  }
  const password = getAdminPassword();
  if (!password) return null;
  // Derive a signing key from the password so tokens are not simply the
  // password reversed, and cannot be turned back into the password.
  return crypto.createHash('sha256').update(`attri-session:${password}`).digest('hex');
}

/** Constant-time string comparison to avoid timing side channels. */
export function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) {
    // Still perform a comparison to keep timing uniform-ish.
    crypto.timingSafeEqual(bufA, bufA);
    return false;
  }
  return crypto.timingSafeEqual(bufA, bufB);
}

/** Issues a signed session token. Returns null when auth is not configured. */
export function createSessionToken(): string | null {
  const secret = getAuthSecret();
  if (!secret) return null;

  const payload = Buffer.from(
    JSON.stringify({
      exp: Date.now() + TOKEN_TTL_MS,
      nonce: crypto.randomBytes(8).toString('hex'),
    })
  ).toString('base64url');

  const signature = crypto.createHmac('sha256', secret).update(payload).digest('base64url');
  return `${payload}.${signature}`;
}

/** Verifies a session token: signature valid and not expired. */
export function verifySessionToken(token: string | undefined | null): boolean {
  const secret = getAuthSecret();
  if (!secret || !token) return false;

  const parts = token.split('.');
  if (parts.length !== 2) return false;
  const [payload, signature] = parts;
  if (!payload || !signature) return false;

  const expected = crypto.createHmac('sha256', secret).update(payload).digest('base64url');
  if (!safeEqual(signature, expected)) return false;

  try {
    const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    if (typeof decoded?.exp !== 'number') return false;
    return decoded.exp > Date.now();
  } catch {
    return false;
  }
}

/** Extracts a Bearer token from an Authorization header. */
export function bearerToken(header: string | undefined): string | null {
  if (!header || !header.startsWith('Bearer ')) return null;
  return header.slice(7) || null;
}
