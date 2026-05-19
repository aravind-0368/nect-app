# Deployment Guide

Version: **v1.8.0**

This guide describes how to deploy `nect-app` with Supabase Postgres, an Express backend, and a React frontend.

## 1. Create a Supabase Project

1. Sign in to [Supabase](https://app.supabase.com/).
2. Create a new project.
3. From the project settings, copy the `DATABASE_URL`.
4. Keep the database credentials private.

## 2. Prepare the Backend

1. In your local `nect-app` folder, install dependencies:
   ```bash
   npm install
   ```
2. Start the backend once with Supabase enabled so tables are created:
   ```bash
   DATABASE_URL="<your_database_url>" npm run server
   ```
3. In another shell, run the migration script:
   ```bash
   DATABASE_URL="<your_database_url>" npm run migrate
   ```
4. Confirm your Supabase tables now contain the migrated rows.

## 3. Deploy the Backend

Recommended: Render or Railway.

### Render

1. Create a new Web Service in Render.
2. Connect your GitHub repository.
3. Set the root directory to `nect-app`.
4. Configure the service:
   - **Build command:** `npm install`
   - **Start command:** `npm run server`
   - **Environment:** `DATABASE_URL=<your_database_url>`
5. Deploy the service.

### Environment Variables for Backend

- `DATABASE_URL` — Postgres connection string from Supabase

## 4. Deploy the Frontend

Recommended: Vercel.

### Vercel

1. Create a new Vercel project from GitHub.
2. Point it to the `nect-app` folder.
3. Set build settings:
   - **Framework preset:** Create React App
   - **Build command:** `npm run build`
   - **Output directory:** `build`
4. Add environment variable:
   - `REACT_APP_API_BASE_URL` = `https://<your-backend-url>`
5. Deploy the site.

## 5. Production Environment Variables

For the frontend:
- `REACT_APP_API_BASE_URL` — backend service URL

For the backend:
- `DATABASE_URL` — Supabase Postgres connection string

## 6. Local Development

For local testing, the frontend proxies `/api` to the backend at `http://localhost:5000`.

- Start backend:
  ```bash
  npm run server
  ```
- Start frontend:
  ```bash
  npm start
  ```
- Or run both together:
  ```bash
  npm run dev
  ```

## 7. Notes

- `server.js` supports SQLite locally and automatically switches to Postgres when `DATABASE_URL` is present.
- `src/App.js` uses `REACT_APP_API_BASE_URL` for deployed backend calls.
- If backend and frontend are hosted on the same domain, `REACT_APP_API_BASE_URL` can be omitted and the app will use relative `/api` paths.
