import type { VercelRequest, VercelResponse } from '@vercel/node';
import { readDataStore, writeDataStore, ADMIN_TOKEN } from '../server-utils';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    const fileData = readDataStore();
    if (fileData) {
      // Note: In serverless, we can't maintain memory cache between requests
    }
    const cleanData = fileData ? { ...fileData } : {};
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

    const fileData = readDataStore() || {};
    newData.inquiries = fileData.inquiries || [];
    const success = writeDataStore(newData);

    return res.json({ success, message: success ? 'Saved successfully' : 'Save failed' });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}