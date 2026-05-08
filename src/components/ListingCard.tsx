import { MapPin, User, Clock, Phone, Edit, Trash2 } from 'lucide-react';

interface Listing {
  id: number;
  amount: number;
  location: string;
  name: string;
  department: string;
  lastUpdated: string;
  isOwn: boolean;
}

interface ListingCardProps {
  listing: Listing;
}

const ListingCard = ({ listing }: ListingCardProps) => {
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
            <button className="p-2 text-primary-400 hover:text-primary-600 transition-colors">
              <Edit className="h-4 w-4" />
            </button>
            <button className="p-2 text-red-400 hover:text-red-600 transition-colors">
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

      <button className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition-colors font-medium flex items-center justify-center space-x-2">
        <Phone className="h-4 w-4" />
        <span>Contact</span>
      </button>
    </div>
  );
};

export default ListingCard;