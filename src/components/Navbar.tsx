import { Search, Plus, User, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';

interface NavbarProps {
  onAddListing?: () => void;
}

const Navbar = ({ onAddListing }: NavbarProps) => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/auth');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <nav className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-24 items-center justify-between gap-4 py-3">
          <div className="flex items-center gap-3">
            <Link to="/dashboard" className="text-2xl font-semibold tracking-tight text-white">
              DSwap
            </Link>
          </div>

          <div className="hidden flex-1 max-w-2xl md:block">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Search listings..."
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
                className="w-full rounded-2xl border border-white/15 bg-slate-900/80 py-3 pl-11 pr-4 text-sm text-slate-100 outline-none transition duration-300 placeholder:text-slate-500 focus:border-sky-400/70 focus:bg-slate-950/90 focus:ring-2 focus:ring-sky-500/20"
              />
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <motion.button
              onClick={onAddListing}
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center space-x-2 rounded-2xl bg-gradient-to-r from-cyan-500 via-sky-500 to-indigo-500 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_18px_60px_rgba(59,130,246,0.24)] transition duration-200 hover:shadow-[0_20px_70px_rgba(59,130,246,0.3)]"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Add Listing</span>
            </motion.button>

            <div className="relative">
              <motion.button
                onClick={() => setShowDropdown(!showDropdown)}
                whileTap={{ scale: 0.95 }}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/5 text-slate-100 transition hover:bg-white/10"
              >
                <User className="h-4 w-4" />
              </motion.button>

              <AnimatePresence>
                {showDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    className="absolute right-0 mt-2 w-64 overflow-hidden rounded-2xl border border-white/15 bg-slate-900/90 shadow-[0_20px_60px_rgba(2,6,23,0.6)] backdrop-blur-2xl z-50"
                  >
                    <div className="border-b border-white/10 px-4 py-3">
                      <p className="text-sm font-medium text-slate-100">
                        {currentUser?.displayName || currentUser?.email || 'User'}
                      </p>
                      <p className="text-xs text-slate-400">{currentUser?.email}</p>
                    </div>
                    <Link
                      to="/profile"
                      className="block px-4 py-2.5 text-sm text-slate-200 transition hover:bg-white/10"
                      onClick={() => setShowDropdown(false)}
                    >
                      <User className="mr-2 inline h-4 w-4" />
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2.5 text-left text-sm text-rose-300 transition hover:bg-rose-500/20"
                    >
                      <LogOut className="mr-2 inline h-4 w-4" />
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
        <div className="pb-4 md:hidden">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search listings..."
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              className="w-full rounded-2xl border border-white/15 bg-slate-900/80 py-3 pl-11 pr-4 text-sm text-slate-100 outline-none transition duration-300 placeholder:text-slate-500 focus:border-sky-400/70 focus:bg-slate-950/90 focus:ring-2 focus:ring-sky-500/20"
            />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;