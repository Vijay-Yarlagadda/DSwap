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
      {/* Animated background layers */}
      <div className="pointer-events-none absolute inset-0">
        {/* Primary gradient blob */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_15%,rgba(59,130,246,0.25),transparent_34%),radial-gradient(circle_at_88%_20%,rgba(56,189,248,0.2),transparent_35%),radial-gradient(circle_at_50%_85%,rgba(30,64,175,0.18),transparent_40%)]" />
        
        {/* Enhanced ambient glow layers */}
        <motion.div
          className="absolute top-0 right-1/4 h-72 w-72 rounded-full bg-sky-500/15 blur-[100px]"
          animate={{
            y: [0, 30, -30, 0],
            opacity: [0.3, 0.5, 0.4, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        
        {/* Deep accent glow */}
        <motion.div
          className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-blue-900/20 blur-3xl"
          animate={{
            y: [0, -40, 40, 0],
            opacity: [0.2, 0.4, 0.3, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 0.5,
          }}
        />
        
        {/* Soft vignette effect */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(2,6,23,0.35)_100%)]" />
      </div>
      
      <Navbar onAddListing={() => setIsModalOpen(true)} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease: 'easeOut' }}
        className="relative z-10 mx-auto max-w-7xl px-4 py-6 sm:px-6"
      >
        <motion.div
          className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-b from-slate-900/95 to-slate-950/90 p-5 shadow-[0_30px_80px_rgba(3,9,23,0.45),0_0_40px_rgba(59,130,246,0.08)] backdrop-blur-2xl sm:p-6 transition-all duration-500"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ shadow: '0_30px_80px_rgba(3,9,23,0.55),0_0_50px_rgba(59,130,246,0.12)' }}
        >
          {/* Floating glow effect on hover */}
          <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-sky-500/10 blur-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          
          <motion.p 
            className="mb-3 text-xs uppercase tracking-[0.16em] text-slate-400 font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
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
              className="relative mt-8 flex min-h-[45vh] items-center justify-center overflow-hidden rounded-[2rem] border border-white/15 bg-gradient-to-br from-slate-900/90 via-slate-950/85 to-slate-950/90 p-8 text-center backdrop-blur-2xl shadow-[0_16px_64px_rgba(3,12,39,0.3),0_24px_80px_rgba(6,15,41,0.2)]"
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