# Birdy — Project Dashboard

Internal project tracking dashboard for the **Birdy** travel agency web-app.

![Status](https://img.shields.io/badge/status-active-brightgreen) ![Deploy](https://img.shields.io/badge/deploy-Vercel-black) ![DB](https://img.shields.io/badge/db-Neon_PostgreSQL-00e5a0)

---

## Quick Start (Local)

Open `index.html` in any browser. Without the API, data saves to **localStorage** only.

---

## Deploy to Vercel (with Neon Cloud Storage)

### 1. Neon Database

If you already created a Neon project via the Vercel integration, your `DATABASE_URL` is auto-configured. Skip to step 3.

Otherwise:
1. Go to [neon.tech](https://neon.tech) → create a project
2. Copy the **connection string**
3. Add it as `DATABASE_URL` in Vercel → Project Settings → Environment Variables

> **No manual SQL needed** — the API auto-creates the table on first request.

### 2. Install Dependencies

```bash
npm install
```

### 3. Push to GitHub & Deploy

```bash
git add .
git commit -m "Deploy with Neon"
git push
```

Vercel auto-deploys on push. The serverless function at `/api/tasks` handles all database communication.

---

## Architecture

```
Browser (index.html)
   │
   │  GET  /api/tasks  → load state
   │  POST /api/tasks  → save state
   │
Vercel Serverless Function (api/tasks.js)
   │
   │  @neondatabase/serverless (HTTP)
   │
Neon PostgreSQL
   └── birdy_tasks (id, data JSONB, updated_at)
```

---

## How Data Sync Works

| Mode | Storage | When |
|------|---------|------|
| **Cloud (Neon)** | PostgreSQL `birdy_tasks` table | When deployed on Vercel with `DATABASE_URL` set |
| **Local fallback** | Browser `localStorage` | When running locally or API is unreachable |

- Changes save to Neon within ~400ms (debounced)
- Dashboard polls every 30s for remote changes (multi-device support)
- Header badge shows: `☁ Synced` / `↻ Saving…` / `⚠ Offline` / `💾 Local`

---

## Project Structure

```
birdy-planning/
├── index.html          ← Dashboard UI (self-contained HTML/CSS/JS)
├── api/
│   └── tasks.js        ← Vercel serverless function (GET/POST → Neon)
├── package.json        ← @neondatabase/serverless dependency
├── vercel.json         ← Vercel deployment config
├── .env.example        ← Template for DATABASE_URL
├── .gitignore
└── README.md
```

---

## Tech Stack

- **Frontend**: Vanilla HTML / CSS / JS (no build step)
- **Fonts**: [Outfit](https://fonts.google.com/specimen/Outfit) + [Inter](https://fonts.google.com/specimen/Inter)
- **Charts**: [Chart.js 4](https://www.chartjs.org/)
- **Database**: [Neon](https://neon.tech) (serverless PostgreSQL)
- **API**: Vercel Serverless Functions
- **Hosting**: [Vercel](https://vercel.com)

---

**Line Collective × Birdy Travel Agency**
