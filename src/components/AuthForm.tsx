import { AnimatePresence, motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowRight, Building, Lock, Mail, Phone, User, Eye, EyeOff, Check } from 'lucide-react';
import { DEPARTMENTS } from '../constants/departments';
import { useAuth } from '../hooks/useAuth';
import { signup, login, signInWithGoogle, isAuthRequestInProgress, GOOGLE_SIGNUP_STORAGE_KEY } from '../services/authService';

const AuthForm = () => {
  const { currentUser, loading: authLoading } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Auto-redirect when user is authenticated via redirect
  useEffect(() => {
    if (currentUser && !isLoading && !authLoading) {
      // Check if this is a new user from Google redirect
      const isNewUser = localStorage.getItem(GOOGLE_SIGNUP_STORAGE_KEY) === 'true';
      
      if (isNewUser) {
        localStorage.removeItem(GOOGLE_SIGNUP_STORAGE_KEY);
        navigate('/complete-profile');
      } else if (!isSignUp) {
        // Only auto-redirect if we're in sign-in mode (not sign-up)
        navigate('/dashboard');
      }
    }
  }, [currentUser, authLoading, isLoading, navigate, isSignUp]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevent multiple simultaneous requests
    if (isLoading || isAuthRequestInProgress()) {
      return;
    }

    setAuthError('');
    setStatusMessage('');
    setIsLoading(true);

    try {
      if (isSignUp) {
        // Validate signup fields
        if (!name || !email || !password || !phone || !department) {
          throw new Error('Please fill in all fields');
        }
        
        setStatusMessage('Creating your account...');
        
        await signup({
          email,
          password,
          name,
          department,
          phone,
        });
      } else {
        // Login
        if (!email || !password) {
          throw new Error('Please enter email and password');
        }
        
        setStatusMessage('Signing you in...');
        
        await login({
          email,
          password,
        });
      }

      setIsSuccess(true);
      setStatusMessage('Success! Redirecting to dashboard...');
      
      setTimeout(() => navigate('/dashboard'), 600);
    } catch (error) {
      const fallbackError = isSignUp ? 'Sign up failed. Please try again.' : 'Sign in failed. Please try again.';
      if (error instanceof Error) {
        setAuthError(error.message || fallbackError);
      } else {
        setAuthError(fallbackError);
      }
      setStatusMessage('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    // Prevent multiple simultaneous requests
    if (isGoogleLoading || isAuthRequestInProgress()) {
      return;
    }

    setAuthError('');
    setStatusMessage('');
    setIsGoogleLoading(true);

    try {
      setStatusMessage('Connecting to Google...');
      const result = await signInWithGoogle();

      if (result.redirect) {
        setStatusMessage('Redirecting to Google... Please wait.');
        return;
      }

      if (result.user) {
        setIsGoogleLoading(false);
        if (result.isNewUser && typeof window !== 'undefined') {
          window.localStorage.setItem(GOOGLE_SIGNUP_STORAGE_KEY, 'true');
          navigate('/complete-profile');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (error) {
      setIsGoogleLoading(false);
      const fallbackError = 'Google sign-in failed. Please try again.';
      if (error instanceof Error) {
        setAuthError(error.message || fallbackError);
      } else {
        setAuthError(fallbackError);
      }
      setStatusMessage('');
    }
  };

  const inputClassName =
    'peer w-full rounded-xl border border-white/20 bg-white/10 px-11 py-4 text-base leading-6 text-slate-100 placeholder:text-transparent outline-none transition-all duration-300 focus:border-primary-300/80 focus:bg-white/15 focus:shadow-[0_0_0_4px_rgba(59,130,246,0.18)]';
  const getLabelClassName = (hasValue: boolean) =>
    `pointer-events-none absolute left-11 text-slate-400 transition-all duration-150 ${
      hasValue
        ? 'top-4 translate-y-0 text-sm opacity-0'
        : 'top-1/2 -translate-y-1/2 text-base peer-focus:top-3 peer-focus:translate-y-0 peer-focus:text-sm peer-focus:opacity-0'
    } peer-focus:text-primary-200`;

  return (
    <motion.div
      className="w-full max-w-md"
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
      whileHover={!isSuccess ? { y: -3 } : {}}
    >
      <div className="relative overflow-hidden rounded-3xl border border-white/20 bg-white/10 p-6 shadow-[0_30px_70px_rgba(2,6,23,0.45)] backdrop-blur-xl md:p-8">
        <div className="absolute inset-0 bg-gradient-to-b from-white/15 to-transparent opacity-80" />
        <div className="relative">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-white">{isSignUp ? 'Create account' : 'Welcome back'}</h2>
            <motion.button
              type="button"
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setIsSignUp((current) => !current);
                setAuthError('');
                setStatusMessage('');
              }}
              disabled={isLoading || isGoogleLoading || isSuccess}
              className="rounded-full border border-white/20 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-200 transition hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSignUp ? 'Switch to sign in' : 'Switch to sign up'}
            </motion.button>
          </div>

          <AnimatePresence mode="wait">
            <motion.form
              key={isSignUp ? 'signup' : 'signin'}
              onSubmit={handleSubmit}
              className="space-y-4"
              autoComplete="off"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
            >
              {isSignUp && (
                <>
                  <div className="relative">
                    <User className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-300" />
                    <input
                      type="text"
                      name="name"
                      placeholder=" "
                      className={inputClassName}
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      autoComplete="off"
                      disabled={isLoading || isSuccess}
                    />
                    <label className={getLabelClassName(name.length > 0)}>Full name</label>
                  </div>

                  <div className="relative">
                    <Building className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-300" />
                    <select
                      className={`${inputClassName} appearance-none`}
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      disabled={isLoading || isSuccess}
                    >
                      <option value="">Select Department</option>
                      {DEPARTMENTS.map((dept) => (
                        <option key={dept} value={dept} className="text-slate-900">
                          {dept}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="relative">
                    <Phone className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-300" />
                    <input
                      type="tel"
                      name="phone"
                      placeholder=" "
                      className={inputClassName}
                      value={phone}
                      onChange={(event) => setPhone(event.target.value)}
                      autoComplete="off"
                      disabled={isLoading || isSuccess}
                    />
                    <label className={getLabelClassName(phone.length > 0)}>Phone number</label>
                  </div>
                </>
              )}

              <div className="relative">
                <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-300" />
                <input
                  type="email"
                  name="email"
                  placeholder=" "
                  className={inputClassName}
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  autoComplete="off"
                  disabled={isLoading || isSuccess}
                />
                <label className={getLabelClassName(email.length > 0)}>Email address</label>
              </div>

              <div className="relative">
                <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-300" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder=" "
                  className={inputClassName}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="new-password"
                  disabled={isLoading || isSuccess}
                />
                <label className={getLabelClassName(password.length > 0)}>Password</label>
                <button
                  type="button"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  onClick={() => setShowPassword((s) => !s)}
                  disabled={isLoading || isSuccess}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300/90 hover:text-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>

              <motion.button
                type="submit"
                disabled={isLoading || isSuccess}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 py-3 font-medium text-white shadow-[0_14px_30px_rgba(37,99,235,0.45)] transition disabled:opacity-70 disabled:cursor-not-allowed"
                whileHover={{ scale: isLoading || isSuccess ? 1 : 1.01 }}
                whileTap={{ scale: isLoading || isSuccess ? 1 : 0.98 }}
              >
                {isLoading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white"
                    />
                    <span>Processing...</span>
                  </>
                ) : isSuccess ? (
                  <>
                    <Check className="h-4 w-4" />
                    <span>Success!</span>
                  </>
                ) : (
                  <>
                    {isSignUp ? 'Create account' : 'Sign in'}
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </motion.button>
            </motion.form>
          </AnimatePresence>

          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-white/15" />
            <span className="text-xs uppercase tracking-[0.16em] text-slate-300">or continue with</span>
            <div className="h-px flex-1 bg-white/15" />
          </div>

          <motion.button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isGoogleLoading || isLoading || isSuccess}
            whileHover={{ scale: !isGoogleLoading && !isLoading && !isSuccess ? 1.01 : 1 }}
            whileTap={{ scale: !isGoogleLoading && !isLoading && !isSuccess ? 0.99 : 1 }}
            className="w-full rounded-xl border border-white/25 bg-white/5 py-3 font-medium text-slate-100 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isGoogleLoading ? (
              <span className="flex items-center justify-center gap-2">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="h-4 w-4 rounded-full border-2 border-slate-100/30 border-t-slate-100"
                />
                Connecting...
              </span>
            ) : isSuccess ? (
              <span className="flex items-center justify-center gap-2">
                <Check className="h-4 w-4" />
                Complete
              </span>
            ) : (
              'Continue with Google'
            )}
          </motion.button>

          {/* Status messages */}
          <AnimatePresence>
            {statusMessage && !authError && !isGoogleLoading && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="mt-4 rounded-xl border border-blue-300/40 bg-blue-500/10 px-4 py-3 text-sm text-blue-200"
              >
                <div className="flex items-center gap-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    className="h-3 w-3 rounded-full border border-blue-400/40 border-t-blue-300"
                  />
                  {statusMessage}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error messages */}
          <AnimatePresence>
            {authError ? (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="mt-4 flex items-start gap-2 rounded-xl border border-rose-300/40 bg-rose-500/10 p-3 text-sm text-rose-200"
              >
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{authError}</span>
              </motion.div>
            ) : null}
          </AnimatePresence>

          {/* Success message */}
          <AnimatePresence>
            {isSuccess && !authError ? (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-300/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200"
              >
                <Check className="h-4 w-4 shrink-0" />
                <span>{statusMessage || 'Authentication successful. Redirecting...'}</span>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default AuthForm;