import { useState } from 'react';
import { User, Building, Phone, Edit, CheckCircle, XCircle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { DEPARTMENTS } from '../constants/departments';

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: 'John Doe',
    department: 'CSE',
    phone: '+91 9876543210',
  });

  const mockStats = {
    totalListings: 12,
    activeListings: 3,
    completedExchanges: 9,
  };

  const handleSave = () => {
    // Handle save logic
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-primary-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link to="/dashboard" className="inline-flex items-center text-primary-600 hover:text-primary-800 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-primary-900">Profile</h1>
              <button
                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
              >
                <Edit className="h-4 w-4" />
                <span>{isEditing ? 'Save' : 'Edit'}</span>
              </button>
            </div>

            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-primary-200 rounded-full flex items-center justify-center">
                  <User className="h-8 w-8 text-primary-600" />
                </div>
                <div className="flex-1">
                  {isEditing ? (
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      className="w-full px-3 py-2 border border-primary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  ) : (
                    <h2 className="text-2xl font-semibold text-primary-900">{profile.name}</h2>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="flex items-center text-primary-700 font-medium">
                    <Building className="h-4 w-4 mr-2" />
                    Department
                  </label>
                  {isEditing ? (
                    <select
                      value={profile.department}
                      onChange={(e) => setProfile({ ...profile, department: e.target.value })}
                      className="w-full px-3 py-2 border border-primary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      {DEPARTMENTS.map((department) => (
                        <option key={department} value={department}>
                          {department}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <p className="text-primary-600">{profile.department}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="flex items-center text-primary-700 font-medium">
                    <Phone className="h-4 w-4 mr-2" />
                    Phone Number
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-primary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-primary-600">{profile.phone}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-sm p-6 text-center">
              <div className="text-3xl font-bold text-primary-900 mb-2">{mockStats.totalListings}</div>
              <div className="text-primary-600">Total Listings</div>
            </div>
            <div className="bg-white rounded-2xl shadow-sm p-6 text-center">
              <div className="text-3xl font-bold text-primary-900 mb-2">{mockStats.activeListings}</div>
              <div className="text-primary-600">Active Listings</div>
            </div>
            <div className="bg-white rounded-2xl shadow-sm p-6 text-center">
              <div className="text-3xl font-bold text-primary-900 mb-2">{mockStats.completedExchanges}</div>
              <div className="text-primary-600">Completed Exchanges</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-8">
            <h3 className="text-xl font-bold text-primary-900 mb-6">Recent Activity</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-primary-100">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="font-medium text-primary-900">Exchange completed</p>
                    <p className="text-sm text-primary-600">₹300 with Jane Smith</p>
                  </div>
                </div>
                <span className="text-sm text-primary-500">2 days ago</span>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-primary-100">
                <div className="flex items-center space-x-3">
                  <XCircle className="h-5 w-5 text-red-500" />
                  <div>
                    <p className="font-medium text-primary-900">Listing expired</p>
                    <p className="text-sm text-primary-600">₹500 at Block A</p>
                  </div>
                </div>
                <span className="text-sm text-primary-500">1 week ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;