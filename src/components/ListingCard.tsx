import { MapPin, User, Clock, Phone, Trash2, MoreVertical, Edit, CheckCircle } from 'lucide-react';
import { useState } from 'react';
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

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this listing?')) {
      setIsDeleting(true);
      try {
        if (listing.id) {
          await deleteListing(listing.id);
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="group relative overflow-hidden rounded-3xl border border-white/15 bg-white/[0.07] p-6 shadow-[0_20px_45px_rgba(2,6,23,0.45)] backdrop-blur-xl"
    >
      <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-primary-500/15 blur-3xl transition-opacity duration-300 group-hover:opacity-100" />
      <div className="flex justify-between items-start mb-4">
        <div>
          {isEditing ? (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-semibold text-white">₹</span>
                <input
                  type="number"
                  value={editAmount}
                  onChange={(e) => setEditAmount(e.target.value)}
                  className="w-24 rounded-lg border border-white/20 bg-white/10 px-2 py-1 text-xl font-semibold text-white outline-none focus:border-primary-300/70 focus:bg-white/15"
                  placeholder="Amount"
                  min="1"
                  step="0.01"
                />
              </div>
              <div className="flex space-x-2">
                <motion.button
                  onClick={handleSaveEdit}
                  disabled={isUpdating}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="rounded-lg bg-primary-600 px-3 py-1 text-sm text-white transition hover:bg-primary-500 disabled:opacity-50"
                >
                  {isUpdating ? 'Saving...' : 'Save'}
                </motion.button>
                <motion.button
                  onClick={handleCancelEdit}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="rounded-lg border border-white/20 bg-white/5 px-3 py-1 text-sm text-slate-300 transition hover:bg-white/10"
                >
                  Cancel
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <motion.h3
              initial={{ opacity: 0.7, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-3xl font-semibold tracking-tight text-white"
            >
              ₹{listing.amount}
            </motion.h3>
          )}
          <div className="mt-2 inline-flex items-center rounded-full border border-primary-300/30 bg-primary-500/15 px-3 py-1 text-xs text-primary-100">
            <MapPin className="mr-1 h-3.5 w-3.5" />
            <span>{listing.location}</span>
          </div>
        </div>

        {listing.isOwn && (
          <div className="relative">
            <motion.button
              onClick={() => setShowMenu(!showMenu)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="rounded-xl border border-white/20 bg-white/5 p-2 text-slate-300 transition hover:bg-white/10"
              title="More options"
            >
              <MoreVertical className="h-4 w-4" />
            </motion.button>

            <AnimatePresence>
              {showMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.98 }}
                  className="absolute right-0 top-12 z-50 w-48 overflow-hidden rounded-xl border border-white/15 bg-slate-900/95 shadow-[0_20px_60px_rgba(2,6,23,0.6)] backdrop-blur-2xl"
                >
                  <div className="py-1">
                    <button
                      onClick={handleEdit}
                      className="flex w-full items-center px-4 py-2 text-sm text-slate-200 transition hover:bg-white/10"
                    >
                      <Edit className="mr-3 h-4 w-4" />
                      Edit
                    </button>
                    <button
                      onClick={handleComplete}
                      disabled={isCompleting}
                      className="flex w-full items-center px-4 py-2 text-sm text-emerald-300 transition hover:bg-emerald-500/20 disabled:opacity-50"
                    >
                      <CheckCircle className="mr-3 h-4 w-4" />
                      {isCompleting ? 'Completing...' : 'DSwap Done'}
                    </button>
                    <button
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className="flex w-full items-center px-4 py-2 text-sm text-rose-300 transition hover:bg-rose-500/20 disabled:opacity-50"
                    >
                      <Trash2 className="mr-3 h-4 w-4" />
                      Delete
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-slate-100">
          <User className="mr-2 h-4 w-4 text-slate-300" />
          <span className="font-medium">{listing.name}</span>
        </div>
        <p className="text-sm text-slate-300">{listing.department}</p>
        <div className="flex items-center text-sm text-slate-400">
          <Clock className="mr-1 h-4 w-4" />
          <span>Updated {listing.lastUpdated}</span>
        </div>
      </div>

      <motion.button
        onClick={handleContact}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        className="flex w-full items-center justify-center space-x-2 rounded-xl border border-primary-300/40 bg-gradient-to-r from-primary-500/85 to-primary-600/85 py-3 font-medium text-white transition"
      >
        <Phone className="h-4 w-4" />
        <span>Contact {listing.phone}</span>
      </motion.button>
    </motion.div>
  );
};

export default ListingCard;