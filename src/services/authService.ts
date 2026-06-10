import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from 'firebase/auth';
import type { User } from 'firebase/auth';
import type { FirebaseError } from 'firebase/app';
import { auth } from '../firebase/firebase.js';
import { saveUserData } from './firestoreService.js';

interface SignupData {
  email: string;
  password: string;
  name: string;
  department: string;
  phone: string;
}

interface LoginData {
  email: string;
  password: string;
}

// Create or update user in Firestore
const saveUserToFirestore = async (user: User, userData?: Omit<SignupData, 'email' | 'password'>) => {
  try {
    await saveUserData(user.uid, {
      email: user.email ?? '',
      name: userData?.name || user.displayName || '',
      department: userData?.department || '',
      phone: userData?.phone || '',
    });
  } catch (error) {
    console.error('Error saving user to Firestore:', error);
    throw error;
  }
};

// Sign up with email and password
export const signup = async (data: SignupData) => {
  try {
    const { email, password, ...userData } = data;
    
    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Save user details to Firestore
    await saveUserToFirestore(user, userData);

    return user;
  } catch (error) {
    console.error('Signup error:', error);
    throw error;
  }
};

// Login with email and password
export const login = async (data: LoginData) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
    return userCredential.user;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// Sign in with Google
export const signInWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Save or update user in Firestore
    await saveUserToFirestore(user);

    return user;
  } catch (error) {
    console.error('Google sign-in error:', error);

    const firebaseError = error as FirebaseError;
    if (firebaseError.code === 'auth/unauthorized-domain') {
      throw new Error(
        'Firebase auth blocked this domain. Add your Vercel domain to Firebase Authentication > Authorized domains.'
      );
    }

    throw error;
  }
};
