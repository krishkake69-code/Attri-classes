import type { VercelRequest, VercelResponse } from '@vercel/node';
import { kv } from '@vercel/kv';

interface DataStore {
  admissionMessage?: string;
  stats?: any;
  courses?: any[];
  results?: any[];
  testimonials?: any[];
  gallery?: any[];
  contactInfo?: any;
  centers?: any[];
  inquiries?: any[];
}

const DATA_KEY = 'attri:data-store';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'AttriChem2026Admin!';
const ADMIN_TOKEN = 'attri_session_token_' + ADMIN_PASSWORD.split('').reverse().join('');

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    try {
      const data = await kv.get<DataStore>(DATA_KEY);
      const cleanData = data ? { ...data } : {};
      delete cleanData.inquiries;
      return res.json(cleanData);
    } catch (err) {
      console.error('KV read error:', err);
      return res.json({});
    }
  }

  if (req.method === 'PUT') {
    const authHeader = req.headers.authorization;
    if (authHeader !== `Bearer ${ADMIN_TOKEN}`) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    const newData = req.body as DataStore;
    if (!newData) {
      return res.status(400).json({ success: false, error: 'Empty body' });
    }

    try {
      const existingData = (await kv.get<DataStore>(DATA_KEY)) || {};
      newData.inquiries = existingData.inquiries || [];
      await kv.set(DATA_KEY, newData);
      return res.json({ success: true, message: 'Saved successfully' });
    } catch (err) {
      console.error('KV write error:', err);
      return res.status(500).json({ success: false, error: 'Save failed' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}