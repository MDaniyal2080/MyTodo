# Simple CRUD App (Todo List)

Full-stack app with Next.js (frontend), NestJS (backend), Prisma ORM, and PostgreSQL (Neon). Ready for GitHub-based deployment to Railway (backend) and Netlify (frontend).

## Structure
- `Backend/` — NestJS + Prisma API
- `frontend/` — Next.js UI
- `netlify.toml` — root config with `base = "frontend"`

## Environment Variables
- Backend (`Backend/.env` — see `Backend/.env.example`):
  - `DATABASE_URL` — Neon pooled (PgBouncer) URL, include `?sslmode=require&pgbouncer=true`
  - `DIRECT_URL` — Neon direct URL, include `?sslmode=require`
  - `CORS_ORIGINS` — comma-separated origins (e.g. `http://localhost:3000,https://your-site.netlify.app`)
  - Optional: `PORT`, `HOST` (Railway provides `PORT` automatically)
- Frontend (`frontend/.env` — see `frontend/env.example`):
  - `NEXT_PUBLIC_API_URL` — Railway backend URL (e.g. `https://<railway-subdomain>.up.railway.app`)

## Deploy: GitHub → Railway (Backend)
1. Create Neon project and DB.
   - Copy two URLs:
     - `DATABASE_URL` (pooled): `... ?sslmode=require&pgbouncer=true`
     - `DIRECT_URL` (direct): `... ?sslmode=require`
2. In Railway, create a service from GitHub repo.
3. Monorepo base directory: `Backend`.
4. Environment variables:
   - `DATABASE_URL`, `DIRECT_URL`, `CORS_ORIGINS`
5. Deploy. Our scripts: `prestart` builds → `start` runs `prisma migrate deploy` → serves API.
6. Optional seed: one-off command `npm run db:seed`.

## Deploy: GitHub → Netlify (Frontend)
1. Create site from Git.
2. Root `netlify.toml` already sets:
   - `base = "frontend"`
   - `command = "npm run build"`
   - `publish = ".next"`
   - `@netlify/plugin-nextjs`
3. Set `NEXT_PUBLIC_API_URL` env to your Railway backend URL.

## Local Development
- Backend
  - Copy `Backend/.env.example` → `Backend/.env` and fill Neon URLs
  - Install: `npm install` (in `Backend/`)
  - Migrate: `npm run migrate:deploy`
  - Dev: `npm run start:dev` → http://localhost:3001
- Frontend
  - Ensure `NEXT_PUBLIC_API_URL=http://localhost:3001`
  - Install: `npm install` (in `frontend/`)
  - Dev: `npm run dev` → http://localhost:3000

## Notes
- CORS (`Backend/src/main.ts`) uses `credentials: false` for broader origin handling. If you add cookie-based auth, switch this to `true` and narrow origins as needed.
- Prisma `directUrl` is configured in `Backend/prisma/schema.prisma` to use Neon direct connection for migrations.
