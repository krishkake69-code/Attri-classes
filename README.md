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

2. Create `.env` file with required environment variables:
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` with your values:
   ```
   ADMIN_PASSWORD=your_secure_password
   GEMINI_API_KEY=your_gemini_api_key
   NODE_ENV=development
   ```

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
2. Import project in Vercel
3. Add Environment Variables in Vercel Dashboard:
   - `ADMIN_PASSWORD` - Your admin password
   - `GEMINI_API_KEY` - Your Google Gemini API key (if using AI features)
4. Deploy!

### Manual Vercel CLI Deploy
```bash
npm i -g vercel
vercel login
vercel --prod
```

### Environment Variables Required
| Variable | Description | Required |
|----------|-------------|----------|
| `ADMIN_PASSWORD` | Admin panel password | Yes |
| `GEMINI_API_KEY` | Google Gemini API key | No (for AI features) |

## Project Structure

```
├── api/              # Vercel serverless functions (API routes)
│   ├── content.ts    # GET/PUT /api/content
│   ├── inquiries.ts  # POST/GET/PUT/DELETE /api/inquiries
│   ├── auth.ts       # POST /api/auth/login, GET /api/auth/session
│   └── health.ts     # GET /api/health
├── src/              # React frontend
│   ├── components/   # React components
│   ├── main.tsx      # Entry point
│   └── data-store.json # Local data storage (dev only)
├── public/           # Static assets
├── server.ts         # Express server (local dev only)
├── server-utils.ts   # Shared utilities
├── vercel.json       # Vercel configuration
└── vite.config.ts    # Vite configuration
```

## Data Persistence

- **Local Development**: Uses `src/data-store.json` file
- **Vercel Production**: File system is read-only. For production, integrate with:
  - Vercel KV (Redis)
  - Vercel Postgres
  - MongoDB Atlas
  - Supabase
  - PlanetScale

To use Vercel KV, install `@vercel/kv` and update `server-utils.ts`.

## API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/health` | Health check | No |
| GET | `/api/content` | Get website content | No |
| PUT | `/api/content` | Update website content | Admin |
| POST | `/api/inquiries` | Submit inquiry | No |
| GET | `/api/inquiries` | Get all inquiries | Admin |
| PUT | `/api/inquiries/:id/read` | Toggle read status | Admin |
| DELETE | `/api/inquiries/:id` | Delete inquiry | Admin |
| POST | `/api/auth/login` | Admin login | No |
| GET | `/api/auth/session` | Validate session | Admin |

## Tech Stack

- **Frontend**: React 19, Vite 6, Tailwind CSS 4, Motion
- **Backend**: Express (local), Vercel Serverless Functions (production)
- **AI**: Google GenAI (optional)
- **Deployment**: Vercel