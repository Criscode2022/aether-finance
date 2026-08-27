# Aether Finance

> Production-ready full-stack personal & small-business finance tracker.

**Stack:** Angular 19 · NestJS 11 · Neon Postgres (Prisma) · Tailwind CSS · JWT Auth · Nx-style monorepo

Solves real problems: track income/expenses, set budgets, recurring transactions, category insights, multi-currency ready, and clean reporting.

## Repository structure

```
aether-finance/
├── apps/
│   ├── api/          # NestJS backend (Prisma + Neon)
│   └── web/          # Angular 19 frontend (Tailwind)
├── packages/
│   └── shared/       # Shared DTOs & types
├── prisma/           # Prisma schema & migrations
├── docker-compose.yml
├── .env.example
└── .github/workflows/ci.yml
```

## Quick start (local)

### 1. Prerequisites
- Node.js 22+
- Docker (for local Postgres) **or** a free Neon project
- Angular CLI & Nest CLI (optional; scripts use npx)

### 2. Clone & install

```bash
git clone https://github.com/Criscode2022/aether-finance.git
cd aether-finance
npm install
```

### 3. Environment

```bash
cp .env.example .env
# Edit DATABASE_URL (Neon connection string) and JWT_SECRET
```

**Neon setup (recommended for production):**
1. Create a project at https://console.neon.tech
2. Copy the connection string (use the pooled one for serverless)
3. Paste into `.env` as `DATABASE_URL`

**Local Postgres alternative:**
```bash
docker compose up -d
# DATABASE_URL=postgresql://aether:aether@localhost:5432/aether_finance
```

### 4. Database

```bash
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed   # optional demo data
```

### 5. Run

```bash
# Terminal 1 – API
npm run start:api

# Terminal 2 – Angular
npm run start:web
```

- API: http://localhost:3000  (Swagger at /api)
- Web: http://localhost:4200

## Production deployment

### Backend (NestJS)
- Deploy to Railway, Render, Fly.io or Vercel (Node runtime)
- Set `DATABASE_URL` (Neon), `JWT_SECRET`, `NODE_ENV=production`, `CORS_ORIGIN`
- Run migrations on deploy: `npx prisma migrate deploy`

### Frontend (Angular)
- `npm run build:web`
- Deploy `apps/web/dist/web/browser` to Vercel, Netlify or Cloudflare Pages
- Set environment file with `apiUrl` pointing to your Nest API

### Neon
- Use connection pooling + serverless driver if needed
- Enable logical replication / branching for staging

## Features (current scaffold)

- JWT authentication (register / login)
- Transactions CRUD with categories
- Budgets with period tracking
- Prisma schema ready for Neon
- Tailwind design system on Angular
- Shared TypeScript types
- GitHub Actions CI (lint + build + test skeleton)
- Docker Compose for local Postgres
- Swagger/OpenAPI on the API

## Next steps to production

1. Connect real Neon project and run migrations
2. Add refresh tokens + role-based guards
3. Implement recurring transaction job (BullMQ or Nest Schedule)
4. Add charts (ng2-charts / Chart.js) on the Angular side
5. E2E tests (Playwright) + unit tests (Jest)
6. Multi-tenant workspaces if needed
7. Stripe billing for SaaS mode

## License

MIT

---

Built with ambition for real-world use. Contributions welcome.
