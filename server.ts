import express from 'express';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;

// Secure Express setup with enhanced body size limits for custom image uploads
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ limit: '15mb', extended: true }));

// Security headers and settings (Rule 7: HTTP Security Headers)
app.disable('x-powered-by');
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// Custom Zero-Dependency In-Memory Rate Limiter (Rule 2: Rate Limiting)
interface RateLimitRecord {
  count: number;
  resetTime: number;
}
const rateLimitCache = new Map<string, RateLimitRecord>();

function createRateLimiter(maxRequests: number, windowMs: number, errorMessage: string) {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown-ip';
    const key = `${req.path}:${ip}`;
    const now = Date.now();

    let record = rateLimitCache.get(key);
    if (!record || now > record.resetTime) {
      record = {
        count: 0,
        resetTime: now + windowMs
      };
    }

    record.count++;
    rateLimitCache.set(key, record);

    if (record.count > maxRequests) {
      const retryAfterSeconds = Math.ceil((record.resetTime - now) / 1000);
      res.set('Retry-After', String(retryAfterSeconds));
      return res.status(429).json({
        success: false,
        error: `${errorMessage} Please try again in ${retryAfterSeconds} seconds.`
      });
    }

    next();
  };
}

const loginLimiter = createRateLimiter(
  5, // max 5 login attempts
  15 * 60 * 1000, // 15 minutes window
  "Too many failed login attempts from this IP."
);

const saveLimiter = createRateLimiter(
  15, // max 15 edits
  1 * 60 * 1000, // 1 minute window
  "Too many content saving requests. Please wait a minute."
);

const dataFilePath = path.join(process.cwd(), 'src', 'data-store.json');

// Helper to read data safely with fallback
function readDataStore() {
  try {
    if (fs.existsSync(dataFilePath)) {
      const dataStr = fs.readFileSync(dataFilePath, 'utf8');
      return JSON.parse(dataStr);
    }
  } catch (err) {
    console.error('Error reading data file, using in-memory cache:', err);
  }
  return null;
}

// Helper to write data safely
function writeDataStore(data: any) {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Error writing to data file:', err);
    return false;
  }
}

// Simple in-memory backup cache initially loaded from store
let memoryCache = readDataStore();

// Secret token for state verification in current session
const ADMIN_TOKEN = 'attri_session_token_' + (process.env.ADMIN_PASSWORD || 'AttriChem2026Admin!').split('').reverse().join('');

// API Routes FIRST
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// GET website content (with inquiries stripped for public safety)
app.get('/api/content', (req, res) => {
  const fileData = readDataStore();
  if (fileData) {
    memoryCache = fileData;
  }
  const cleanCache = memoryCache ? { ...memoryCache } : {};
  delete cleanCache.inquiries;
  res.json(cleanCache);
});

// Admin login
app.post('/api/auth/login', loginLimiter, (req, res) => {
  const { password } = req.body;
  const targetPassword = process.env.ADMIN_PASSWORD || 'AttriChem2026Admin!';
  
  if (password === targetPassword) {
    return res.json({ success: true, token: ADMIN_TOKEN });
  } else {
    return res.status(401).json({ success: false, error: 'Incorrect password' });
  }
});

// Validate admin session
app.get('/api/auth/session', (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader === `Bearer ${ADMIN_TOKEN}`) {
    return res.json({ authenticated: true });
  }
  return res.status(401).json({ authenticated: false });
});

// Public: Submit inquiry (Enroll / Contact details)
app.post('/api/inquiries', (req, res) => {
  const { name, phone, email, course, message, type } = req.body;
  if (!name || !phone) {
    return res.status(400).json({ success: false, error: 'Name and Phone are required.' });
  }

  const fileData = readDataStore() || memoryCache || {};
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
  memoryCache = fileData;
  writeDataStore(fileData);

  res.json({ success: true, message: 'Your booking has been registered successfully!' });
});

// Admin: Get all inquiries
app.get('/api/inquiries', (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader !== `Bearer ${ADMIN_TOKEN}`) {
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }

  const fileData = readDataStore() || memoryCache || {};
  res.json(fileData.inquiries || []);
});

// Admin: Mark an inquiry as read
app.put('/api/inquiries/:id/read', (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader !== `Bearer ${ADMIN_TOKEN}`) {
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }

  const { id } = req.params;
  const fileData = readDataStore() || memoryCache || {};
  const inquiries = fileData.inquiries || [];
  
  const inquiry = inquiries.find((inq: any) => inq.id === id);
  if (inquiry) {
    inquiry.read = !inquiry.read;
    fileData.inquiries = inquiries;
    memoryCache = fileData;
    writeDataStore(fileData);
    return res.json({ success: true, inquiries });
  }

  res.status(404).json({ success: false, error: 'Inquiry not found' });
});

// Admin: Delete an inquiry
app.delete('/api/inquiries/:id', (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader !== `Bearer ${ADMIN_TOKEN}`) {
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }

  const { id } = req.params;
  const fileData = readDataStore() || memoryCache || {};
  const inquiries = fileData.inquiries || [];
  
  const filtered = inquiries.filter((inq: any) => inq.id !== id);
  fileData.inquiries = filtered;
  memoryCache = fileData;
  writeDataStore(fileData);

  res.json({ success: true, inquiries: filtered });
});

// PUT save/update website content (preserving inquiries array)
app.put('/api/content', saveLimiter, (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader !== `Bearer ${ADMIN_TOKEN}`) {
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }

  const newData = req.body;
  if (!newData) {
    return res.status(400).json({ success: false, error: 'Empty body' });
  }

  const fileData = readDataStore() || memoryCache || {};
  newData.inquiries = fileData.inquiries || [];

  memoryCache = newData;
  const success = writeDataStore(newData);
  
  res.json({ success, message: success ? 'Saved successfully' : 'Saved in-memory (persistent file error)' });
});

// Vite middleware and production static handling
async function initServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

initServer();
