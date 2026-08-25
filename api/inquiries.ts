import type { VercelRequest, VercelResponse } from '@vercel/node';
import { readDataStore, writeDataStore, getAdminToken } from '../lib/kv-store';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { id } = req.query;
  const ADMIN_TOKEN = getAdminToken();

  if (req.method === 'POST') {
    const { name, phone, email, course, message, type } = req.body;
    if (!name || !phone) {
      return res.status(400).json({ success: false, error: 'Name and Phone are required.' });
    }

    const data = await readDataStore() || {};
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
    await writeDataStore(data);

    return res.json({ success: true, message: 'Your booking has been registered successfully!' });
  }

  if (req.method === 'GET') {
    const authHeader = req.headers.authorization;
    if (authHeader !== `Bearer ${ADMIN_TOKEN}`) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    const data = await readDataStore() || {};
    return res.json(data.inquiries || []);
  }

  if (id && req.method === 'PUT') {
    const authHeader = req.headers.authorization;
    if (authHeader !== `Bearer ${ADMIN_TOKEN}`) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    const data = await readDataStore() || {};
    const inquiries = data.inquiries || [];
    const inquiry = inquiries.find((inq: any) => inq.id === id);
    if (inquiry) {
      inquiry.read = !inquiry.read;
      data.inquiries = inquiries;
      await writeDataStore(data);
      return res.json({ success: true, inquiries });
    }
    return res.status(404).json({ success: false, error: 'Inquiry not found' });
  }

  if (id && req.method === 'DELETE') {
    const authHeader = req.headers.authorization;
    if (authHeader !== `Bearer ${ADMIN_TOKEN}`) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    const data = await readDataStore() || {};
    const inquiries = data.inquiries || [];
    const filtered = inquiries.filter((inq: any) => inq.id !== id);
    data.inquiries = filtered;
    await writeDataStore(data);

    return res.json({ success: true, inquiries: filtered });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}