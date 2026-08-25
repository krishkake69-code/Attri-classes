import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    return res.json({ status: 'ok' });
  }
  return res.status(405).json({ error: 'Method not allowed' });
}