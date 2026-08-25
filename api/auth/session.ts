import type { VercelRequest, VercelResponse } from '@vercel/node';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'AttriChem2026Admin!';
const ADMIN_TOKEN = 'attri_session_token_' + ADMIN_PASSWORD.split('').reverse().join('');

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const authHeader = req.headers.authorization;
  if (authHeader === `Bearer ${ADMIN_TOKEN}`) {
    return res.json({ authenticated: true });
  }
  return res.status(401).json({ authenticated: false });
}