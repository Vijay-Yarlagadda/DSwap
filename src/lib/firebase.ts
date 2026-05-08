import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
};

export const hasFirebaseConfig = Boolean(
  firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId &&
    firebaseConfig.appId &&
    firebaseConfig.messagingSenderId,
);

let authInstance: ReturnType<typeof getAuth> | null = null;

export const getFirebaseAuth = () => {
  if (!hasFirebaseConfig) {
    throw new Error('Firebase is not configured. Add VITE_FIREBASE_* keys to your .env file.');
  }

  if (!authInstance) {
    const app = initializeApp(firebaseConfig);
    authInstance = getAuth(app);
  }

  return authInstance;
};
