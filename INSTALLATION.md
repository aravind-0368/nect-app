# Installation Guide

Version: **v1.8.0**

## Prerequisites

- Node.js 18.x or later
- npm
- A Supabase project for production Postgres (optional for local development)
- A deployment provider for backend and frontend (for example, Render and Vercel)

## Setup

1. Clone the repository:

```bash
git clone <repo-url>
cd nect-app
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file from `.env.example` if you need local environment variables.

## Local Development

The backend uses SQLite locally and Postgres only when `DATABASE_URL` is set.

- Start the backend:
  ```bash
  npm run server
  ```
- Start the frontend:
  ```bash
  npm start
  ```
- Run both together:
  ```bash
  npm run dev
  ```

The frontend proxies `/api` requests to `http://localhost:5000` while developing locally.

## Supabase Migration

1. Create a Supabase project and copy the `DATABASE_URL`.
2. Start the backend with `DATABASE_URL` set so the tables can be created:
   ```bash
   DATABASE_URL="<your_database_url>" npm run server
   ```
3. In a new terminal, migrate the local SQLite data to Supabase:
   ```bash
   DATABASE_URL="<your_database_url>" npm run migrate
   ```

## Production Environment Variables

- `DATABASE_URL` — Postgres connection string for the Express backend
- `REACT_APP_API_BASE_URL` — backend URL used by the deployed React frontend

## Build for Production

```bash
npm run build
```

The production build will be output to the `build/` directory.

## Notes

- `src/App.js` supports using `REACT_APP_API_BASE_URL` for a deployed backend.
- The app no longer requires Firebase for data storage.
- Keep `DATABASE_URL` secret in your deployment environment.
