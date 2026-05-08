import { useState, useEffect } from 'react';
import { User, Building, Phone, Mail, Edit, CheckCircle, ArrowLeft, AlertCircle, LogOut, Package } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { DEPARTMENTS } from '../constants/departments';
import { useAuth } from '../hooks/useAuth';
import { getUserData, updateUserProfile, fetchUserListings, fetchCompletedListings } from '../services/firestoreService.js';
import { motion } from 'framer-motion';

interface UserProfile {
  email: string;
  name: string;
  department: string;
  phone: string;
}

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
  const [completedListings, setCompletedListings] = useState(0);

  useEffect(() => {
    loadUserProfile();
  }, [currentUser]);

  const loadUserProfile = async () => {
    if (!currentUser) return;

    try {
      setIsLoading(true);
      setError('');

      // Fetch user details
      const userDetails = await getUserData(currentUser.uid);
      setProfile(userDetails);
      setEditedProfile(userDetails);

      // Fetch user's listings
      const listings = await fetchUserListings(currentUser.uid);
      setTotalListings(listings.length);

      // Fetch completed listings
      const completed = await fetchCompletedListings(currentUser.uid);
      setCompletedListings(completed.length);
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
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-300 mx-auto mb-4"></div>
          <p className="text-slate-300">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(59,130,246,0.25),transparent_34%),radial-gradient(circle_at_85%_22%,rgba(56,189,248,0.2),transparent_35%),radial-gradient(circle_at_50%_85%,rgba(37,99,235,0.2),transparent_42%)]" />
      <motion.div
        className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: 'easeOut' }}
      >
        <div className="mb-6">
          <Link to="/dashboard" className="inline-flex items-center text-slate-300 hover:text-white transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
        </div>

        <div className="max-w-4xl mx-auto">
          {error && (
            <div className="mb-6 flex items-start gap-2 rounded-xl border border-rose-300/30 bg-rose-500/10 p-4 text-sm text-rose-200">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="mb-8 rounded-3xl border border-white/10 bg-white/[0.06] p-8 shadow-[0_20px_50px_rgba(2,6,23,0.5)] backdrop-blur-xl">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
              <div>
                <h1 className="text-3xl font-semibold text-white">Profile</h1>
                <p className="text-sm text-slate-400">Manage your account details and logout securely.</p>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={handleLogout}
                  className="bg-rose-500/90 text-white px-4 py-2 rounded-xl hover:bg-rose-500 transition-colors flex items-center space-x-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-primary-600 text-white px-4 py-2 rounded-xl hover:bg-primary-500 transition-colors flex items-center space-x-2"
                  >
                    <Edit className="h-4 w-4" />
                    <span>Edit</span>
                  </button>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      onClick={handleCancel}
                      disabled={isSaving}
                      className="border border-white/20 bg-white/5 text-slate-200 px-4 py-2 rounded-xl hover:bg-white/10 transition-colors disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="bg-primary-600 text-white px-4 py-2 rounded-xl hover:bg-primary-500 transition-colors disabled:opacity-50 flex items-center space-x-2"
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
                  <div className="w-16 h-16 bg-primary-500/20 rounded-full flex items-center justify-center border border-primary-300/40">
                    <User className="h-8 w-8 text-primary-200" />
                  </div>
                  <div className="flex-1">
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedProfile.name}
                        onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })}
                        className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-slate-100 outline-none transition focus:border-primary-300/70 focus:bg-white/10"
                        placeholder="Full Name"
                      />
                    ) : (
                      <h2 className="text-2xl font-semibold text-white">{profile.name}</h2>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="flex items-center text-slate-300 font-medium">
                      <Mail className="h-4 w-4 mr-2" />
                      Email
                    </label>
                    <p className="px-3 py-2 text-slate-200">{profile.email}</p>
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center text-slate-300 font-medium">
                      <Phone className="h-4 w-4 mr-2" />
                      Phone Number
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={editedProfile.phone}
                        onChange={(e) => setEditedProfile({ ...editedProfile, phone: e.target.value })}
                        className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-slate-100 outline-none transition focus:border-primary-300/70 focus:bg-white/10"
                        placeholder="Phone Number"
                      />
                    ) : (
                      <p className="px-3 py-2 text-slate-200">{profile.phone}</p>
                    )}
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="flex items-center text-slate-300 font-medium">
                      <Building className="h-4 w-4 mr-2" />
                      Department
                    </label>
                    {isEditing ? (
                      <select
                        value={editedProfile.department}
                        onChange={(e) => setEditedProfile({ ...editedProfile, department: e.target.value })}
                        className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-slate-100 outline-none transition focus:border-primary-300/70 focus:bg-white/10"
                      >
                        <option value="" className="text-slate-900">Select Department</option>
                        {DEPARTMENTS.map((department) => (
                          <option key={department} value={department} className="text-slate-900">
                            {department}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <p className="px-3 py-2 text-slate-200">{profile.department}</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <motion.div whileHover={{ y: -4 }} className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 text-center backdrop-blur-xl">
              <div className="text-3xl font-semibold text-white mb-2">{totalListings}</div>
              <div className="text-slate-300">My Listings</div>
            </motion.div>
            <motion.div whileHover={{ y: -4 }} className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 text-center backdrop-blur-xl">
              <div className="text-3xl font-semibold text-white mb-2">0</div>
              <div className="text-slate-300">Active Listings</div>
            </motion.div>
            <motion.div whileHover={{ y: -4 }} className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 text-center backdrop-blur-xl">
              <div className="text-3xl font-semibold text-white mb-2">{completedListings}</div>
              <div className="text-slate-300">Completed Exchanges</div>
            </motion.div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-8 backdrop-blur-xl">
            <h3 className="text-xl font-semibold text-white mb-6">Recent Activity</h3>
            <div className="space-y-4">
              {totalListings === 0 && completedListings === 0 ? (
                <p className="text-slate-300 text-center py-8">No listings yet. Create your first listing!</p>
              ) : (
                <>
                  {totalListings > 0 && (
                    <div className="flex items-center justify-between py-3 border-b border-white/10">
                      <div className="flex items-center space-x-3">
                        <Package className="h-5 w-5 text-blue-400" />
                        <div>
                          <p className="font-medium text-slate-100">Total listings created</p>
                          <p className="text-sm text-slate-300">You have {totalListings} active listing{totalListings !== 1 ? 's' : ''}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  {completedListings > 0 && (
                    <div className="flex items-center justify-between py-3 border-b border-white/10">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-emerald-400" />
                        <div>
                          <p className="font-medium text-slate-100">Completed exchanges</p>
                          <p className="text-sm text-slate-300">You have completed {completedListings} exchange{completedListings !== 1 ? 's' : ''}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfilePage;
