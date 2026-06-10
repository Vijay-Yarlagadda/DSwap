import React, { createContext, useState, useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import type { User } from 'firebase/auth';
import { auth } from '../firebase/firebase.js';
import { onAuthStateChanged, signOut, getRedirectResult } from 'firebase/auth';
import { saveUserData } from '../services/firestoreService.js';

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
    // Set a timeout to force completion of auth state check
    timeoutRef.current = setTimeout(() => {
      console.debug('Auth initialization timeout, forcing completion');
      setLoading(false);
    }, 10000); // Increased to 10s to handle redirect flow

    const initializeAuth = async () => {
      try {
        // First, check for redirect result from Google Sign-In (mobile)
        if (!redirectProcessedRef.current) {
          redirectProcessedRef.current = true;
          try {
            const redirectResult = await getRedirectResult(auth);
            if (redirectResult && redirectResult.user) {
              console.debug('Redirect result found, user:', redirectResult.user.email);
              const user = redirectResult.user;
              // Save user data to Firestore if it's a new user
              try {
                await saveUserData(user.uid, {
                  email: user.email ?? '',
                  name: user.displayName || '',
                  department: '',
                  phone: '',
                });
              } catch (err) {
                console.debug('Error saving redirect user to Firestore:', err);
              }
              setCurrentUser(user);
              setError(null);
              setLoading(false);
              if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
              }
              return; // Exit early, auth state listener will handle subsequent updates
            }
          } catch (redirectErr) {
            console.debug('Error checking redirect result:', redirectErr);
          }
        }

        // Set up auth state listener
        unsubscribeRef.current = onAuthStateChanged(
          auth,
          (user) => {
            setCurrentUser(user);
            setLoading(false);
            setError(null);
            if (timeoutRef.current) {
              clearTimeout(timeoutRef.current);
            }
          },
          (authError) => {
            console.error('Auth state error:', authError);
            setError(authError?.message || 'Authentication check failed');
            setLoading(false);
            if (timeoutRef.current) {
              clearTimeout(timeoutRef.current);
            }
          }
        );
      } catch (error) {
        console.error('Auth provider setup error:', error);
        setError(error instanceof Error ? error.message : 'Failed to initialize authentication');
        setLoading(false);
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      }
    };

    initializeAuth();

    // Cleanup function
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const logout = React.useCallback(async () => {
    try {
      setError(null);
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
