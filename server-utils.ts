import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { kv } from '@vercel/kv';

const dataFilePath = path.join(process.cwd(), 'src', 'data-store.json');
const extFilePath = path.join(process.cwd(), 'src', 'student-data.json');
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
    console.error('Error writing data file:', err);
    return false;
  }
}

/* ------------------------------------------------------------------ */
/* In-memory read cache (short TTL) to cut KV reads under load         */
/* ------------------------------------------------------------------ */

const CACHE_TTL_MS = 5000;
let dataStoreCache: { data: any; ts: number } | null = null;

function getCachedStore(): any | null {
  if (dataStoreCache && Date.now() - dataStoreCache.ts < CACHE_TTL_MS) {
    return dataStoreCache.data;
  }
  return null;
}

function setCachedStore(data: any) {
  dataStoreCache = { data, ts: Date.now() };
}

export function invalidateStoreCache() {
  dataStoreCache = null;
}

export async function readDataStore() {
  const cached = getCachedStore();
  if (cached) return cached;
  let data: any = null;
  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    data = await readFromKV();
  } else {
    data = readFromFile();
  }
  if (data) setCachedStore(data);
  return data;
}

export async function writeDataStore(data: any) {
  setCachedStore(data);
  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    return await writeToKV(data);
  }
  return writeToFile(data);
}

/* ------------------------------------------------------------------ */
/* Per-student auxiliary keys (attendance, marks)                      */
/*   KV: `attri:att:{id}` / `attri:marks:{id}`                         */
/*   File: single src/student-data.json map { key: value }             */
/* ------------------------------------------------------------------ */

function kvConfigured(): boolean {
  return !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

function readExtFile(): Record<string, any> {
  try {
    if (fs.existsSync(extFilePath)) {
      return JSON.parse(fs.readFileSync(extFilePath, 'utf8'));
    }
  } catch (err) {
    console.error('Error reading ext file:', err);
  }
  return {};
}

function writeExtFile(all: Record<string, any>): boolean {
  try {
    fs.writeFileSync(extFilePath, JSON.stringify(all, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Error writing ext file:', err);
    return false;
  }
}

export async function kvGet(key: string): Promise<any | null> {
  if (kvConfigured()) {
    try {
      const v = await kv.get(key);
      return v ?? null;
    } catch (err) {
      console.error('kvGet error:', err);
      return null;
    }
  }
  const all = readExtFile();
  return all[key] ?? null;
}

export async function kvSet(key: string, value: any): Promise<boolean> {
  if (kvConfigured()) {
    try {
      await kv.set(key, value);
      return true;
    } catch (err) {
      console.error('kvSet error:', err);
      return false;
    }
  }
  const all = readExtFile();
  all[key] = value;
  return writeExtFile(all);
}

export async function kvDel(key: string): Promise<boolean> {
  if (kvConfigured()) {
    try {
      await kv.del(key);
      return true;
    } catch (err) {
      console.error('kvDel error:', err);
      return false;
    }
  }
  const all = readExtFile();
  delete all[key];
  return writeExtFile(all);
}

export function attKey(studentId: string) {
  return `attri:att:${studentId}`;
}

export function marksKey(studentId: string) {
  return `attri:marks:${studentId}`;
}

/* ------------------------------------------------------------------ */
/* Passwords (bcrypt)                                                  */
/* ------------------------------------------------------------------ */

const BCRYPT_ROUNDS = 10;

/**
 * Async bcrypt so a login never blocks the Node event loop. The sync
 * variants would serialise every concurrent request behind ~50ms of
 * CPU each, which is exactly what causes "lag" under load.
 */
export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, BCRYPT_ROUNDS);
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  try {
    return await bcrypt.compare(plain, hash);
  } catch {
    return false;
  }
}

/* ------------------------------------------------------------------ */
/* Auth                                                                */
/*                                                                     */
/* Sessions are HMAC-signed stateless tokens with a 7-day expiry.      */
/* The signing secret is AUTH_SECRET when set, otherwise derived from  */
/* the admin password. Tokens are random per login and cannot be       */
/* reversed into the password. There is NO hardcoded fallback password:*/
/* if ADMIN_PASSWORD is not configured, admin login is disabled.       */
/*                                                                     */
/* Token payload includes `role` ('admin'|'student') and `sub`         */
/* (subject: 'admin' for admin, student id for student) so the same    */
/* signing scheme can carry two kinds of session.                      */
/* ------------------------------------------------------------------ */

const TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
const STUDENT_TOKEN_TTL_MS = 12 * 60 * 60 * 1000; // 12 hours (shorter for students)

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

function signPayload(payloadObj: Record<string, any>): string | null {
  const secret = getAuthSecret();
  if (!secret) return null;
  const payload = Buffer.from(JSON.stringify(payloadObj)).toString('base64url');
  const signature = crypto.createHmac('sha256', secret).update(payload).digest('base64url');
  return `${payload}.${signature}`;
}

function verifyAndDecode(token: string | undefined | null): Record<string, any> | null {
  const secret = getAuthSecret();
  if (!secret || !token) return null;

  const parts = token.split('.');
  if (parts.length !== 2) return null;
  const [payload, signature] = parts;
  if (!payload || !signature) return null;

  const expected = crypto.createHmac('sha256', secret).update(payload).digest('base64url');
  if (!safeEqual(signature, expected)) return null;

  try {
    const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    if (typeof decoded?.exp !== 'number') return null;
    if (decoded.exp <= Date.now()) return null;
    return decoded;
  } catch {
    return null;
  }
}

/** Issues a signed ADMIN session token. Returns null when auth is not configured. */
export function createSessionToken(): string | null {
  return signPayload({
    sub: 'admin',
    role: 'admin',
    exp: Date.now() + TOKEN_TTL_MS,
    nonce: crypto.randomBytes(8).toString('hex'),
  });
}

/** Issues a signed STUDENT session token bound to a student id. */
export function createStudentSessionToken(studentId: string): string | null {
  if (!studentId) return null;
  return signPayload({
    sub: studentId,
    role: 'student',
    exp: Date.now() + STUDENT_TOKEN_TTL_MS,
    nonce: crypto.randomBytes(8).toString('hex'),
  });
}

/** Verifies an ADMIN session token: signature valid, not expired, role=admin. */
export function verifySessionToken(token: string | undefined | null): boolean {
  const decoded = verifyAndDecode(token);
  if (!decoded) return false;
  // Backward-compat: older admin tokens had no `role` field.
  if (decoded.role === undefined) return true;
  return decoded.role === 'admin';
}

/** Verifies a STUDENT session token and returns the student id, or null. */
export function verifyStudentSessionToken(token: string | undefined | null): string | null {
  const decoded = verifyAndDecode(token);
  if (!decoded || decoded.role !== 'student') return null;
  if (typeof decoded.sub !== 'string' || !decoded.sub) return null;
  return decoded.sub;
}

/** Extracts a Bearer token from an Authorization header. */
export function bearerToken(header: string | undefined): string | null {
  if (!header || !header.startsWith('Bearer ')) return null;
  return header.slice(7) || null;
}
