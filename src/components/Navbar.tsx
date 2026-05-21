import { Plus, User, LogOut, ChevronDown } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getUserData } from '../services/firestoreService.js';
import { motion, AnimatePresence } from 'framer-motion';

interface NavbarProps {
  onAddListing?: () => void;
}

const Navbar = ({ onAddListing }: NavbarProps) => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [profileName, setProfileName] = useState<string>('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    const loadProfile = async () => {
      if (!currentUser?.uid) return;
      try {
        const data = await getUserData(currentUser.uid);
        if (!cancelled) {
          setProfileName(data?.name?.trim() || '');
        }
      } catch (error) {
        console.error('Failed to load profile name:', error);
      }
    };
    loadProfile();
    return () => {
      cancelled = true;
    };
  }, [currentUser]);

  const displayName = profileName || currentUser?.displayName || currentUser?.email?.split('@')[0] || 'User';
  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/auth');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <nav className="sticky top-0 z-40 border-b border-white/10 bg-gradient-to-b from-slate-950/95 via-slate-950/80 to-slate-950/70 backdrop-blur-3xl">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-500/25 to-transparent" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-24 items-center justify-between gap-4 py-3">
          <motion.div
            className="flex items-center gap-4"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45 }}
          >
            <Link to="/dashboard" className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-slate-900/80 ring-1 ring-white/10 shadow-[0_12px_50px_rgba(14,165,233,0.12)] backdrop-blur-xl">
                <span className="text-lg font-semibold tracking-tight text-sky-300">D</span>
              </div>
              <div className="space-y-1">
                <p className="text-xl font-semibold tracking-tight text-white">DSwap</p>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Swap smarter</p>
              </div>
            </Link>
          </motion.div>



          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, delay: 0.2 }}
          >
            <motion.button
              onClick={onAddListing}
              whileHover={{ scale: 1.03, y: -1 }}
              whileTap={{ scale: 0.98 }}
              className="group relative inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-500 px-3 sm:px-4 py-2.5 text-sm font-semibold text-white shadow-[0_16px_48px_rgba(56,189,248,0.22)] transition duration-300 hover:shadow-[0_18px_64px_rgba(56,189,248,0.3)]"
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-400/30 via-sky-400/10 to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
              <Plus className="relative h-4 w-4" />
              <span className="relative hidden sm:inline">Add Listing</span>
              <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-slate-800 px-2.5 py-1 text-[11px] font-medium text-white opacity-0 shadow-lg ring-1 ring-white/10 transition-opacity duration-200 group-hover:opacity-100 group-active:opacity-100 sm:hidden pointer-events-none">
                Add Listing
              </span>
            </motion.button>

            <div className="relative" ref={dropdownRef}>
              <motion.button
                onClick={() => setShowDropdown(!showDropdown)}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2.5 rounded-full border border-slate-700/50 bg-slate-800/40 py-1.5 pl-1.5 pr-3.5 text-slate-200 shadow-[0_4px_16px_rgba(0,0,0,0.1)] backdrop-blur-md transition-all duration-300 hover:border-sky-500/30 hover:bg-slate-800/70 hover:shadow-[0_8px_24px_rgba(14,165,233,0.15)]"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-blue-600 text-xs font-bold text-white shadow-inner">
                  {initials || 'U'}
                </div>
                <div className="hidden md:flex flex-col items-start text-left">
                  <span className="text-[13px] font-semibold tracking-wide text-slate-100">{displayName}</span>
                </div>
                <ChevronDown className={`ml-0.5 h-4 w-4 text-slate-400 transition-transform duration-300 ${showDropdown ? 'rotate-180 text-sky-400' : ''}`} />
              </motion.button>

              <AnimatePresence>
                {showDropdown && (
                  <>
                    <motion.button
                      type="button"
                      onClick={() => setShowDropdown(false)}
                      className="fixed inset-0 z-40 bg-transparent"
                      aria-label="Close account menu"
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 12, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 12, scale: 0.95 }}
                      transition={{ duration: 0.2, ease: 'easeOut' }}
                      className="absolute right-0 z-50 mt-2 w-[calc(100vw-2rem)] sm:w-72 max-w-sm overflow-hidden rounded-3xl border border-white/10 bg-slate-950/95 shadow-[0_24px_80px_rgba(0,0,0,0.55)] backdrop-blur-3xl"
                    >
                      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-500/20 to-transparent" />
                      <div className="border-b border-white/10 px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900/80 text-sm font-semibold text-sky-300 ring-1 ring-white/10">
                            {initials || 'U'}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-100 truncate max-w-[220px]">{displayName}</p>
                            <p className="text-xs text-slate-500 truncate max-w-[220px]">{currentUser?.email}</p>
                          </div>
                        </div>
                      </div>
                      <div className="py-2">
                        <Link
                          to="/profile"
                          className="flex items-center gap-3 px-5 py-3 text-sm text-slate-200 transition duration-200 hover:bg-sky-500/10 hover:text-sky-100"
                          onClick={() => setShowDropdown(false)}
                        >
                          <User className="h-4 w-4 text-sky-300" />
                          My Profile
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="flex w-full items-center gap-3 px-5 py-3 text-sm font-medium text-rose-300 transition duration-200 hover:bg-rose-500/10 hover:text-rose-200"
                        >
                          <LogOut className="h-4 w-4 text-rose-300" />
                          Logout
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
