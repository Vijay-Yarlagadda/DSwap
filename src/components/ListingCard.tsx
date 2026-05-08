import { MapPin, User, Clock, Phone, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { deleteListing } from '../services/firestoreService.js';
import { motion } from 'framer-motion';

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
}

const ListingCard = ({ listing, onListingDeleted }: ListingCardProps) => {
  const [isDeleting, setIsDeleting] = useState(false);

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
          <motion.h3
            initial={{ opacity: 0.7, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-3xl font-semibold tracking-tight text-white"
          >
            ₹{listing.amount}
          </motion.h3>
          <div className="mt-2 inline-flex items-center rounded-full border border-primary-300/30 bg-primary-500/15 px-3 py-1 text-xs text-primary-100">
            <MapPin className="mr-1 h-3.5 w-3.5" />
            <span>{listing.location}</span>
          </div>
        </div>

        {listing.isOwn && (
          <div className="flex space-x-2">
            <motion.button
              onClick={handleDelete}
              disabled={isDeleting}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="rounded-xl border border-rose-300/30 bg-rose-500/10 p-2 text-rose-300 transition hover:bg-rose-500/20 disabled:opacity-50"
              title="Delete listing"
            >
              <Trash2 className="h-4 w-4" />
            </motion.button>
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