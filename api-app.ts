import express from 'express';
import crypto from 'crypto';
import {
  readDataStore,
  writeDataStore,
  createSessionToken,
  verifySessionToken,
  bearerToken,
  safeEqual,
  getAdminPassword,
} from './server-utils.js';

/* ------------------------------------------------------------------ */
/* Rate limiting                                                       */
/*                                                                     */
/* In-memory limiter. On Vercel serverless this resets on cold starts, */
/* so it is best-effort there — but the login limiter plus signed      */
/* expiring tokens keep the admin surface safe. In the long-running     */
/* dev/self-hosted server it works as intended.                        */
/* ------------------------------------------------------------------ */

interface RateLimitRecord {
  count: number;
  resetTime: number;
}
const rateLimitCache = new Map<string, RateLimitRecord>();

// Opportunistic cleanup so the map does not grow forever.
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of rateLimitCache) {
    if (now > record.resetTime) rateLimitCache.delete(key);
  }
}, 5 * 60 * 1000).unref?.();

export function createRateLimiter(maxRequests: number, windowMs: number, errorMessage: string) {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    // req.ip respects X-Forwarded-For only when "trust proxy" is configured
    // by the host, so this is not trivially spoofable.
    const ip = req.ip || req.socket.remoteAddress || 'unknown-ip';
    const key = `${req.baseUrl || req.path}:${ip}`;
    const now = Date.now();

    let record = rateLimitCache.get(key);
    if (!record || now > record.resetTime) {
      record = { count: 0, resetTime: now + windowMs };
    }

    record.count++;
    rateLimitCache.set(key, record);

    if (record.count > maxRequests) {
      const retryAfterSeconds = Math.ceil((record.resetTime - now) / 1000);
      res.set('Retry-After', String(retryAfterSeconds));
      return res.status(429).json({
        success: false,
        error: `${errorMessage} Please try again in ${retryAfterSeconds} seconds.`,
      });
    }

    next();
  };
}

const loginLimiter = createRateLimiter(
  5, // max 5 attempts
  15 * 60 * 1000, // per 15 minutes
  'Too many login attempts from this IP.'
);

const saveLimiter = createRateLimiter(
  15, // max 15 edits
  1 * 60 * 1000, // per minute
  'Too many content saving requests.'
);

const inquiryLimiter = createRateLimiter(
  5, // max 5 form submissions
  10 * 60 * 1000, // per 10 minutes
  'Too many submissions from this IP.'
);

const newsletterLimiter = createRateLimiter(
  3,
  10 * 60 * 1000,
  'Too many subscription attempts from this IP.'
);

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function requireAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
  if (verifySessionToken(bearerToken(req.headers.authorization))) {
    return next();
  }
  return res.status(401).json({ success: false, error: 'Unauthorized' });
}

/** Strips every non-public key (inquiries, newsletter subscribers). */
function publicView(data: any) {
  const clean = { ...(data || {}) };
  delete clean.inquiries;
  delete clean.newsletter;
  return clean;
}

