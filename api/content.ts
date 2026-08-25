import type { VercelRequest, VercelResponse } from '@vercel/node';
import { readDataStore, writeDataStore, getAdminToken } from '../lib/kv-store';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const ADMIN_TOKEN = getAdminToken();

  if (req.method === 'GET') {
    const data = await readDataStore();
    const cleanData = data ? { ...data } : {};
    delete cleanData.inquiries;
    return res.json(cleanData);
  }

  if (req.method === 'PUT') {
    const authHeader = req.headers.authorization;
    if (authHeader !== `Bearer ${ADMIN_TOKEN}`) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    const newData = req.body;
    if (!newData) {
      return res.status(400).json({ success: false, error: 'Empty body' });
    }

    const existingData = await readDataStore() || {};
    newData.inquiries = existingData.inquiries || [];
    const success = await writeDataStore(newData);

    return res.json({ success, message: success ? 'Saved successfully' : 'Save failed' });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}