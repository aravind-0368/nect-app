import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || 'AIzaSyB0IMgJkjquDeYmuncJ71NTNp_iF2ANhjA',
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || 'nect-app-5577b.firebaseapp.com',
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || 'nect-app-5577b',
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL || 'https://nect-app-5577b-default-rtdb.firebaseio.com',
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || 'nect-app-5577b.firebasestorage.app',
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || '38289219904',
  appId: process.env.REACT_APP_FIREBASE_APP_ID || '1:38289219904:web:7e048474d6d38eb9249aa5',
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || 'G-KKYST6G3X4'
};

const app = initializeApp(firebaseConfig);
let analytics = null;

if (typeof window !== 'undefined') {
  try {
    analytics = getAnalytics(app);
  } catch (error) {
    console.warn('Firebase analytics is not available in this environment.', error);
  }
}

const database = getDatabase(app);

export { app, analytics, database };
