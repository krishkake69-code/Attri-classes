import type { VercelRequest, VercelResponse } from '@vercel/node';
import { kv } from '@vercel/kv';

const DATA_KEY = 'attri:data-store';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'AttriChem2026Admin!';
const ADMIN_TOKEN = 'attri_session_token_' + ADMIN_PASSWORD.split('').reverse().join('');

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { id } = req.query;

  if (req.method === 'POST') {
    const { name, phone, email, course, message, type } = req.body;
    if (!name || !phone) {
      return res.status(400).json({ success: false, error: 'Name and Phone are required.' });
    }

    try {
      const data = await kv.get(DATA_KEY) || {};
      const inquiries = data.inquiries || [];

      const newInquiry = {
        id: 'inq_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
        name,
        phone,
        email: email || '',
        course: course || 'General Inquiry',
        message: message || '',
        type: type === 'enroll' ? 'enroll' : 'contact',
        timestamp: new Date().toISOString(),
        read: false
      };

      inquiries.unshift(newInquiry);
      data.inquiries = inquiries;
      await kv.set(DATA_KEY, data);

      return res.json({ success: true, message: 'Your booking has been registered successfully!' });
    } catch (err) {
      console.error('KV error:', err);
      return res.status(500).json({ success: false, error: 'Server error' });
    }
  }

  if (req.method === 'GET') {
    const authHeader = req.headers.authorization;
    if (authHeader !== `Bearer ${ADMIN_TOKEN}`) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    try {
      const data = await kv.get(DATA_KEY) || {};
      return res.json(data.inquiries || []);
    } catch (err) {
      console.error('KV read error:', err);
      return res.status(500).json({ success: false, error: 'Server error' });
    }
  }

  if (id && req.method === 'PUT') {
    const authHeader = req.headers.authorization;
    if (authHeader !== `Bearer ${ADMIN_TOKEN}`) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    try {
      const data = await kv.get(DATA_KEY) || {};
      const inquiries = data.inquiries || [];
      const inquiry = inquiries.find((inq: any) => inq.id === id);
      if (inquiry) {
        inquiry.read = !inquiry.read;
        data.inquiries = inquiries;
        await kv.set(DATA_KEY, data);
        return res.json({ success: true, inquiries });
      }
      return res.status(404).json({ success: false, error: 'Inquiry not found' });
    } catch (err) {
      console.error('KV error:', err);
      return res.status(500).json({ success: false, error: 'Server error' });
    }
  }

  if (id && req.method === 'DELETE') {
    const authHeader = req.headers.authorization;
    if (authHeader !== `Bearer ${ADMIN_TOKEN}`) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    try {
      const data = await kv.get(DATA_KEY) || {};
      const inquiries = data.inquiries || [];
      const filtered = inquiries.filter((inq: any) => inq.id !== id);
      data.inquiries = filtered;
      await kv.set(DATA_KEY, data);

      return res.json({ success: true, inquiries: filtered });
    } catch (err) {
      console.error('KV error:', err);
      return res.status(500).json({ success: false, error: 'Server error' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}