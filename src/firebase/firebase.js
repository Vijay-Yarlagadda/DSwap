import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyCvmBIiaQMdmVzZqLR7VP06hONrrhFloIo',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'dswap-6d834.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'dswap-6d834',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:548215971868:web:160fa936d6e05a0eca3fd9',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '548215971868',
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
