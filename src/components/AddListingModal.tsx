import { useEffect, useState } from 'react';
import { X, MapPin, Phone, AlertCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { addListing, getUserData } from '../services/firestoreService.js';
import { DEPARTMENTS } from '../constants/departments';
import { AnimatePresence, motion } from 'framer-motion';

interface AddListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onListingAdded?: () => void;
}

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

  const locations = ['Block A', 'Block B', 'Block C', 'Library', 'Lakeview', 'Cuisine'];

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
      await addListing(currentUser.uid, {
        name: formData.name,
        department: formData.department,
        phone: formData.phone,
        location: formData.location,
        amount: parseInt(formData.amount),
      });

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

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.98 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="w-full max-w-md overflow-hidden rounded-3xl border border-white/15 bg-slate-900/85 shadow-[0_30px_70px_rgba(2,6,23,0.65)] backdrop-blur-2xl"
        >
          <div className="p-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-white">Add Listing</h2>
                <p className="text-sm text-slate-400">Create a new exchange with premium campus style.</p>
              </div>
              <button onClick={onClose} className="rounded-xl p-2 text-slate-300 transition hover:bg-white/10">
                <X className="h-5 w-5" />
              </button>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 flex items-start gap-2 rounded-xl border border-rose-300/30 bg-rose-500/10 p-3 text-sm text-rose-200"
              >
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {[
                <input
                  key="name"
                  type="text"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-slate-100 outline-none transition-all placeholder:text-slate-400 focus:border-primary-300/70 focus:bg-white/10 focus:shadow-[0_0_0_4px_rgba(59,130,246,0.15)]"
                  required
                />,
                <select
                  key="department"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full appearance-none rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-slate-100 outline-none transition-all focus:border-primary-300/70 focus:bg-white/10 focus:shadow-[0_0_0_4px_rgba(59,130,246,0.15)]"
                  required
                >
                  <option value="" className="text-slate-900">Select Department</option>
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept} className="text-slate-900">
                      {dept}
                    </option>
                  ))}
                </select>,
                <div key="amount" className="relative">
                  <span className="absolute left-3 top-3 font-medium text-primary-200">₹</span>
                  <input
                    type="number"
                    placeholder="Amount"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="w-full rounded-xl border border-white/15 bg-white/5 pl-8 pr-4 py-3 text-slate-100 outline-none transition-all placeholder:text-slate-400 focus:border-primary-300/70 focus:bg-white/10 focus:shadow-[0_0_0_4px_rgba(59,130,246,0.15)]"
                    required
                  />
                </div>,
                <div key="location" className="relative">
                  <MapPin className="absolute left-3 top-3 h-5 w-5 text-primary-200" />
                  <select
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full appearance-none rounded-xl border border-white/15 bg-white/5 pl-10 pr-4 py-3 text-slate-100 outline-none transition-all focus:border-primary-300/70 focus:bg-white/10 focus:shadow-[0_0_0_4px_rgba(59,130,246,0.15)]"
                    required
                  >
                    <option value="" className="text-slate-900">Select Location</option>
                    {locations.map((location) => (
                      <option key={location} value={location} className="text-slate-900">
                        {location}
                      </option>
                    ))}
                  </select>
                </div>,
                <div key="phone" className="relative">
                  <Phone className="absolute left-3 top-3 h-5 w-5 text-primary-200" />
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full rounded-xl border border-white/15 bg-white/5 pl-10 pr-4 py-3 text-slate-100 outline-none transition-all placeholder:text-slate-400 focus:border-primary-300/70 focus:bg-white/10 focus:shadow-[0_0_0_4px_rgba(59,130,246,0.15)]"
                    required
                  />
                </div>,
              ].map((field, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.04 }}
                >
                  {field}
                </motion.div>
              ))}

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isLoading}
                  className="flex-1 rounded-xl border border-white/15 bg-slate-900/70 py-3 font-medium text-slate-200 transition hover:bg-slate-800/80 disabled:opacity-70"
                >
                  Cancel
                </button>
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  whileHover={{ scale: isLoading ? 1 : 1.02, y: isLoading ? 0 : -1 }}
                  whileTap={{ scale: isLoading ? 1 : 0.98 }}
                  className="flex-1 rounded-xl bg-gradient-to-r from-cyan-500 via-sky-500 to-indigo-500 py-3 font-semibold text-white shadow-[0_18px_50px_rgba(59,130,246,0.28)] transition duration-200 disabled:opacity-70 hover:shadow-[0_20px_65px_rgba(59,130,246,0.32)]"
                >
                  {isLoading ? 'Adding...' : 'Add Listing'}
                </motion.button>
              </div>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AddListingModal;