function cleanString(value: unknown, maxLength: number): string {
  if (typeof value !== 'string') return '';
  // Basic sanitation: collapse control characters, cap length.
  return value.replace(/[\u0000-\u0008\u000B-\u001F]/g, '').trim().slice(0, maxLength);
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[0-9+\-\s()]{8,16}$/;

/* ------------------------------------------------------------------ */
/* App                                                                 */
/* ------------------------------------------------------------------ */

export function createApiApp() {
  const app = express();

  // On Vercel the function sits behind exactly one trusted proxy hop, so trust
  // that hop: req.ip then resolves to the real client IP (Vercel controls the
  // right-most X-Forwarded-For entry, so it cannot be spoofed by the client).
  // Locally there is no proxy, so X-Forwarded-For is not trusted at all.
  if (process.env.VERCEL) {
    app.set('trust proxy', 1);
  }

  app.use(express.json({ limit: '15mb' }));
  app.use(express.urlencoded({ limit: '15mb', extended: true }));

  app.disable('x-powered-by');
  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    next();
  });

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  // Public: get website content (inquiries + newsletter stripped)
  app.get('/api/content', async (req, res) => {
    try {
      const fileData = await readDataStore();
      res.json(publicView(fileData));
    } catch (err) {
      console.error('Content read failed:', err);
      res.status(500).json({ error: 'Could not load content' });
    }
  });

  // Admin login (disabled entirely when ADMIN_PASSWORD is unset)
  app.post('/api/auth/login', loginLimiter, (req, res) => {
    const targetPassword = getAdminPassword();
    if (!targetPassword) {
      return res.status(503).json({
        success: false,
        error: 'Admin login is not configured on this server.',
      });
    }

    const { password } = req.body || {};
    if (typeof password === 'string' && safeEqual(password, targetPassword)) {
      const token = createSessionToken();
      if (!token) {
        return res.status(503).json({ success: false, error: 'Could not create session.' });
      }
      return res.json({ success: true, token });
    }
    return res.status(401).json({ success: false, error: 'Incorrect password' });
  });

  // Validate admin session (signed + expiring token)
  app.get('/api/auth/session', (req, res) => {
    const authenticated = verifySessionToken(bearerToken(req.headers.authorization));
    return res.status(authenticated ? 200 : 401).json({ authenticated });
  });

  // Public: submit inquiry (enroll / contact)
  app.post('/api/inquiries', inquiryLimiter, async (req, res) => {
    const body = req.body || {};

    // Honeypot: real users never fill this hidden field.
    if (typeof body.website === 'string' && body.website.trim() !== '') {
      // Pretend success so bots do not learn anything.
      return res.json({ success: true, message: 'Your booking has been registered successfully!' });
    }

    const name = cleanString(body.name, 120);
    const phone = cleanString(body.phone, 20);
    const email = cleanString(body.email, 120);
    const course = cleanString(body.course, 160);
    const message = cleanString(body.message, 2000);

    if (!name || !phone) {
      return res.status(400).json({ success: false, error: 'Name and Phone are required.' });
    }
    if (!PHONE_RE.test(phone)) {
      return res.status(400).json({ success: false, error: 'Please provide a valid phone number.' });
    }
    if (email && !EMAIL_RE.test(email)) {
      return res.status(400).json({ success: false, error: 'Please provide a valid email address.' });
    }

    const fileData = (await readDataStore()) || {};
    const inquiries = Array.isArray(fileData.inquiries) ? fileData.inquiries : [];

    const newInquiry = {
      id: 'inq_' + Date.now() + '_' + crypto.randomBytes(4).toString('hex'),
      name,
      phone,
      email,
      course: course || 'General Inquiry',
      message,
      type: body.type === 'enroll' ? 'enroll' : 'contact',
      timestamp: new Date().toISOString(),
      read: false,
    };

    // Hard cap so a spam wave cannot grow the store unbounded.
    inquiries.unshift(newInquiry);
    if (inquiries.length > 500) inquiries.length = 500;

    fileData.inquiries = inquiries;
    await writeDataStore(fileData);

    res.json({ success: true, message: 'Your booking has been registered successfully!' });
  });

  // Public: subscribe to the practice bulletin
  app.post('/api/newsletter', newsletterLimiter, async (req, res) => {
    const body = req.body || {};

    if (typeof body.website === 'string' && body.website.trim() !== '') {
      return res.json({ success: true, message: 'Subscribed.' });
    }

    const email = cleanString(body.email, 120).toLowerCase();
    if (!email || !EMAIL_RE.test(email)) {
      return res.status(400).json({ success: false, error: 'A valid email address is required.' });
    }

    const fileData = (await readDataStore()) || {};
    const newsletter: string[] = Array.isArray(fileData.newsletter) ? fileData.newsletter : [];

    if (!newsletter.includes(email)) {
      newsletter.unshift(email);
      if (newsletter.length > 2000) newsletter.length = 2000;
      fileData.newsletter = newsletter;
      await writeDataStore(fileData);
    }

    res.json({ success: true, message: 'Subscribed. The first bulletin arrives on Monday morning.' });
  });

  // Admin: list newsletter subscribers
  app.get('/api/newsletter', requireAdmin, async (req, res) => {
    const fileData = (await readDataStore()) || {};
    res.json(Array.isArray(fileData.newsletter) ? fileData.newsletter : []);
  });

  // Admin: get all inquiries
  app.get('/api/inquiries', requireAdmin, async (req, res) => {
    const fileData = (await readDataStore()) || {};
    res.json(Array.isArray(fileData.inquiries) ? fileData.inquiries : []);
  });

  // Admin: mark an inquiry as read
  app.put('/api/inquiries/:id/read', requireAdmin, async (req, res) => {
    const { id } = req.params;
    const fileData = (await readDataStore()) || {};
    const inquiries = Array.isArray(fileData.inquiries) ? fileData.inquiries : [];

    const inquiry = inquiries.find((inq: any) => inq.id === id);
    if (inquiry) {
      inquiry.read = !inquiry.read;
      fileData.inquiries = inquiries;
      await writeDataStore(fileData);
      return res.json({ success: true, inquiries });
    }

    res.status(404).json({ success: false, error: 'Inquiry not found' });
  });

  // Admin: delete an inquiry
  app.delete('/api/inquiries/:id', requireAdmin, async (req, res) => {
    const { id } = req.params;
    const fileData = (await readDataStore()) || {};
    const inquiries = Array.isArray(fileData.inquiries) ? fileData.inquiries : [];

    const filtered = inquiries.filter((inq: any) => inq.id !== id);
    fileData.inquiries = filtered;
    await writeDataStore(fileData);

    res.json({ success: true, inquiries: filtered });
  });

  // Admin: save/update website content (preserves inquiries + newsletter)
  app.put('/api/content', saveLimiter, requireAdmin, async (req, res) => {
    const newData = req.body;
    if (!newData || typeof newData !== 'object' || Array.isArray(newData)) {
      return res.status(400).json({ success: false, error: 'Empty body' });
    }

    const existing = (await readDataStore()) || {};
    newData.inquiries = Array.isArray(existing.inquiries) ? existing.inquiries : [];
    newData.newsletter = Array.isArray(existing.newsletter) ? existing.newsletter : [];

    const success = await writeDataStore(newData);

    res.json({
      success,
      message: success ? 'Saved successfully' : 'Saved in-memory (persistent file error)',
    });
  });

  return app;
}
