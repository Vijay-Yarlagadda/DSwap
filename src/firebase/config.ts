import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCvmBIiaQMdmVzZqLR7VP06hONrrhFloIo",
  authDomain: "dswap-6d834.firebaseapp.com",
  projectId: "dswap-6d834",
  storageBucket: "dswap-6d834.firebasestorage.app",
  messagingSenderId: "548215971868",
  appId: "1:548215971868:web:160fa936d6e05a0eca3fd9",
  measurementId: "G-EP5M9TN15S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Initialize Firestore Database
export const db = getFirestore(app);

export default app;
