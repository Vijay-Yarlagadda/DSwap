import { useState, useEffect } from 'react';
import { User, Building, Phone, Mail, Edit, CheckCircle, ArrowLeft, AlertCircle, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { DEPARTMENTS } from '../constants/departments';
import { useAuth } from '../hooks/useAuth';
import { getUserDetails, updateUserProfile, fetchUserListings } from '../services/firestoreService';
import type { UserProfile } from '../services/firestoreService';

const ProfilePage = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [editedProfile, setEditedProfile] = useState<UserProfile | null>(null);
  const [totalListings, setTotalListings] = useState(0);

  useEffect(() => {
    loadUserProfile();
  }, [currentUser]);

  const loadUserProfile = async () => {
    if (!currentUser) return;

    try {
      setIsLoading(true);
      setError('');

      // Fetch user details
      const userDetails = await getUserDetails(currentUser.uid);
      setProfile(userDetails);
      setEditedProfile(userDetails);

      // Fetch user's listings
      const listings = await fetchUserListings(currentUser.uid);
      setTotalListings(listings.length);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load profile';
      setError(errorMessage);
      console.error('Error loading profile:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!currentUser || !editedProfile) return;

    // Validate fields
    if (!editedProfile.name || !editedProfile.phone || !editedProfile.department) {
      setError('Please fill in all fields');
      return;
    }

    setIsSaving(true);
    setError('');

    try {
      await updateUserProfile(currentUser.uid, {
        name: editedProfile.name,
        phone: editedProfile.phone,
        department: editedProfile.department,
      });

      setProfile(editedProfile);
      setIsEditing(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save profile';
      setError(errorMessage);
      console.error('Error saving profile:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
    setError('');
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/auth');
    } catch (err) {
      console.error('Logout error:', err);
      setError('Failed to log out. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-primary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-primary-600">Loading profile...</p>
        </div>
      </div>
    );
  }

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
          {error && (
            <div className="mb-6 flex items-start gap-2 rounded-lg border border-rose-300/40 bg-rose-500/10 p-4 text-sm text-rose-700">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-primary-900">Profile</h1>
                <p className="text-sm text-primary-500">Manage your account details and logout securely.</p>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={handleLogout}
                  className="bg-rose-500 text-white px-4 py-2 rounded-lg hover:bg-rose-600 transition-colors flex items-center space-x-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
                  >
                    <Edit className="h-4 w-4" />
                    <span>Edit</span>
                  </button>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      onClick={handleCancel}
                      disabled={isSaving}
                      className="bg-primary-100 text-primary-600 px-4 py-2 rounded-lg hover:bg-primary-200 transition-colors disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
                    >
                      <span>{isSaving ? 'Saving...' : 'Save'}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {profile && editedProfile && (
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-primary-200 rounded-full flex items-center justify-center">
                    <User className="h-8 w-8 text-primary-600" />
                  </div>
                  <div className="flex-1">
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedProfile.name}
                        onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })}
                        className="w-full px-3 py-2 border border-primary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Full Name"
                      />
                    ) : (
                      <h2 className="text-2xl font-semibold text-primary-900">{profile.name}</h2>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="flex items-center text-primary-700 font-medium">
                      <Mail className="h-4 w-4 mr-2" />
                      Email
                    </label>
                    <p className="text-primary-600 px-3 py-2">{profile.email}</p>
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center text-primary-700 font-medium">
                      <Phone className="h-4 w-4 mr-2" />
                      Phone Number
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={editedProfile.phone}
                        onChange={(e) => setEditedProfile({ ...editedProfile, phone: e.target.value })}
                        className="w-full px-3 py-2 border border-primary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Phone Number"
                      />
                    ) : (
                      <p className="text-primary-600 px-3 py-2">{profile.phone}</p>
                    )}
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="flex items-center text-primary-700 font-medium">
                      <Building className="h-4 w-4 mr-2" />
                      Department
                    </label>
                    {isEditing ? (
                      <select
                        value={editedProfile.department}
                        onChange={(e) => setEditedProfile({ ...editedProfile, department: e.target.value })}
                        className="w-full px-3 py-2 border border-primary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        <option value="">Select Department</option>
                        {DEPARTMENTS.map((department) => (
                          <option key={department} value={department}>
                            {department}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <p className="text-primary-600 px-3 py-2">{profile.department}</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-sm p-6 text-center">
              <div className="text-3xl font-bold text-primary-900 mb-2">{totalListings}</div>
              <div className="text-primary-600">My Listings</div>
            </div>
            <div className="bg-white rounded-2xl shadow-sm p-6 text-center">
              <div className="text-3xl font-bold text-primary-900 mb-2">0</div>
              <div className="text-primary-600">Active Listings</div>
            </div>
            <div className="bg-white rounded-2xl shadow-sm p-6 text-center">
              <div className="text-3xl font-bold text-primary-900 mb-2">0</div>
              <div className="text-primary-600">Completed Exchanges</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-8">
            <h3 className="text-xl font-bold text-primary-900 mb-6">Recent Activity</h3>
            <div className="space-y-4">
              {totalListings === 0 ? (
                <p className="text-primary-600 text-center py-8">No listings yet. Create your first listing!</p>
              ) : (
                <div className="flex items-center justify-between py-3 border-b border-primary-100">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="font-medium text-primary-900">Total listings created</p>
                      <p className="text-sm text-primary-600">You have {totalListings} active listing{totalListings !== 1 ? 's' : ''}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
