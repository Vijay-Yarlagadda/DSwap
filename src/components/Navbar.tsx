import { Search, Plus, User, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

interface NavbarProps {
  onAddListing?: () => void;
}

const Navbar = ({ onAddListing }: NavbarProps) => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/auth');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

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

            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="w-8 h-8 bg-primary-200 rounded-full flex items-center justify-center cursor-pointer hover:bg-primary-300 transition-colors"
              >
                <User className="h-4 w-4 text-primary-600" />
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-primary-100 z-50">
                  <div className="px-4 py-3 border-b border-primary-100">
                    <p className="text-sm font-medium text-primary-900">
                      {currentUser?.displayName || currentUser?.email || 'User'}
                    </p>
                    <p className="text-xs text-primary-600">{currentUser?.email}</p>
                  </div>
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-primary-700 hover:bg-primary-50"
                    onClick={() => setShowDropdown(false)}
                  >
                    <User className="h-4 w-4 inline mr-2" />
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50"
                  >
                    <LogOut className="h-4 w-4 inline mr-2" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;