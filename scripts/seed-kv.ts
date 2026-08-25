import fs from 'fs';
import path from 'path';
import { kv } from '@vercel/kv';

const dataFilePath = path.join(process.cwd(), 'src', 'data-store.json');
const DATA_KEY = 'attri:data-store';

async function seedKV() {
  try {
    const dataStr = fs.readFileSync(dataFilePath, 'utf8');
    const data = JSON.parse(dataStr);
    
    await kv.set(DATA_KEY, data);
    console.log('KV store seeded successfully!');
    console.log('Keys:', Object.keys(data));
  } catch (err) {
    console.error('Error seeding KV:', err);
  }
}

seedKV();