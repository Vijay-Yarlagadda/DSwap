import { User, Clock, Phone, Trash2, MoreVertical, Edit, CheckCircle } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { deleteListing, completeListing, updateListingAmount } from '../services/firestoreService.js';
import { motion, AnimatePresence } from 'framer-motion';

interface Listing {
  id?: string;
  amount: number;
  location: string;
  name: string;
  department: string;
  phone: string;
  lastUpdated: string;
  isOwn: boolean;
}

interface ListingCardProps {
  listing: Listing;
  onListingDeleted?: () => void;
  onListingCompleted?: () => void;
  onListingEdited?: () => void;
}

const ListingCard = ({ listing, onListingDeleted, onListingCompleted, onListingEdited }: ListingCardProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editAmount, setEditAmount] = useState(listing.amount.toString());
  const [isUpdating, setIsUpdating] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showMenu]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this listing?')) {
      setIsDeleting(true);
      try {
        if (listing.id) {
          await deleteListing(listing.id);
          setShowMenu(false);
          onListingDeleted?.();
        }
      } catch (error) {
        console.error('Error deleting listing:', error);
        alert('Failed to delete listing');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleComplete = async () => {
    if (window.confirm('Are you sure you want to complete this exchange? This will mark it as completed.')) {
      setIsCompleting(true);
      try {
        if (listing.id) {
          await completeListing(listing.id);
          setShowMenu(false);
          onListingCompleted?.();
        }
      } catch (error) {
        console.error('Error completing listing:', error);
        alert('Failed to complete listing');
      } finally {
        setIsCompleting(false);
      }
    }
  };

  const handleEdit = () => {
    setEditAmount(listing.amount.toString());
    setIsEditing(true);
    setShowMenu(false);
  };

  const handleSaveEdit = async () => {
    const newAmount = parseFloat(editAmount);
    if (isNaN(newAmount) || newAmount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    setIsUpdating(true);
    try {
      if (listing.id) {
        await updateListingAmount(listing.id, newAmount);
        onListingEdited?.();
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error updating listing:', error);
      alert('Failed to update listing');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditAmount(listing.amount.toString());
  };

  const handleContact = () => {
    if (listing.phone) {
      window.location.href = `tel:${listing.phone}`;
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      whileHover={{ y: -6, scale: 1.015 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-slate-950/95 via-slate-900/90 to-slate-950/90 p-6 shadow-[0_18px_50px_rgba(3,12,39,0.28),0_24px_80px_rgba(14,165,233,0.15)] ring-1 ring-white/10 backdrop-blur-xl transition-all duration-300"
    >
      <motion.div
        className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-sky-500/12 blur-3xl opacity-0 transition-all duration-300 group-hover:opacity-100"
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 2.5, repeat: Infinity, repeatType: 'reverse' }}
      />
      <div className="pointer-events-none absolute inset-0 rounded-[2rem] bg-gradient-to-t from-transparent via-transparent to-white/5" />
      <motion.div
        className="pointer-events-none absolute -bottom-12 -right-12 h-32 w-32 rounded-full bg-indigo-600/10 blur-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />

      <div className="relative z-10 flex justify-between items-start mb-4">
        <div className="flex-1">
          {isEditing ? (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-sky-400 bg-clip-text text-transparent">₹</span>
                <input
                  type="number"
                  value={editAmount}
                  onChange={(e) => setEditAmount(e.target.value)}
                  className="w-28 rounded-2xl border border-sky-400/30 bg-white/10 px-3 py-2 text-xl font-semibold text-white outline-none backdrop-blur-sm transition focus:border-sky-400/60 focus:bg-white/20 focus:ring-2 focus:ring-sky-500/30"
                  placeholder="Amount"
                  min="1"
                  step="0.01"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <motion.button
                  onClick={handleSaveEdit}
                  disabled={isUpdating}
                  whileHover={{ scale: 1.05, y: -1 }}
                  whileTap={{ scale: 0.95 }}
                  className="rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-4 py-2 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(16,185,129,0.2)] transition hover:shadow-[0_12px_34px_rgba(16,185,129,0.28)] disabled:opacity-50"
                >
                  {isUpdating ? 'Saving...' : 'Save'}
                </motion.button>
                <motion.button
                  onClick={handleCancelEdit}
                  whileHover={{ scale: 1.05, y: -1 }}
                  whileTap={{ scale: 0.95 }}
                  className="rounded-2xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:bg-white/15 hover:border-white/20"
                >
                  Cancel
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08, duration: 0.25 }}
              >
                <h3 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                  <span className="bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-400 bg-clip-text text-transparent">₹</span>{listing.amount}
                </h3>
              </motion.div>
              <motion.div
                className="inline-flex items-center gap-2 rounded-full border border-sky-400/15 bg-slate-950/70 px-3 py-1.5 text-xs font-semibold text-slate-200 shadow-[0_12px_30px_rgba(56,189,248,0.14)] backdrop-blur-sm"
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.15, duration: 0.25 }}
              >
                <span className="flex h-2.5 w-2.5 items-center justify-center rounded-full bg-sky-300 shadow-[0_0_16px_rgba(56,189,248,0.25)]" />
                <span>{listing.location}</span>
              </motion.div>
            </div>
          )}
        </div>

        {listing.isOwn && (
          <div className="relative z-20" ref={menuRef}>
            <motion.button
              onClick={() => setShowMenu(!showMenu)}
              whileHover={{ scale: 1.08, rotate: 90 }}
              whileTap={{ scale: 0.92 }}
              transition={{ duration: 0.12 }}
              className="rounded-3xl border border-white/10 bg-slate-900/85 p-2.5 text-slate-300 transition hover:border-sky-400/30 hover:bg-slate-900/95 shadow-[0_8px_24px_rgba(3,12,39,0.25)]"
              title="More options"
            >
              <MoreVertical className="h-4 w-4" />
            </motion.button>
            <AnimatePresence>
              {showMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 12, scale: 0.94 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 12, scale: 0.94 }}
                  transition={{ duration: 0.15, ease: 'easeOut' }}
                  className="absolute right-0 top-14 z-50 w-56 overflow-hidden rounded-3xl border border-white/15 bg-slate-950/95 shadow-[0_24px_80px_rgba(2,6,23,0.65)] backdrop-blur-3xl"
                >
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-500/20 to-transparent" />
                  <div className="py-1 space-y-0.5">
                    <motion.button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit();
                      }}
                      whileHover={{ x: 4 }}
                      transition={{ duration: 0.15 }}
                      className="flex w-full items-center px-4 py-3 text-sm font-medium text-slate-200 transition duration-150 hover:bg-sky-500/10 cursor-pointer"
                    >
                      <Edit className="mr-3 h-4 w-4 text-sky-300" />
                      Edit Amount
                    </motion.button>
                    <motion.button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleComplete();
                      }}
                      disabled={isCompleting}
                      whileHover={!isCompleting ? { x: 4, backgroundColor: 'rgba(16,185,129,0.15)' } : {}}
                      whileTap={!isCompleting ? { scale: 0.98 } : {}}
                      transition={{ duration: 0.15 }}
                      className="flex w-full items-center px-4 py-3 text-sm font-medium text-emerald-200 transition duration-150 disabled:opacity-50 hover:text-emerald-100 cursor-pointer"
                    >
                      <CheckCircle className="mr-3 h-4 w-4 text-emerald-400" />
                      {isCompleting ? 'Completing...' : 'DSwap Done'}
                    </motion.button>
                    <motion.button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete();
                      }}
                      disabled={isDeleting}
                      whileHover={!isDeleting ? { x: 4, backgroundColor: 'rgba(239,68,68,0.15)' } : {}}
                      whileTap={!isDeleting ? { scale: 0.98 } : {}}
                      transition={{ duration: 0.15 }}
                      className="flex w-full items-center px-4 py-3 text-sm font-medium text-rose-200 transition duration-150 disabled:opacity-50 hover:text-rose-100 cursor-pointer"
                    >
                      <Trash2 className="mr-3 h-4 w-4 text-rose-300" />
                      Delete
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      <motion.div
        className="relative z-10 space-y-3 mb-6 pb-4 border-b border-white/10"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12, duration: 0.25 }}
      >
        <div className="flex items-center text-slate-100 font-medium">
          <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-3xl bg-slate-900/80 text-sky-300 shadow-[0_12px_30px_rgba(56,189,248,0.12)]">
            <User className="h-4 w-4" />
          </div>
          <span>{listing.name}</span>
        </div>
        <p className="text-sm text-slate-400 pl-14 font-medium">{listing.department}</p>
        <div className="flex items-center text-xs text-slate-500 pl-14">
          <Clock className="mr-1.5 h-3 w-3" />
          <span>Updated {listing.lastUpdated}</span>
        </div>
      </motion.div>

      <motion.div
        whileHover={{ scale: 1.02, y: -2 }}
        transition={{ duration: 0.2 }}
        className="relative"
      >
        <motion.button
          onClick={handleContact}
          whileTap={{ scale: 0.96 }}
          className="group relative w-full flex items-center justify-center gap-2 overflow-hidden rounded-2xl border border-sky-400/40 bg-gradient-to-r from-sky-500/20 via-cyan-500/10 to-blue-500/15 px-5 py-3.5 text-sm font-semibold text-sky-100 shadow-[0_12px_40px_rgba(14,165,233,0.2),inset_0_1px_0_rgba(255,255,255,0.15)] backdrop-blur-sm transition duration-300 hover:border-sky-400/60 hover:bg-gradient-to-r hover:from-sky-500/30 hover:via-cyan-500/20 hover:to-blue-500/25 hover:shadow-[0_16px_48px_rgba(14,165,233,0.35)]"
        >
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-400/25 via-sky-400/15 to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
          <Phone className="h-5 w-5 relative text-sky-200" />
          <span className="relative">Contact {listing.phone}</span>
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default ListingCard;