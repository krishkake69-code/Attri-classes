import type { VercelRequest, VercelResponse } from '@vercel/node';
import fs from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'src', 'data-store.json');
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'AttriChem2026Admin!';
const ADMIN_TOKEN = 'attri_session_token_' + ADMIN_PASSWORD.split('').reverse().join('');

function readDataStore() {
  try {
    if (fs.existsSync(dataFilePath)) {
      const dataStr = fs.readFileSync(dataFilePath, 'utf8');
      return JSON.parse(dataStr);
    }
  } catch (err) {
    console.error('Error reading data file:', err);
  }
  return null;
}

function writeDataStore(data: any) {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Error writing to data file:', err);
    return false;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    const fileData = readDataStore();
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