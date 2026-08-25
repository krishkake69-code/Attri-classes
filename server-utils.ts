import fs from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'src', 'data-store.json');

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'AttriChem2026Admin!';
const ADMIN_TOKEN = 'attri_session_token_' + ADMIN_PASSWORD.split('').reverse().join('');

export function readDataStore() {
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

export function writeDataStore(data: any) {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Error writing to data file:', err);
    return false;
  }
}

export { ADMIN_TOKEN, ADMIN_PASSWORD };