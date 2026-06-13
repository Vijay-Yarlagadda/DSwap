import React, { createContext, useState, useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import type { User } from 'firebase/auth';
import { auth } from '../firebase/firebase.js';
import {
  onAuthStateChanged,
  signOut,
  getRedirectResult,
  getAdditionalUserInfo,
} from 'firebase/auth';
import { saveUserData } from '../services/firestoreService.js';
import { GOOGLE_SIGNUP_STORAGE_KEY } from '../services/authService';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  logout: () => Promise<void>;
  error: string | null;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const unsubscribeRef = useRef<(() => void) | null>(null);
  const redirectProcessedRef = useRef(false);

  useEffect(() => {
    let mounted = true;
    console.debug('[AuthContext] Setting up Auth listener...');

    // We don't set a hard timeout anymore because onAuthStateChanged handles the initial load immediately.
    // However, if getRedirectResult takes a while, we want to let it finish.

    const checkRedirect = async () => {
      try {
        console.debug('[AuthContext] Checking redirect result...');
        const redirectResult = await getRedirectResult(auth);
        
        if (redirectResult && redirectResult.user) {
          console.debug('[AuthContext] Redirect result found, user:', redirectResult.user.email);
          const user = redirectResult.user;
          const isNewUser = getAdditionalUserInfo(redirectResult)?.isNewUser ?? false;
          
          if (isNewUser) {
            try {
              await saveUserData(user.uid, {
                email: user.email ?? '',
                name: user.displayName || '',
                department: '',
                phone: '',
              });
              if (typeof window !== 'undefined') {
                window.localStorage.setItem(GOOGLE_SIGNUP_STORAGE_KEY, 'true');
              }
            } catch (err) {
              console.debug('[AuthContext] Error saving redirect user to Firestore:', err);
            }
          } else if (typeof window !== 'undefined') {
            window.localStorage.removeItem(GOOGLE_SIGNUP_STORAGE_KEY);
          }
          // We DO NOT call setCurrentUser here!
          // We let onAuthStateChanged handle the state update to prevent race conditions.
        } else {
          console.debug('[AuthContext] No Google redirect result found.');
        }
      } catch (redirectErr) {
        console.error('[AuthContext] Error checking redirect result:', redirectErr);
        if (mounted) {
          setError('Google redirect sign-in failed. Please try again.');
        }
      }
    };

    // Check for redirect immediately, but don't await it to block onAuthStateChanged
    checkRedirect();

    // Set up auth state listener immediately
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        console.debug('[AuthContext] Auth state changed. User:', user ? user.email : 'null');
        if (mounted) {
          setCurrentUser(user);
          setLoading(false);
          setError(null);
        }
      },
      (authError) => {
        console.error('[AuthContext] Auth state error:', authError);
        if (mounted) {
          setError(authError?.message || 'Authentication check failed');
          setLoading(false);
        }
      }
    );

    unsubscribeRef.current = unsubscribe;

    // Cleanup function
    return () => {
      mounted = false;
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, []);

  const logout = React.useCallback(async () => {
    try {
      setError(null);
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(GOOGLE_SIGNUP_STORAGE_KEY);
      }
      await signOut(auth);
      setCurrentUser(null);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Logout failed';
      console.error('Logout error:', message);
      setError(message);
    }
  }, []);

  const value: AuthContextType = React.useMemo(
    () => ({
      currentUser,
      loading,
      logout,
      error,
    }),
    [currentUser, loading, logout, error]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
