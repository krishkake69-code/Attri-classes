import type { VercelRequest, VercelResponse } from '@vercel/node';
import { ADMIN_TOKEN, ADMIN_PASSWORD } from '../server-utils';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { session, login } = req.query;

  if (req.method === 'POST' && login) {
    const { password } = req.body;
    if (password === ADMIN_PASSWORD) {
      return res.json({ success: true, token: ADMIN_TOKEN });
    }
    return res.status(401).json({ success: false, error: 'Incorrect password' });
  }

  if (req.method === 'GET' && session) {
    const authHeader = req.headers.authorization;
    if (authHeader === `Bearer ${ADMIN_TOKEN}`) {
      return res.json({ authenticated: true });
    }
    return res.status(401).json({ authenticated: false });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}