import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getUserData } from '../services/firestoreService.js';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { currentUser, loading } = useAuth();
  const location = useLocation();
  const [profileChecking, setProfileChecking] = useState(true);
  const [profileComplete, setProfileComplete] = useState(false);

  useEffect(() => {
    let active = true;

    const validateProfile = async () => {
      if (!currentUser) {
        setProfileChecking(false);
        return;
      }

      setProfileChecking(true);
      try {
        const userData = await getUserData(currentUser.uid);
        const isGoogleUser = currentUser.providerData?.some(
          (provider) => provider.providerId === 'google.com'
        );
        const isComplete = !!userData?.department && !!userData?.phone;
        if (active) {
          setProfileComplete(isComplete || Boolean(isGoogleUser));
        }
      } catch {
        if (active) {
          setProfileComplete(Boolean(currentUser.providerData?.some(
            (provider) => provider.providerId === 'google.com'
          )));
        }
      } finally {
        if (active) {
          setProfileChecking(false);
        }
      }
    };

    validateProfile();
    return () => {
      active = false;
    };
  }, [currentUser, location.pathname]);

  if (loading || profileChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950 text-slate-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-300 mx-auto mb-4"></div>
          <p className="text-sm text-slate-300">Checking account status...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/auth" replace />;
  }

  if (location.pathname === '/complete-profile' && profileComplete) {
    return <Navigate to="/dashboard" replace />;
  }

  if (location.pathname !== '/complete-profile' && !profileComplete) {
    return <Navigate to="/complete-profile" replace />;
  }

  return <>{children}</>;
};
