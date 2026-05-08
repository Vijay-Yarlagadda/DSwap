import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import FilterChips from '../components/FilterChips';
import ListingCard from '../components/ListingCard';
import AddListingModal from '../components/AddListingModal';
import { useAuth } from '../hooks/useAuth';
import { fetchListings } from '../services/firestoreService';
import type { Listing } from '../services/firestoreService';

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
  }, [currentUser]);

  const loadListings = async () => {
    try {
      setIsLoading(true);
      const firestoreListings = await fetchListings();
      
      const displayListings: ListingDisplay[] = firestoreListings.map((listing) => ({
        ...listing,
        lastUpdated: '2 hours ago', // You can calculate this from timestamps in Firestore
        isOwn: listing.userId === currentUser?.uid,
      }));

      setListings(displayListings);
    } catch (error) {
      console.error('Error loading listings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredListings = activeFilter === 'All' 
    ? listings 
    : listings.filter(listing => listing.location === activeFilter);

  const handleListingAdded = () => {
    loadListings();
  };

  return (
    <div className="min-h-screen bg-primary-50">
      <Navbar onAddListing={() => setIsModalOpen(true)} />

      <div className="container mx-auto px-4 py-6">
        <FilterChips
          filters={filters}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
              <p className="text-primary-600">Loading listings...</p>
            </div>
          </div>
        ) : filteredListings.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <p className="text-primary-600 text-lg">No listings available</p>
              <p className="text-primary-400 text-sm">Add a listing to get started</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-6">
            {filteredListings.map((listing) => (
              <ListingCard 
                key={listing.id} 
                listing={listing}
                onListingDeleted={handleListingAdded}
              />
            ))}
          </div>
        )}
      </div>

      <AddListingModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onListingAdded={handleListingAdded}
      />
    </div>
  );
};

export default DashboardPage;