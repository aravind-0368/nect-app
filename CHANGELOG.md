# Changelog

## [1.8.0] - 2026-05-20
### Added
- Supabase/Postgres support using `DATABASE_URL` for production.
- Express backend in `server.js` with SQLite fallback for local development.
- Migration script `scripts/migrate-sqlite-to-pg.js` for copying local SQLite data into Postgres.
- Environment variable support in `src/App.js` via `REACT_APP_API_BASE_URL`.
- `.env.example` file for environment setup.
- Dashboard, Exercises, Food, and Tasks navbar icons using custom image assets.

### Updated
- Documentation for deployment, installation, and migration workflows.
- `README.md`, `DEPLOYMENT.md`, `INSTALLATION.md`, and `README_DEPLOY.md` with v1.8.0 release notes.
- `package.json` version updated to `1.8.0`.
