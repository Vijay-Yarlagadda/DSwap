import { Search, Plus, User } from 'lucide-react';
import { Link } from 'react-router-dom';

interface NavbarProps {
  onAddListing?: () => void;
}

const Navbar = ({ onAddListing }: NavbarProps) => {
  return (
    <nav className="bg-white shadow-sm border-b border-primary-100">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-primary-900">DSwap</h1>
          </div>

          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-primary-400" />
              <input
                type="text"
                placeholder="Search listings..."
                className="w-full pl-10 pr-4 py-2 border border-primary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={onAddListing}
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add Listing</span>
            </button>

            <Link to="/profile">
              <div className="w-8 h-8 bg-primary-200 rounded-full flex items-center justify-center cursor-pointer hover:bg-primary-300 transition-colors">
                <User className="h-4 w-4 text-primary-600" />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;