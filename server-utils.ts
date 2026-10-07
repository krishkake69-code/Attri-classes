import fs from 'fs';
import path from 'path';
import { kv } from '@vercel/kv';

const dataFilePath = path.join(process.cwd(), 'src', 'data-store.json');
const DATA_KEY = 'attri:data-store';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'AttriChem2026Admin!';
const ADMIN_TOKEN = 'attri_session_token_' + ADMIN_PASSWORD.split('').reverse().join('');

async function readFromKV() {
  try {
    const data = await kv.get(DATA_KEY);
    if (data) return data;
  } catch (err) {
    console.error('Error reading from KV:', err);
  }
  return null;
}

async function writeToKV(data: any) {
  try {
    await kv.set(DATA_KEY, data);
    return true;
  } catch (err) {
    console.error('Error writing to KV:', err);
    return false;
  }
}

function readFromFile() {
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

function writeToFile(data: any) {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Error writing to data file:', err);
    return false;
  }
}

export async function readDataStore() {
  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    return await readFromKV();
  }
  return readFromFile();
}

export async function writeDataStore(data: any) {
  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    return await writeToKV(data);
  }
  return writeToFile(data);
}

export { ADMIN_TOKEN, ADMIN_PASSWORD };