import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './style.css';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './routes/ProtectedRoute';

const AuthPage = lazy(() => import('./pages/AuthPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const CompleteProfilePage = lazy(() => import('./pages/CompleteProfilePage'));

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen">
          <Suspense
            fallback={
              <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
                Loading...
              </div>
            }
          >
            <Routes>
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/" element={<Navigate to="/auth" replace />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/complete-profile"
                element={
                  <ProtectedRoute>
                    <CompleteProfilePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Suspense>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;