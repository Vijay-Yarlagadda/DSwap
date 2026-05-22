import React, { createContext, useState, useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import type { User } from 'firebase/auth';
import { auth } from '../firebase/firebase.js';
import { onAuthStateChanged, signOut } from 'firebase/auth';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Set a timeout to prevent being stuck in loading state
    timeoutRef.current = setTimeout(() => {
      console.warn('Auth loading timeout, setting loading to false');
      setLoading(false);
    }, 5000);

    try {
      // Listen to auth state changes
      const unsubscribe = onAuthStateChanged(
        auth,
        (user) => {
          setCurrentUser(user);
          setLoading(false);
          // Clear timeout once auth is resolved
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }
        },
        (error) => {
          console.error('Auth state error:', error);
          setLoading(false);
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }
        }
      );

      return () => {
        unsubscribe();
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    } catch (error) {
      console.error('Auth provider error:', error);
      setLoading(false);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    }
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const value: AuthContextType = {
    currentUser,
    loading,
    logout
  };

  // Always render children, but show loading state if needed
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
