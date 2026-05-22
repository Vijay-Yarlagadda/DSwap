import { useEffect, useState } from 'react';
import { X, MapPin, Phone, AlertCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { addListing, addActivity, getUserData } from '../services/firestoreService.js';
import { DEPARTMENTS } from '../constants/departments';
import { AnimatePresence, motion } from 'framer-motion';

interface AddListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onListingAdded?: () => void;
}

const LOCATION_OPTIONS = ['Block A', 'Block B', 'Block C', 'Library', 'Lakeview', 'Cuisine'] as const;

const STORAGE_KEY = 'dswap_recent_activity';

const AddListingModal = ({ isOpen, onClose, onListingAdded }: AddListingModalProps) => {
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState({
    amount: '',
    location: '',
    phone: '',
    name: '',
    department: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const autoFillUserData = async () => {
      if (!isOpen || !currentUser) {
        return;
      }

      try {
        const userData = await getUserData(currentUser.uid);
        if (!userData) {
          return;
        }

        setFormData((current) => ({
          ...current,
          name: current.name || userData.name || '',
          department: current.department || userData.department || '',
          phone: current.phone || userData.phone || '',
        }));
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load your profile details';
        setError(errorMessage);
      }
    };

    autoFillUserData();
  }, [isOpen, currentUser]);

  const saveCreatedActivity = async (listingId: string) => {
    if (!listingId || !currentUser) return;

    const activity = {
      id: `created-${listingId}-${Date.now()}`,
      type: 'created',
      title: 'Listing created',
      description: `${parseInt(formData.amount)} ₹ • ${formData.location}`,
      timestamp: Math.floor(Date.now() / 1000),
    };

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const existing = raw ? JSON.parse(raw) : [];
      const next = [activity, ...(Array.isArray(existing) ? existing : [])].slice(0, 8);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      await addActivity(currentUser.uid, activity);
    } catch (error) {
      console.error('Failed to save created activity:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!currentUser) {
      setError('You must be logged in to add a listing');
      return;
    }

    if (!formData.amount || !formData.location || !formData.phone || !formData.name || !formData.department) {
      setError('Please fill in all required fields');
      return;
    }

    setIsLoading(true);

    try {
      const listingId = await addListing(currentUser.uid, {
        name: formData.name,
        department: formData.department,
        phone: formData.phone,
        location: formData.location,
        amount: parseInt(formData.amount),
      });

      await saveCreatedActivity(listingId);

      setFormData({
        amount: '',
        location: '',
        phone: '',
        name: '',
        department: '',
      });

      onListingAdded?.();
      onClose();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add listing';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.95 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-br from-slate-900/95 via-slate-900/90 to-slate-950/95 shadow-[0_24px_96px_rgba(3,12,39,0.5),0_8px_32px_rgba(59,130,246,0.1)] backdrop-blur-2xl max-h-[90vh] overflow-y-auto no-scrollbar"
          >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-500/20 to-transparent" />
            <div className="p-6 sm:p-8">
              <motion.div
                className="mb-6 flex items-center justify-between"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-white">Add Listing</h2>
                  <p className="text-sm text-slate-400 mt-1">Create a new exchange with DSwap.</p>
                </div>
                <motion.button
                  type="button"
                  onClick={onClose}
                  aria-label="Close add listing modal"
                  whileHover={{ scale: 1.05, rotate: 90, transition: { duration: 0.12, ease: 'easeOut' } }}
                  whileTap={{ scale: 0.92 }}
                  className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-800 hover:text-slate-200"
                >
                  <X className="h-5 w-5 text-slate-300" strokeWidth={1.5} />
                </motion.button>
              </motion.div>

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="mb-4 flex items-start gap-2 rounded-xl border border-rose-400/30 bg-gradient-to-r from-rose-500/10 to-rose-600/5 p-3 text-sm text-rose-200 backdrop-blur-sm"
                  >
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-400" />
                    <span>{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSubmit} className="space-y-4">
                {[
                  <motion.input
                    key="name"
                    type="text"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-base text-slate-100 outline-none transition-all placeholder:text-slate-400 focus:border-sky-400/50 focus:bg-white/10 focus:ring-2 focus:ring-sky-500/25 hover:border-white/20"
                    required
                  />,
                  <motion.select
                    key="department"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full appearance-none rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-base text-slate-100 outline-none transition-all focus:border-sky-400/50 focus:bg-white/10 focus:ring-2 focus:ring-sky-500/25 hover:border-white/20"
                    required
                  >
                    <option value="" className="text-slate-900">Select Department</option>
                    {DEPARTMENTS.map((dept) => (
                      <option key={dept} value={dept} className="text-slate-900">
                        {dept}
                      </option>
                    ))}
                  </motion.select>,
                  <div key="amount" className="relative">
                    <span className="absolute left-4 top-3 text-slate-400 font-semibold text-lg">₹</span>
                    <motion.input
                      type="number"
                      placeholder="Amount"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      className="w-full rounded-xl border border-white/15 bg-white/5 pl-11 pr-4 py-3 text-base text-slate-100 outline-none transition-all placeholder:text-slate-400 focus:border-sky-400/50 focus:bg-white/10 focus:ring-2 focus:ring-sky-500/25 hover:border-white/20"
                      required
                    />
                  </div>,
                  <div key="location" className="relative">
                    <MapPin className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" strokeWidth={1.5} />
                    <motion.select
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full appearance-none rounded-xl border border-white/15 bg-white/5 pl-12 pr-4 py-3 text-base text-slate-100 outline-none transition-all focus:border-sky-400/50 focus:bg-white/10 focus:ring-2 focus:ring-sky-500/25 hover:border-white/20"
                      required
                    >
                      <option value="" className="text-slate-900">Select Location</option>
                      {LOCATION_OPTIONS.map((location) => (
                        <option key={location} value={location} className="text-slate-900">
                          {location}
                        </option>
                      ))}
                    </motion.select>
                  </div>,
                  <div key="phone" className="relative">
                    <Phone className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" strokeWidth={1.5} />
                    <motion.input
                      type="tel"
                      placeholder="Phone Number"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full rounded-xl border border-white/15 bg-white/5 pl-12 pr-4 py-3 text-base text-slate-100 outline-none transition-all placeholder:text-slate-400 focus:border-sky-400/50 focus:bg-white/10 focus:ring-2 focus:ring-sky-500/25 hover:border-white/20"
                      required
                    />
                  </div>,
                ].map((field, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    {field}
                  </motion.div>
                ))}

                <div className="flex space-x-3 pt-6">
                  <motion.button
                    type="button"
                    onClick={onClose}
                    disabled={isLoading}
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex-1 rounded-xl border border-white/15 bg-slate-900/50 backdrop-blur-sm py-3 font-semibold text-slate-200 transition duration-200 hover:bg-slate-800/70 hover:border-white/25 disabled:opacity-50"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    whileHover={{ scale: isLoading ? 1 : 1.04, y: isLoading ? 0 : -2 }}
                    whileTap={{ scale: isLoading ? 1 : 0.96 }}
                    className="relative flex-1 rounded-xl bg-gradient-to-r from-cyan-500 via-sky-500 to-indigo-500 py-3 font-semibold text-white shadow-[0_12px_48px_rgba(59,130,246,0.3)] transition duration-300 disabled:opacity-50 overflow-hidden group"
                  >
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-400/0 via-sky-400/20 to-indigo-400/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    <span className="relative">{isLoading ? 'Adding...' : 'Add Listing'}</span>
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};

export default AddListingModal;