import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: 'AIzaSyB0IMgJkjquDeYmuncJ71NTNp_iF2ANhjA',
  authDomain: 'nect-app-5577b.firebaseapp.com',
  projectId: 'nect-app-5577b',
  storageBucket: 'nect-app-5577b.firebasestorage.app',
  messagingSenderId: '38289219904',
  appId: '1:38289219904:web:7e048474d6d38eb9249aa5',
  measurementId: 'G-KKYST6G3X4'
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
