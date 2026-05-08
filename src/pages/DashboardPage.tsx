import { useState } from 'react';
import Navbar from '../components/Navbar';
import FilterChips from '../components/FilterChips';
import ListingCard from '../components/ListingCard';
import AddListingModal from '../components/AddListingModal';
import { DEPARTMENTS } from '../constants/departments';

const DashboardPage = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filters = ['All', 'Block A', 'Block B', 'Block C', 'Library', 'Lakeview', 'Cuisine'];

  const mockListings = [
    {
      id: 1,
      amount: 500,
      location: 'Block A',
      name: 'John Doe',
      department: DEPARTMENTS[0],
      lastUpdated: '2 hours ago',
      isOwn: false,
    },
    {
      id: 2,
      amount: 200,
      location: 'Library',
      name: 'Jane Smith',
      department: DEPARTMENTS[6],
      lastUpdated: '1 hour ago',
      isOwn: true,
    },
    {
      id: 3,
      amount: 1000,
      location: 'Block B',
      name: 'Mike Johnson',
      department: DEPARTMENTS[7],
      lastUpdated: '30 minutes ago',
      isOwn: false,
    },
    {
      id: 4,
      amount: 300,
      location: 'Lakeview',
      name: 'Sarah Wilson',
      department: DEPARTMENTS[8],
      lastUpdated: '3 hours ago',
      isOwn: false,
    },
    {
      id: 5,
      amount: 750,
      location: 'Cuisine',
      name: 'Alex Brown',
      department: DEPARTMENTS[4],
      lastUpdated: '1 day ago',
      isOwn: false,
    },
    {
      id: 6,
      amount: 150,
      location: 'Block C',
      name: 'Emma Davis',
      department: DEPARTMENTS[5],
      lastUpdated: '4 hours ago',
      isOwn: false,
    },
  ];

  return (
    <div className="min-h-screen bg-primary-50">
      <Navbar onAddListing={() => setIsModalOpen(true)} />

      <div className="container mx-auto px-4 py-6">
        <FilterChips
          filters={filters}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-6">
          {mockListings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      </div>

      <AddListingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default DashboardPage;