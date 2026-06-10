import React, { createContext, useState, useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import type { User } from 'firebase/auth';
import { auth } from '../firebase/firebase.js';
import { onAuthStateChanged, signOut } from 'firebase/auth';

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

  useEffect(() => {
    // Set a timeout to force completion of auth state check
    timeoutRef.current = setTimeout(() => {
      console.debug('Auth initialization timeout, forcing completion');
      setLoading(false);
    }, 8000); // Increased timeout to 8s for slower networks

    try {
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
