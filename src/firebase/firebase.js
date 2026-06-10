import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const hasFirebaseConfig = Boolean(
  firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId &&
    firebaseConfig.messagingSenderId &&
    firebaseConfig.appId
);

if (!hasFirebaseConfig) {
  throw new Error(
    'Firebase is not configured. Add VITE_FIREBASE_* values to your .env or Vercel environment variables.'
  );
}

let firebaseApp;
let authInstance;
let dbInstance;

// Lazy initialize Firebase app
function getFirebaseApp() {
  if (!firebaseApp) {
    try {
      firebaseApp = initializeApp(firebaseConfig);
    } catch (error) {
      // Firebase app already initialized in some cases
      console.debug('Firebase app initialization:', error);
    }
  }
  return firebaseApp;
}

// Lazy get Auth instance
export function getAuthInstance() {
  try {
    if (!authInstance) {
      const app = getFirebaseApp();
      authInstance = getAuth(app);
    }
    return authInstance;
  } catch (error) {
    console.error('Error getting auth instance:', error);
    throw new Error('Failed to initialize authentication');
  }
}

// Lazy get Firestore instance
export function getDbInstance() {
  try {
    if (!dbInstance) {
      const app = getFirebaseApp();
      dbInstance = getFirestore(app);
    }
    return dbInstance;
  } catch (error) {
    console.error('Error getting database instance:', error);
    throw new Error('Failed to initialize database');
  }
}

// Initialize Firebase app immediately
const app = getFirebaseApp();

// Export instances for backward compatibility
export const auth = getAuthInstance();
export const db = getDbInstance();

export default app;