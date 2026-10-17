import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createApiApp } from '../api-app.js';

// Single Express app shared with the local dev server (server.ts).
// vercel.json rewrites all /api/* traffic here, so the API has exactly
// one implementation.
const app = createApiApp();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  return app(req, res);
}
