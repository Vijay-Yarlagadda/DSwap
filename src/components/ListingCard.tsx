import { User, Clock, Phone, Trash2, MoreVertical, Edit, CheckCircle } from 'lucide-react';
import { useState, useRef, useEffect, memo } from 'react';
import { deleteListing, completeListing, updateListingAmount } from '../services/firestoreService.js';
import { motion } from 'framer-motion';
import ContactModal from './ContactModal';

const LOCATION_STYLE_MAP: Record<string, { dot: string; badge: string }> = {
  'Block A': {
    dot: 'bg-cyan-400 shadow-[0_0_10px_rgba(56,189,248,0.35)]',
    badge: 'border-cyan-400/20 text-cyan-100',
  },
  'Block B': {
    dot: 'bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.35)]',
    badge: 'border-emerald-400/20 text-emerald-100',
  },
  'Block C': {
    dot: 'bg-indigo-400 shadow-[0_0_10px_rgba(99,102,241,0.35)]',
    badge: 'border-indigo-400/20 text-indigo-100',
  },
  Library: {
    dot: 'bg-fuchsia-400 shadow-[0_0_10px_rgba(232,121,249,0.35)]',
    badge: 'border-fuchsia-400/20 text-fuchsia-100',
  },
  Lakeview: {
    dot: 'bg-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.35)]',
    badge: 'border-amber-400/20 text-amber-100',
  },
  Cuisine: {
    dot: 'bg-rose-400 shadow-[0_0_10px_rgba(251,113,133,0.35)]',
    badge: 'border-rose-400/20 text-rose-100',
  },
  Red: {
    dot: 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.35)]',
    badge: 'border-red-500/20 text-red-100',
  },
  Yellow: {
    dot: 'bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.35)]',
    badge: 'border-yellow-400/20 text-yellow-100',
  },
  Green: {
    dot: 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.35)]',
    badge: 'border-green-500/20 text-green-100',
  },
};

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
  colorOverride?: { dot: string; badge: string } | null;
}

const STORAGE_KEY = 'dswap_recent_activity';

