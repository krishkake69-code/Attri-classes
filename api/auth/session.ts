import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getAdminToken } from '../lib/kv-store';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const ADMIN_TOKEN = getAdminToken();

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const authHeader = req.headers.authorization;
  if (authHeader === `Bearer ${ADMIN_TOKEN}`) {
    return res.json({ authenticated: true });
  }
  return res.status(401).json({ authenticated: false });
}