# Attri Chemistry Classes

Premium educational coaching platform for NEET, JEE, Boards & Competitive Chemistry Exams.

## Local Development

### Prerequisites
- Node.js 18+
- npm

### Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create `.env` from the example and fill it in:
   ```bash
   cp .env.example .env
   ```
   | Variable | Description | Required |
   |----------|-------------|----------|
   | `ADMIN_PASSWORD` | Admin panel password. **If unset, admin login is disabled.** | Yes |
   | `AUTH_SECRET` | Signs admin session tokens. Recommended in production. | No |
   | `GEMINI_API_KEY` | Google Gemini API key (optional AI features). | No |
   | `KV_REST_API_URL` / `KV_REST_API_TOKEN` | Vercel KV credentials. Leave empty for local file storage. | No |

3. Run development server:
   ```bash
   npm run dev
   ```
   Server runs at `http://localhost:3000`

### Build for Production
```bash
npm run build
```

### Start Production Server (Local)
```bash
npm run start
```

## Vercel Deployment

### Quick Deploy
1. Push this repo to GitHub
2. Import the project in Vercel
3. Add Environment Variables in the Vercel Dashboard:
   - `ADMIN_PASSWORD` - a strong admin password (**required** — no default exists)
   - `AUTH_SECRET` - a long random string used to sign sessions (recommended)
   - `GEMINI_API_KEY` - optional
   - `KV_REST_API_URL` / `KV_REST_API_TOKEN` - Vercel KV (recommended for persistence)
4. Deploy

### Manual Vercel CLI Deploy
```bash
npm i -g vercel
vercel login
vercel --prod
```

## Project Structure

```
├── api/
│   └── index.ts      # Vercel serverless entry — mounts the shared API app
├── api-app.ts        # The single Express API implementation (routes, auth, rate limiting)
├── server.ts         # Local dev server (Express + Vite middleware), same API app
├── server-utils.ts   # Data store (KV or file) + session token helpers
├── src/              # React frontend
│   ├── components/   # React components
│   ├── types.ts      # Shared TypeScript types
│   ├── data.ts       # Static fallback content
│   ├── main.tsx      # Entry point
│   └── data-store.json # Local content store (dev only)
├── public/           # Static assets
├── vercel.json       # Vercel configuration
└── vite.config.ts    # Vite configuration
```

The API has exactly **one** implementation (`api-app.ts`). Both `server.ts` (local dev) and
`api/index.ts` (Vercel) call `createApiApp()`, and `vercel.json` rewrites every `/api/*` request
to `api/index.ts`.

## Security Notes

- **No default password.** `ADMIN_PASSWORD` must be set, otherwise `/api/auth/login` returns
  503 and the admin panel cannot be unlocked. Never commit real passwords; `.env*` is ignored.
- **Sessions** are HMAC-signed stateless tokens with a 7-day expiry (signed with `AUTH_SECRET`,
  or a key derived from `ADMIN_PASSWORD` when `AUTH_SECRET` is unset). They are random per login
  and cannot be reversed into the password. Logging out or rotating `AUTH_SECRET`/the password
  invalidates existing sessions.
- **Rate limiting** is applied to login, content saves, inquiry submissions and newsletter
  sign-ups. It is in-memory: effective on the long-running server, best-effort on serverless
  (state resets on cold starts).
- Public form endpoints additionally use a hidden honeypot field, input validation and a cap on
  stored records to resist spam.
- `GET /api/content` never exposes inquiries or newsletter subscribers.

## Data Persistence

- **Local Development**: Uses `src/data-store.json`.
- **Vercel Production**: Vercel KV (`attri:data-store`). Seed it from the local file with:
  ```bash
  npm run seed:kv
  ```
  For other production options (Postgres, MongoDB, Supabase), update `server-utils.ts`.

## API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/health` | Health check | No |
| GET | `/api/content` | Get website content (inquiries/subscribers stripped) | No |
| PUT | `/api/content` | Update website content | Admin |
| POST | `/api/inquiries` | Submit inquiry (rate-limited, honeypot) | No |
| GET | `/api/inquiries` | Get all inquiries | Admin |
| PUT | `/api/inquiries/:id/read` | Toggle read status | Admin |
| DELETE | `/api/inquiries/:id` | Delete inquiry | Admin |
| POST | `/api/newsletter` | Subscribe to the practice bulletin | No |
| GET | `/api/newsletter` | List newsletter subscribers | Admin |
| POST | `/api/auth/login` | Admin login (returns a signed session token) | No |
| GET | `/api/auth/session` | Validate session token | Admin |

## Tech Stack

- **Frontend**: React 19, Vite 6, Tailwind CSS 4, Motion
- **Backend**: Express (local), Vercel Serverless Functions (production)
- **AI**: Google GenAI (optional)
- **Deployment**: Vercel