const ListingCard = ({ listing, onListingDeleted, onListingCompleted, onListingEdited, colorOverride }: ListingCardProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editAmount, setEditAmount] = useState(listing.amount.toString());
  const [isUpdating, setIsUpdating] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const saveDeletedActivity = () => {
    if (!listing.id) return;

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const existing = raw ? JSON.parse(raw) : [];
      const activity = {
        id: `deleted-${listing.id}-${Date.now()}`,
        type: 'deleted',
        title: 'Deleted listing',
        description: `${listing.amount} ₹ • ${listing.location}`,
        timestamp: Math.floor(Date.now() / 1000),
      };
      const next = [activity, ...(Array.isArray(existing) ? existing : [])].slice(0, 8);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch (err) {
      console.error('Failed to save deleted activity', err);
    }
  };

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
          saveDeletedActivity();
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
      setShowContactModal(true);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-slate-950/95 via-slate-900/90 to-slate-950/90 p-5 sm:p-6 shadow-[0_14px_36px_rgba(3,12,39,0.22),0_16px_40px_rgba(14,165,233,0.12)] ring-1 ring-white/10 backdrop-blur-xl transition-transform duration-200 hover:-translate-y-1"
    >
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-sky-500/12 blur-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-80" />
      <div className="pointer-events-none absolute inset-0 rounded-[2rem] bg-gradient-to-t from-transparent via-transparent to-white/5" />
      <div className="pointer-events-none absolute -bottom-12 -right-12 h-32 w-32 rounded-full bg-indigo-600/10 blur-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-80" />

      <div className="relative z-50 flex justify-between items-center mb-4">
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <div className="space-y-3">
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
                <button
                  onClick={handleSaveEdit}
                  disabled={isUpdating}
                  className="rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-4 py-2 text-sm font-semibold text-white shadow-[0_10px_26px_rgba(16,185,129,0.16)] transition duration-200 hover:shadow-[0_12px_32px_rgba(16,185,129,0.22)] disabled:opacity-50"
                >
                  {isUpdating ? 'Saving...' : 'Save'}
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="rounded-2xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-300 transition duration-200 hover:bg-white/15 hover:border-white/20"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <h3 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                  <span className="bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-400 bg-clip-text text-transparent">₹</span>{listing.amount}
                </h3>
              </div>
              {(() => {
                const style = colorOverride ?? LOCATION_STYLE_MAP[listing.location];
                const badgeClass = style?.badge ?? 'border-sky-400/20 text-sky-100 bg-sky-950/40';
                const dotClass = style?.dot ?? 'bg-sky-400 shadow-[0_0_10px_rgba(56,189,248,0.35)]';
                return (
                  <div className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold shadow-[0_0_16px_rgba(0,0,0,0.12)] backdrop-blur-sm leading-none ${badgeClass}`}>
                    <span className={`flex h-1.5 w-1.5 rounded-full ${dotClass} animate-pulse`} />
                    <span className="tracking-wide uppercase">{listing.location}</span>
                  </div>
                );
              })()}
            </div>
          )}
        </div>

        {listing.isOwn && (
          <div className="relative z-20" ref={menuRef}>
            <motion.button
              type="button"
              onClick={() => setShowMenu(!showMenu)}
              initial={{ rotate: 0, scale: 1 }}
              whileHover={{ rotate: 180, scale: 1.06 }}
              whileTap={{ rotate: 0, scale: 0.96 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="transform-gpu flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-slate-900/85 text-slate-300 transition duration-200 hover:border-sky-400/30 hover:bg-slate-900/95 shadow-[0_6px_18px_rgba(3,12,39,0.18)]"
              title="More options"
              aria-label="More options"
            >
              <MoreVertical className="h-3.5 w-3.5" />
            </motion.button>
            {showMenu && (
              <div className="absolute right-0 top-14 z-50 w-44 overflow-hidden rounded-2xl border border-white/10 bg-slate-900/95 shadow-xl backdrop-blur-xl pointer-events-auto">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-500/20 to-transparent" />
                <div className="py-1 space-y-0.5">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit();
                    }}
                    className="flex w-full items-center px-3.5 py-2.5 text-sm font-medium text-slate-200 transition duration-150 hover:bg-sky-500/10"
                  >
                    <Edit className="mr-2.5 h-3.5 w-3.5 text-sky-300" />
                    Edit Amount
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleComplete();
                    }}
                    disabled={isCompleting}
                    className="flex w-full items-center px-3.5 py-2.5 text-sm font-medium text-emerald-200 transition duration-150 disabled:opacity-50 hover:text-emerald-100 hover:bg-emerald-500/15"
                  >
                    <CheckCircle className="mr-2.5 h-3.5 w-3.5 text-emerald-400" />
                    {isCompleting ? 'Completing...' : 'DSwap Done'}
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete();
                    }}
                    disabled={isDeleting}
                    className="flex w-full items-center px-3.5 py-2.5 text-sm font-medium text-rose-200 transition duration-150 disabled:opacity-50 hover:text-rose-100 hover:bg-rose-500/15"
                  >
                    <Trash2 className="mr-2.5 h-3.5 w-3.5 text-rose-300" />
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="relative z-10 space-y-3 mb-6 pb-4 border-b border-white/10">
        <div className="flex items-center text-slate-100 font-medium">
          <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-3xl bg-slate-900/80 text-sky-300 shadow-[0_10px_24px_rgba(56,189,248,0.1)]">
            <User className="h-4 w-4" />
          </div>
          <span>{listing.name}</span>
        </div>
        <p className="text-sm text-slate-400 pl-14 font-medium">{listing.department}</p>
        <div className="flex items-center text-xs text-slate-500 pl-14">
          <Clock className="mr-1.5 h-3 w-3" />
          <span>Updated {listing.lastUpdated}</span>
        </div>
      </div>

      <div className="relative">
        <button
          onClick={handleContact}
          className="group relative w-full flex items-center justify-center gap-2 overflow-hidden rounded-2xl border border-sky-400/40 bg-gradient-to-r from-sky-500/20 via-cyan-500/10 to-blue-500/15 px-5 py-3.5 text-sm font-semibold text-sky-100 shadow-[0_10px_30px_rgba(14,165,233,0.16),inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-sm transition duration-200 hover:border-sky-400/60 hover:bg-gradient-to-r hover:from-sky-500/30 hover:via-cyan-500/20 hover:to-blue-500/25 hover:shadow-[0_14px_36px_rgba(14,165,233,0.22)]"
        >
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-400/25 via-sky-400/15 to-transparent opacity-0 transition duration-200 group-hover:opacity-100" />
          <Phone className="h-5 w-5 relative text-sky-200" />
          <span className="relative">Contact {listing.phone}</span>
        </button>
      </div>

      <ContactModal
        isOpen={showContactModal}
        onClose={() => setShowContactModal(false)}
        phone={listing.phone}
        name={listing.name}
      />
    </motion.div>
  );
};

export default memo(ListingCard);
