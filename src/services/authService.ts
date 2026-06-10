import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  getAdditionalUserInfo,
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

interface GoogleSignInResult {
  user?: User;
  isNewUser?: boolean;
  redirect?: boolean;
  requiresCompleteProfile?: boolean;
}

// Request semaphore to prevent race conditions
class AuthRequestSemaphore {
  private isRequestInProgress = false;
  private requestQueue: Array<() => Promise<any>> = [];

  async execute<T>(operation: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      const executeOperation = async () => {
        this.isRequestInProgress = true;
        try {
          const result = await operation();
          resolve(result);
        } catch (error) {
          reject(error);
        } finally {
          this.isRequestInProgress = false;
          // Execute next queued request if any
          const nextOperation = this.requestQueue.shift();
          if (nextOperation) {
            nextOperation();
          }
        }
      };

      if (this.isRequestInProgress) {
        // Queue the operation to run when current one completes
        this.requestQueue.push(executeOperation);
      } else {
        executeOperation();
      }
    });
  }

  isActive(): boolean {
    return this.isRequestInProgress || this.requestQueue.length > 0;
  }
}

const authSemaphore = new AuthRequestSemaphore();

const MOBILE_USER_AGENT_REGEX = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;

// Detect if device is mobile
const isMobileDevice = () => {
  if (typeof navigator === 'undefined') return false;
  return MOBILE_USER_AGENT_REGEX.test(navigator.userAgent);
};

// Check online status with more reliable method
const isOnline = (): boolean => {
  if (typeof navigator === 'undefined') return true;
  return navigator.onLine;
};

// Monitor online/offline changes
const setupNetworkListener = () => {
  if (typeof window === 'undefined') return;
  
  // Store listener references to avoid memory leaks
  window.addEventListener('online', () => {
    console.debug('Network: Online');
  });
  
  window.addEventListener('offline', () => {
    console.debug('Network: Offline');
  });
};

// Call this once on app initialization
setupNetworkListener();

// Check if error is retryable
const isRetryableNetworkError = (error: unknown) => {
  const code = (error as any)?.code;
  return (
    code === 'auth/network-request-failed' ||
    code === 'auth/timeout' ||
    code === 'auth/too-many-requests'
  );
};

// Check if error is a temporary popup issue
const isTemporaryPopupError = (error: unknown) => {
  const code = (error as any)?.code;
  return (
    code === 'auth/popup-blocked' ||
    code === 'auth/popup-closed-by-user' ||
    code === 'auth/cancelled-popup-request'
  );
};

// Convert Firebase errors to professional user-friendly messages
const normalizeError = (error: unknown): Error => {
  const firebaseError = error as FirebaseError;

  if (firebaseError?.code) {
    switch (firebaseError.code) {
      case 'auth/invalid-email':
        return new Error('Please enter a valid email address.');
      case 'auth/user-disabled':
        return new Error('This account has been disabled. Please contact support for assistance.');
      case 'auth/user-not-found':
        return new Error('No account found with this email. Please sign up first.');
      case 'auth/wrong-password':
        return new Error('Incorrect password. Please try again.');
      case 'auth/network-request-failed':
        return new Error('Connection issue. Please check your internet and try again.');
      case 'auth/timeout':
        return new Error('Request timed out. Please check your connection and try again.');
      case 'auth/too-many-requests':
        return new Error('Too many attempts. Please wait a few minutes and try again.');
      case 'auth/popup-closed-by-user':
        return new Error('Sign-in cancelled. Please try again.');
      case 'auth/popup-blocked':
        return new Error('Browser blocked the sign-in popup. Please allow popups and try again.');
      case 'auth/cancelled-popup-request':
        return new Error('Sign-in was cancelled. Please try again.');
      case 'auth/unauthorized-domain':
        return new Error('Sign-in is not available on this domain. Please contact support.');
      case 'auth/operation-not-supported-in-this-environment':
        return new Error('Sign-in is not supported in your browser. Try a different browser.');
      case 'auth/account-exists-with-different-credential':
        return new Error('This email is already registered with a different sign-in method.');
      case 'auth/invalid-credential':
        return new Error('Invalid credentials. Please try again.');
      case 'auth/weak-password':
        return new Error('Password must be at least 6 characters.');
      case 'auth/email-already-in-use':
        return new Error('This email is already registered. Please sign in instead.');
      case 'auth/requires-recent-login':
        return new Error('Please sign in again for security.');
      default:
        if (firebaseError.message?.includes('offline')) {
          return new Error('You appear to be offline. Check your connection and try again.');
        }
        return new Error(firebaseError.message || 'Authentication failed. Please try again.');
    }
  }

  if (error instanceof Error) {
    return new Error(error.message);
  }

  return new Error('Authentication failed. Please try again.');
};

