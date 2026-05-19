# nect-app

Version: **v1.8.0**

A health activity tracker for Tasks, Exercise, and Food logging.

## v1.8.0 Release Notes

- Added Supabase/Postgres support for production via `DATABASE_URL`
- Added an Express backend with SQLite fallback for local development
- Added `scripts/migrate-sqlite-to-pg.js` to migrate local SQLite data to Postgres
- Added `REACT_APP_API_BASE_URL` support for deployed frontend/backend integration
- Replaced navbar emojis with custom public image icons
- Added `.env.example` for environment variable setup
- Updated deployment docs for modern hosting with Render/Vercel

## Architecture

- **Frontend:** React application in `src/`
- **Backend:** Express server in `server.js`
- **Local database:** SQLite (fallback for local development)
- **Production database:** Postgres via `DATABASE_URL` (Supabase compatible)

## What changed

- The app now uses a REST API backend instead of Firebase.
- Local development falls back to SQLite files in `data/`.
- Production should use Supabase Postgres with `DATABASE_URL`.
- Frontend supports a deployed backend via `REACT_APP_API_BASE_URL`.

## Quick Start

```bash
git clone <repo-url>
cd nect-app
npm install
npm run dev
```

Open the app at:

```bash
http://localhost:3000
```

If port 3000 is unavailable, `react-scripts` may open on `3001`.

## Local Development

- Run backend only:
  ```bash
  npm run server
  ```
- Run frontend only:
  ```bash
  npm start
  ```
- Run both together:
  ```bash
  npm run dev
  ```

The frontend proxy is configured to forward `/api` to `http://localhost:5000` during development.

## Supabase Migration

1. Create a Supabase project and copy the `DATABASE_URL` connection string.
2. Start the backend once with `DATABASE_URL` set, or rely on `server.js` to create tables.
3. Run the migration:
   ```bash
   DATABASE_URL="<your_database_url>" npm run migrate
   ```

This imports local `data/*.db` rows into the Supabase Postgres database.

## Deployment

- Deploy the backend as a Node service (for example Render or Railway).
- Deploy the frontend to Vercel or a static hosting provider.
- Set `REACT_APP_API_BASE_URL` for frontend builds to point at the backend URL.
- Set `DATABASE_URL` for the backend service.

## Useful Files

- `INSTALLATION.md` — local setup and dev guide
- `DEPLOYMENT.md` — production deployment guide
- `README_DEPLOY.md` — migration and hosting notes
- `SCHEMA.md` — database schema reference
- `USAGE.md` — app usage guide
- `CONTRIBUTING.md` — contribution guide
