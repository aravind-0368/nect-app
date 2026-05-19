# Release Notes v1.8.0

Deployment and migration notes

## Supabase migration

1. Create a Supabase project and copy the `DATABASE_URL`.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the backend once with Supabase enabled so tables are created:
   ```bash
   DATABASE_URL="<your_database_url>" npm run server
   ```
4. Run the migration script:
   ```bash
   DATABASE_URL="<your_database_url>" npm run migrate
   ```
5. Verify your Supabase database has tables `tasks`, `exercises`, `foods`, and `food_log`.

## Backend deployment

- Recommended host: Render, Railway, or another Node.js provider.
- Set the root to the `nect-app` folder.
- Build command: `npm install`
- Start command: `npm run server`
- Required environment variable:
  - `DATABASE_URL`

## Frontend deployment

- Recommended host: Vercel.
- Build command: `npm run build`
- Output directory: `build`
- Required environment variable:
  - `REACT_APP_API_BASE_URL=https://<your-backend-url>`

## Production setup

- `DATABASE_URL` — used by `server.js` to connect to Supabase Postgres.
- `REACT_APP_API_BASE_URL` — used by the React app to call deployed backend APIs.

## Local dev

- `npm run server` runs the backend on port 5000.
- `npm start` runs the frontend on port 3000 (or 3001 if 3000 is busy).
- `npm run dev` runs both concurrently.

## Notes

- If frontend and backend are hosted on the same domain, `REACT_APP_API_BASE_URL` can be omitted.
- The app now uses a local Express backend instead of Firebase.
