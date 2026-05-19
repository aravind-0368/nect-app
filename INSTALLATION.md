# Installation Guide

## Prerequisites

- Node.js (version 18.x or later recommended)
- npm (comes with Node.js)
- A Firebase account
- A Netlify account for deployment

## Firebase Project Setup

1. Open the [Firebase console](https://console.firebase.google.com/).
2. Create a new project and name it `nect-app-5577b` or your preferred name.
3. Add a new web app to the Firebase project.
4. Copy the Firebase configuration values.
5. Enable **Realtime Database** in the Firebase console.
6. Set database rules to `test mode` during development, then tighten them before production.

## Firebase Configuration

The app currently uses `src/firebase.js` for the Firebase configuration.

If you want to move configuration to environment variables:

1. Create a `.env` file at the project root.
2. Add values like:

```bash
REACT_APP_FIREBASE_API_KEY=...
REACT_APP_FIREBASE_AUTH_DOMAIN=...
REACT_APP_FIREBASE_PROJECT_ID=...
REACT_APP_FIREBASE_STORAGE_BUCKET=...
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=...
REACT_APP_FIREBASE_APP_ID=...
REACT_APP_FIREBASE_MEASUREMENT_ID=...
```

3. Update `src/firebase.js` to read from `process.env` instead of hard-coded values.

## Local Setup

1. Clone the repository:

```bash
git clone <repo-url>
cd nect-app
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm start
```

4. Open the app in your browser:

```bash
http://localhost:3000
```

## Environment Variables in Netlify

To use Netlify environment variables:

1. Go to your site in the Netlify dashboard.
2. Open Site settings > Build & deploy > Environment.
3. Add your Firebase variables using the same names you used in `.env`.
4. Deploy the site again.

## Notes

- If you add environment variables, make sure to update `src/firebase.js` to use them.
- Rebuild the app after changing environment variables.
