import type { VercelRequest, VercelResponse } from '@vercel/node';
import { readDataStore, writeDataStore, ADMIN_TOKEN } from '../server-utils';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { id } = req.query;

  if (req.method === 'POST') {
    const { name, phone, email, course, message, type } = req.body;
    if (!name || !phone) {
      return res.status(400).json({ success: false, error: 'Name and Phone are required.' });
    }

    const fileData = readDataStore() || {};
    const inquiries = fileData.inquiries || [];

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
    fileData.inquiries = inquiries;
    writeDataStore(fileData);

    return res.json({ success: true, message: 'Your booking has been registered successfully!' });
  }

  if (req.method === 'GET') {
    const authHeader = req.headers.authorization;
    if (authHeader !== `Bearer ${ADMIN_TOKEN}`) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    const fileData = readDataStore() || {};
    return res.json(fileData.inquiries || []);
  }

  if (id && req.method === 'PUT') {
    const authHeader = req.headers.authorization;
    if (authHeader !== `Bearer ${ADMIN_TOKEN}`) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    const fileData = readDataStore() || {};
    const inquiries = fileData.inquiries || [];
    const inquiry = inquiries.find((inq: any) => inq.id === id);
    if (inquiry) {
      inquiry.read = !inquiry.read;
      fileData.inquiries = inquiries;
      writeDataStore(fileData);
      return res.json({ success: true, inquiries });
    }
    return res.status(404).json({ success: false, error: 'Inquiry not found' });
  }

  if (id && req.method === 'DELETE') {
    const authHeader = req.headers.authorization;
    if (authHeader !== `Bearer ${ADMIN_TOKEN}`) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    const fileData = readDataStore() || {};
    const inquiries = fileData.inquiries || [];
    const filtered = inquiries.filter((inq: any) => inq.id !== id);
    fileData.inquiries = filtered;
    writeDataStore(fileData);

    return res.json({ success: true, inquiries: filtered });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}