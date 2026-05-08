import { useState, useEffect } from 'react';
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

  useEffect(() => {
    loadListings();
  }, [currentUser, activeFilter]);

  const loadListings = async () => {
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
  };

  const handleListingAdded = () => {
    loadListings();
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_15%,rgba(59,130,246,0.22),transparent_34%),radial-gradient(circle_at_88%_20%,rgba(56,189,248,0.18),transparent_35%),radial-gradient(circle_at_50%_85%,rgba(30,64,175,0.16),transparent_40%)]" />
      <Navbar onAddListing={() => setIsModalOpen(true)} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease: 'easeOut' }}
        className="relative z-10 mx-auto max-w-7xl px-4 py-6 sm:px-6"
      >
        <motion.div
          className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-5 shadow-[0_30px_80px_rgba(3,9,23,0.45)] backdrop-blur-2xl sm:p-6"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="mb-3 text-xs uppercase tracking-[0.16em] text-slate-400">Browse by location</p>
          <FilterChips filters={filters} activeFilter={activeFilter} onFilterChange={setActiveFilter} />
        </motion.div>

        {isLoading ? (
          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="h-52 animate-pulse rounded-3xl border border-white/10 bg-white/[0.06]" />
            ))}
          </div>
        ) : listings.length === 0 ? (
          <AnimatePresence>
            <motion.div
              className="relative mt-8 flex min-h-[45vh] items-center justify-center rounded-[2rem] border border-white/10 bg-slate-950/80 p-8 text-center backdrop-blur-2xl shadow-[0_24px_64px_rgba(2,6,23,0.5)]"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              <motion.div
                className="absolute inset-x-0 top-0 mx-auto mt-[-48px] h-24 w-24 rounded-full bg-primary-500/15 blur-3xl"
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
              <div className="relative max-w-xl">
                <h3 className="text-2xl font-semibold text-slate-100">No valid listings available</h3>
                <p className="mt-3 text-slate-400">
                  It looks like there are no properly completed listings yet. Create a new listing to get started.
                </p>
              </div>
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
            {listings.map((listing) => (
              <ListingCard
                key={listing.id} 
                listing={listing}
                onListingDeleted={handleListingAdded}
                onListingCompleted={handleListingAdded}
                onListingEdited={handleListingAdded}
              />
            ))}
          </motion.div>
        )}
      </motion.div>

      <AddListingModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onListingAdded={handleListingAdded}
      />
    </div>
  );
};

export default DashboardPage;