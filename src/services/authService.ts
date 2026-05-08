import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  User
} from 'firebase/auth';
import { auth, db } from '../firebase/config';
import { doc, setDoc } from 'firebase/firestore';

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
    const userRef = doc(db, 'users', user.uid);
    
    await setDoc(userRef, {
      email: user.email,
      name: userData?.name || user.displayName || '',
      department: userData?.department || '',
      phone: userData?.phone || '',
    }, { merge: true });
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
    throw error;
  }
};
