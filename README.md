# nect-app

A health activity tracker for Tasks, Exercise, and Food logging.

## Project Overview

`nect-app` combines three main modules:

- **Task Tracker** — create tasks, mark them complete, and earn points.
- **Exercise Planner** — build exercise templates and track workout completion.
- **Food Tracker** — log meals, calculate calories, and track nutrition.

## Tech Stack

- **React** for the frontend UI
- **Firebase** for realtime data storage
- **Netlify** for deployment and hosting

## Features

- Dashboard view with points, calories, and exercise progress
- Task management with add, complete, and delete actions
- Automatic task cleanup after 30 days
- Food logging with calorie and protein tracking
- Realtime Firebase sync for tasks, food data, and logs

## Quick Start

```bash
git clone <repo-url>
cd nect-app
npm install
npm start
```

Open the app at:

```bash
http://localhost:3000
```

## Deployment

1. Run:
   ```bash
   npm run build
   ```
2. Deploy the `build` folder to Netlify.
3. Configure Firebase settings for production deployment.

## Documentation

- `INSTALLATION.md` — setup and local installation guide
- `SCHEMA.md` — database schema reference
- `DEPLOYMENT.md` — Netlify deployment guide
- `USAGE.md` — end-user application guide
- `CONTRIBUTING.md` — contribution guide
