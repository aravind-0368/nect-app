# Deployment Guide

This guide describes how to deploy `nect-app` to Netlify and connect it to Firebase.

## Netlify Deployment

1. Push your repository to GitHub.
2. Sign in to [Netlify](https://www.netlify.com/).
3. Create a new site from Git.
4. Connect the GitHub repository for `nect-app`.
5. Configure build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `build`
6. Deploy the site.

## Firebase Config Variables

If your project is configured using environment variables:

- `REACT_APP_FIREBASE_API_KEY`
- `REACT_APP_FIREBASE_AUTH_DOMAIN`
- `REACT_APP_FIREBASE_PROJECT_ID`
- `REACT_APP_FIREBASE_STORAGE_BUCKET`
- `REACT_APP_FIREBASE_MESSAGING_SENDER_ID`
- `REACT_APP_FIREBASE_APP_ID`
- `REACT_APP_FIREBASE_MEASUREMENT_ID`

Add these values in Netlify under Site settings > Build & deploy > Environment.

## Publish Directory

Set the publish directory to:

```bash
build
```

## Build Command

Use:

```bash
npm run build
```

## Verify Deployment

1. Open the deployed site.
2. Confirm the app loads successfully.
3. Check that tasks and food entries sync with Firebase.
4. If the app fails, inspect Netlify deploy logs for build errors.

## Troubleshooting

- Ensure Firebase config values are correct.
- Confirm Realtime Database rules allow access.
- If using env vars, redeploy after adding them.
- Verify `npm install` and `npm run build` succeed locally before deployment.
