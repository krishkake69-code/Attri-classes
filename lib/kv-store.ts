const DATA_KEY = 'attri:data-store';

let kvClient: any = null;

async function getKv() {
  if (!kvClient) {
    const { kv } = await import('@vercel/kv');
    kvClient = kv;
  }
  return kvClient;
}

export async function readDataStore() {
  try {
    const kv = await getKv();
    const data = await kv.get(DATA_KEY);
    if (data) return data;
  } catch (err) {
    console.error('KV read error:', err);
  }
  return null;
}

export async function writeDataStore(data: any) {
  try {
    const kv = await getKv();
    await kv.set(DATA_KEY, data);
    return true;
  } catch (err) {
    console.error('KV write error:', err);
    return false;
  }
}

export function getAdminToken(): string {
  const password = process.env.ADMIN_PASSWORD || 'AttriChem2026Admin!';
  return 'attri_session_token_' + password.split('').reverse().join('');
}

export function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD || 'AttriChem2026Admin!';
}