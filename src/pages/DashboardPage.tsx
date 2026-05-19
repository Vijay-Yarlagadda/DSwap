import { useState, useEffect, useCallback } from 'react';
import Navbar from '../components/Navbar';
import FilterChips from '../components/FilterChips';
import ListingCard from '../components/ListingCard';
import AddListingModal from '../components/AddListingModal';
import { useAuth } from '../hooks/useAuth';
import { getListings } from '../services/firestoreService.js';
import { motion, AnimatePresence } from 'framer-motion';

interface Listing {
  id?: string;
  name: string;
  department: string;
  phone: string;
  location: string;
  amount: number;
  userId: string;
  createdAt?: { seconds: number };
  updatedAt?: { seconds: number };
}

interface ListingDisplay extends Listing {
  lastUpdated: string;
  isOwn: boolean;
}

const DashboardPage = () => {
  const { currentUser } = useAuth();
  const [activeFilter, setActiveFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [listings, setListings] = useState<ListingDisplay[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const filters = ['All', 'Block A', 'Block B', 'Block C', 'Library', 'Lakeview', 'Cuisine'];

  const loadListings = useCallback(async () => {
    try {
      setIsLoading(true);
      const firestoreListings = await getListings({
        location: activeFilter === 'All' ? undefined : activeFilter,
      });
      
      const displayListings: ListingDisplay[] = firestoreListings.map((listing) => ({
        ...listing,
        lastUpdated: 'Just now',
        isOwn: listing.userId === currentUser?.uid,
      }));

      setListings(displayListings);
    } catch (error) {
      console.error('Error loading listings:', error);
    } finally {
      setIsLoading(false);
    }
  }, [activeFilter, currentUser?.uid]);

  useEffect(() => {
    loadListings();
  }, [loadListings]);


  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_14%,rgba(56,189,248,0.14),transparent_28%),radial-gradient(circle_at_86%_18%,rgba(59,130,246,0.12),transparent_28%),radial-gradient(circle_at_52%_90%,rgba(15,23,42,0.8),transparent_32%)]" />
        <motion.div
          className="absolute top-0 right-1/4 h-72 w-72 rounded-full bg-sky-500/10 blur-[110px]"
          animate={{ y: [0, 24, -24, 0], opacity: [0.2, 0.45, 0.35, 0.2] }}
          transition={{ duration: 7.5, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-blue-900/25 blur-3xl"
          animate={{ y: [0, -32, 32, 0], opacity: [0.15, 0.35, 0.25, 0.15] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(2,6,23,0.4)_100%)]" />
      </div>

      <Navbar onAddListing={() => setIsModalOpen(true)} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="relative z-10 mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8"
      >


        <motion.div
          className="group relative overflow-visible rounded-[2rem] border border-white/10 bg-gradient-to-b from-slate-900/95 via-slate-950/85 to-slate-950/95 p-5 shadow-[0_30px_90px_rgba(3,9,23,0.45),0_0_40px_rgba(59,130,246,0.08)] backdrop-blur-2xl sm:p-6"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          whileHover={{ boxShadow: '0_30px_90px_rgba(3,9,23,0.55),0_0_50px_rgba(59,130,246,0.12)' }}
        >
          <div className="pointer-events-none absolute -right-14 -top-14 h-40 w-40 rounded-full bg-sky-500/8 blur-3xl opacity-80" />
          <div className="pointer-events-none absolute left-8 top-8 h-24 w-24 rounded-full bg-blue-500/8 blur-2xl opacity-90" />

          <motion.p
            className="mb-4 text-xs uppercase tracking-[0.3em] text-slate-400 font-semibold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.35 }}
          >
            Browse by location
          </motion.p>
          <FilterChips filters={filters} activeFilter={activeFilter} onFilterChange={setActiveFilter} />
        </motion.div>

        {isLoading ? (
          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {[...Array(6)].map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                className="h-52 rounded-3xl border border-white/10 bg-gradient-to-b from-slate-900/60 to-slate-950/40 backdrop-blur-sm overflow-hidden"
              >
                <div className="h-full w-full animate-pulse bg-gradient-to-r from-slate-800/30 to-slate-900/30" />
              </motion.div>
            ))}
          </div>
        ) : listings.length === 0 ? (
          <AnimatePresence>
            <motion.div
              className="relative mt-8 flex min-h-[45vh] items-center justify-center overflow-hidden rounded-[2rem] border border-white/15 bg-gradient-to-br from-slate-900/90 via-slate-950/85 to-slate-950/90 p-6 sm:p-8 text-center backdrop-blur-2xl shadow-[0_16px_64px_rgba(3,12,39,0.3),0_24px_80px_rgba(6,15,41,0.2)]"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              {/* Ambient glow elements */}
              <motion.div
                className="absolute inset-x-0 top-0 mx-auto mt-[-48px] h-24 w-24 rounded-full bg-sky-500/20 blur-3xl"
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
              
              <motion.div
                className="absolute bottom-1/4 right-1/4 h-32 w-32 rounded-full bg-blue-600/15 blur-2xl"
                animate={{
                  y: [0, 20, 0],
                  opacity: [0.1, 0.3, 0.1],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
              
              {/* Content */}
              <motion.div 
                className="relative max-w-xl z-10"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h3 className="text-3xl font-bold tracking-tight text-slate-100 mb-2">No listings available</h3>
                <p className="text-slate-400 text-base leading-relaxed">
                  It looks like there are no listings available in this location. Create a new listing or explore other locations to get started.
                </p>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        ) : (
          <motion.div
            className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.06 } },
            }}
          >
            <AnimatePresence>
              {listings.map((listing) => (
                <ListingCard
                  key={listing.id} 
                  listing={listing}
                  onListingDeleted={loadListings}
                  onListingCompleted={loadListings}
                  onListingEdited={loadListings}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </motion.div>

      <AddListingModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onListingAdded={loadListings}
      />
    </div>
  );
};

export default DashboardPage;