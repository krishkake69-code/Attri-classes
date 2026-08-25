import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getAdminToken, getAdminPassword } from '../lib/kv-store';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const ADMIN_TOKEN = getAdminToken();
  const ADMIN_PASSWORD = getAdminPassword();

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { password } = req.body;
  if (password === ADMIN_PASSWORD) {
    return res.json({ success: true, token: ADMIN_TOKEN });
  }
  return res.status(401).json({ success: false, error: 'Incorrect password' });
}