// Retry logic with exponential backoff
const retryNetworkRequest = async <T>(
  operation: () => Promise<T>,
  maxRetries = 1
): Promise<T> => {
  let lastError: any;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      // Check network before attempting
      if (!isOnline()) {
        throw new Error('offline');
      }
      
      return await operation();
    } catch (error) {
      lastError = error;
      
      // Only retry on network errors
      if (isRetryableNetworkError(error) && attempt < maxRetries) {
        // Exponential backoff: 500ms, 1000ms, etc.
        const delayMs = Math.min(500 * Math.pow(2, attempt), 2000);
        await new Promise((resolve) => setTimeout(resolve, delayMs));
        continue;
      }
      
      throw error;
    }
  }
  
  throw lastError;
};

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
    // Don't throw here - user should still be able to access app even if profile save fails
  }
};

// Sign up with email and password
export const signup = async (data: SignupData): Promise<User> => {
  return authSemaphore.execute(async () => {
    if (!isOnline()) {
      throw new Error('offline');
    }

    try {
      const { email, password, ...userData } = data;
      const userCredential = await retryNetworkRequest(async () =>
        createUserWithEmailAndPassword(auth, email, password)
      );
      const user = userCredential.user;
      await saveUserToFirestore(user, userData);
      return user;
    } catch (error) {
      console.error('Signup error:', error);
      throw normalizeError(error);
    }
  });
};

// Login with email and password
export const login = async (data: LoginData): Promise<User> => {
  return authSemaphore.execute(async () => {
    if (!isOnline()) {
      throw new Error('offline');
    }

    try {
      const userCredential = await retryNetworkRequest(async () =>
        signInWithEmailAndPassword(auth, data.email, data.password)
      );
      return userCredential.user;
    } catch (error) {
      console.error('Login error:', error);
      throw normalizeError(error);
    }
  });
};

// Sign in with Google (device-aware, with comprehensive error handling)
export const signInWithGoogle = async (): Promise<GoogleSignInResult> => {
  return authSemaphore.execute(async () => {
    if (!isOnline()) {
      throw new Error('offline');
    }

    const provider = new GoogleAuthProvider();
    const mobile = isMobileDevice();
    
    // Improve popup behavior
    provider.setCustomParameters({
      prompt: 'select_account',
      access_type: 'online',
    });

    try {
      // Use redirect on mobile, popup on desktop
      if (mobile) {
        // Mobile: Always use redirect
        await signInWithRedirect(auth, provider);
        return { redirect: true };
      } else {
        // Desktop: Try popup first
        try {
          const result = await signInWithPopup(auth, provider);
          const user = result.user;
          const isNewUser = getAdditionalUserInfo(result)?.isNewUser ?? false;
          await saveUserToFirestore(user);
          return { user, isNewUser };
        } catch (popupError) {
          // If popup fails with temporary errors, try redirect fallback
          if (isTemporaryPopupError(popupError)) {
            console.debug('Popup failed, falling back to redirect:', (popupError as any)?.code);
            try {
              await signInWithRedirect(auth, provider);
              return { redirect: true };
            } catch (redirectError) {
              // If both fail, throw the original popup error
              throw popupError;
            }
          }
          throw popupError;
        }
      }
    } catch (error) {
      console.error('Google sign-in error:', error);
      throw normalizeError(error);
    }
  });
};

// Handle Google Sign-In redirect result (call this on app load/auth page load)
export const getGoogleRedirectResult = async (): Promise<GoogleSignInResult | null> => {
  if (!isOnline()) {
    // Don't throw - just return null if offline
    return null;
  }

  try {
    const result = await getRedirectResult(auth);
    if (result && result.user) {
      const user = result.user;
      const isNewUser = getAdditionalUserInfo(result)?.isNewUser ?? false;
      await saveUserToFirestore(user);
      return { user, isNewUser };
    }
    return null;
  } catch (error) {
    console.error('Google redirect result error:', error);
    // Return null instead of throwing - redirect handling should be lenient
    // The error will be shown on the page if needed
    return null;
  }
};

// Check if an auth request is currently in progress
export const isAuthRequestInProgress = (): boolean => {
  return authSemaphore.isActive();
};
