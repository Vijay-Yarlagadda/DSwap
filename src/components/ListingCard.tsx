import { MapPin, User, Clock, Phone, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { deleteListing } from '../services/firestoreService.js';

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
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow p-6 border border-primary-100">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-2xl font-bold text-primary-900">₹{listing.amount}</h3>
          <div className="flex items-center text-primary-600 mt-1">
            <MapPin className="h-4 w-4 mr-1" />
            <span className="text-sm">{listing.location}</span>
          </div>
        </div>

        {listing.isOwn && (
          <div className="flex space-x-2">
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="p-2 text-red-400 hover:text-red-600 transition-colors disabled:opacity-50"
              title="Delete listing"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-primary-700">
          <User className="h-4 w-4 mr-2" />
          <span className="font-medium">{listing.name}</span>
        </div>
        <p className="text-primary-600 text-sm">{listing.department}</p>
        <div className="flex items-center text-primary-500 text-sm">
          <Clock className="h-4 w-4 mr-1" />
          <span>Updated {listing.lastUpdated}</span>
        </div>
      </div>

      <button
        onClick={handleContact}
        className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition-colors font-medium flex items-center justify-center space-x-2"
      >
        <Phone className="h-4 w-4" />
        <span>Contact {listing.phone}</span>
      </button>
    </div>
  );
};

export default ListingCard;