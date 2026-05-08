import { useEffect, useState, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowLeft, Building, Mail, Phone, User } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { DEPARTMENTS } from '../constants/departments';
import { getUserData, updateUserProfile } from '../services/firestoreService.js';

const CompleteProfilePage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadProfile = async () => {
      if (!currentUser) return;
      setIsLoading(true);
      setError('');

      try {
        const userData = await getUserData(currentUser.uid);
        setName(userData?.name || currentUser.displayName || '');
        setEmail(userData?.email || currentUser.email || '');
        setDepartment(userData?.department || '');
        setPhone(userData?.phone || '');

        if (userData?.department && userData?.phone) {
          navigate('/dashboard');
        }
      } catch (err) {
        console.error('Error loading profile:', err);
        setError('Unable to load profile details.');
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [currentUser, navigate]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!currentUser) return;

    if (!department || !phone) {
      setError('Please provide your department and phone number.');
      return;
    }

    setIsSaving(true);
    setError('');

    try {
      await updateUserProfile(currentUser.uid, {
        name,
        department,
        phone,
      });
      navigate('/dashboard');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save profile';
      setError(message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(56,189,248,0.22),transparent_30%),radial-gradient(circle_at_85%_25%,rgba(59,130,246,0.18),transparent_36%)]" />
      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl items-center px-4 py-10 sm:px-6">
        <motion.div
          className="w-full rounded-[2rem] border border-white/10 bg-slate-950/75 p-6 shadow-[0_30px_80px_rgba(3,9,23,0.65)] backdrop-blur-2xl sm:p-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-white">Complete your profile</h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-400">
                Your Google sign-in is ready. Just fill in the remaining details to keep your account secure and complete.
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate('/auth')}
              className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/10"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to sign in
            </button>
          </div>

          {error && (
            <motion.div
              className="mb-6 rounded-3xl border border-rose-300/30 bg-rose-500/10 p-4 text-sm text-rose-200"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            </motion.div>
          )}

          <form className="grid gap-6" onSubmit={handleSubmit}>
            <div className="grid gap-5 md:grid-cols-2">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
                <label className="mb-2 flex items-center text-sm uppercase tracking-[0.2em] text-slate-400">
                  <User className="mr-2 h-4 w-4" />
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  disabled
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-slate-200 outline-none"
                />
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
                <label className="mb-2 flex items-center text-sm uppercase tracking-[0.2em] text-slate-400">
                  <Mail className="mr-2 h-4 w-4" />
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  disabled
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-slate-200 outline-none"
                />
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
                <label className="mb-2 flex items-center text-sm uppercase tracking-[0.2em] text-slate-400">
                  <Building className="mr-2 h-4 w-4" />
                  Department
                </label>
                <select
                  value={department}
                  onChange={(event) => setDepartment(event.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/80 bg-[url('data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 20 20\'%3E%3Cpath fill=\'rgba(148,163,184,1)\' d=\'M5.25 7.25L10 12l4.75-4.75H5.25z\'/%3E%3C/svg%3E')] bg-no-repeat bg-right-4 bg-center px-4 py-3 pr-10 text-slate-200 outline-none appearance-none transition duration-200 ease-out focus:border-primary-300/80 focus:bg-slate-950/90"
                >
                  <option value="">Select department</option>
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept} className="text-slate-100 bg-slate-950">
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
                <label className="mb-2 flex items-center text-sm uppercase tracking-[0.2em] text-slate-400">
                  <Phone className="mr-2 h-4 w-4" />
                  Phone number
                </label>
                <input
                  type="tel"
                  placeholder="Enter phone number"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-slate-200 outline-none transition focus:border-primary-300/80"
                />
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={isLoading || isSaving}
              whileHover={{ scale: isSaving ? 1 : 1.01 }}
              whileTap={{ scale: isSaving ? 1 : 0.99 }}
              className="inline-flex items-center justify-center rounded-3xl bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-3 text-base font-semibold text-white shadow-[0_18px_50px_rgba(37,99,235,0.35)] transition disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving ? 'Saving profile...' : 'Save and continue'}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default CompleteProfilePage;
