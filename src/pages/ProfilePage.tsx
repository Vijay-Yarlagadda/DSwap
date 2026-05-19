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
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_10%,rgba(15,23,42,0.95),transparent_24%),radial-gradient(circle_at_86%_20%,rgba(15,23,42,0.92),transparent_32%)]" />
      <motion.div
        className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Profile</p>
            <h1 className="mt-2 text-4xl font-semibold text-white">Your DSwap dashboard</h1>
            <p className="mt-2 max-w-2xl text-slate-400">Manage your account details, active listings, and completed exchanges from a refined and professional profile view.</p>
          </div>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-700 bg-slate-900/85 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:border-slate-500 hover:bg-slate-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>

        {error && (
          <div className="mb-6 rounded-3xl border border-rose-400/20 bg-rose-500/10 p-4 text-sm text-rose-200 shadow-sm">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-4 w-4 text-rose-300" />
              <span>{error}</span>
            </div>
          </div>
        )}

        <div className="grid gap-6 xl:grid-cols-[1.6fr_0.9fr]">
          <div className="rounded-[2rem] border border-slate-800/80 bg-slate-900/90 p-8 shadow-premium-xl">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Account overview</p>
                <h2 className="mt-3 text-3xl font-semibold text-white">Your profile details</h2>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-2 rounded-2xl bg-rose-500/85 px-4 py-3 text-sm font-semibold text-white transition hover:bg-rose-500"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="inline-flex items-center gap-2 rounded-2xl bg-sky-500/90 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-500"
                  >
                    <Edit className="h-4 w-4" />
                    Edit
                  </button>
                ) : (
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={handleCancel}
                      disabled={isSaving}
                      className="rounded-2xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:bg-slate-900 disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="rounded-2xl bg-sky-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-400 disabled:opacity-50"
                    >
                      {isSaving ? 'Saving...' : 'Save'}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {profile && editedProfile && (
              <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                <div className="rounded-[1.75rem] border border-slate-800/70 bg-slate-950/80 p-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-800 text-slate-100">
                      <User className="h-8 w-8" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Account holder</p>
                      <p className="mt-1 text-xl font-semibold text-white">{profile.name}</p>
                    </div>
                  </div>

                  <div className="mt-8 space-y-5">
                    <div className="rounded-3xl border border-slate-800/60 bg-slate-900/80 p-4">
                      <label className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-slate-500">
                        <Mail className="h-4 w-4 text-slate-400" />
                        Email
                      </label>
                      <p className="mt-2 text-base text-slate-200">{profile.email}</p>
                    </div>
                    <div className="rounded-3xl border border-slate-800/60 bg-slate-900/80 p-4">
                      <label className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-slate-500">
                        <Phone className="h-4 w-4 text-slate-400" />
                        Phone
                      </label>
                      {isEditing ? (
                        <input
                          type="tel"
                          value={editedProfile.phone}
                          onChange={(e) => setEditedProfile({ ...editedProfile, phone: e.target.value })}
                          className="mt-3 w-full rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none transition focus:border-slate-400/60 focus:bg-slate-950/90"
                          placeholder="Phone number"
                        />
                      ) : (
                        <p className="mt-2 text-base text-slate-200">{profile.phone}</p>
                      )}
                    </div>
                    <div className="rounded-3xl border border-slate-800/60 bg-slate-900/80 p-4">
                      <label className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-slate-500">
                        <Building className="h-4 w-4 text-slate-400" />
                        Department
                      </label>
                      {isEditing ? (
                        <select
                          value={editedProfile.department}
                          onChange={(e) => setEditedProfile({ ...editedProfile, department: e.target.value })}
                          className="mt-3 w-full rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none transition focus:border-slate-400/60 focus:bg-slate-950/90"
                        >
                          <option value="" className="text-slate-900">Select Department</option>
                          {DEPARTMENTS.map((department) => (
                            <option key={department} value={department} className="text-slate-900">
                              {department}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <p className="mt-2 text-base text-slate-200">{profile.department}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="rounded-[1.75rem] border border-slate-800/70 bg-slate-950/80 p-6">
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Profile information</p>
                  <p className="mt-4 text-slate-400">Update your details to keep your account current. This section remains streamlined and professional while giving you control over contact data.</p>
                  <div className="mt-6 space-y-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Name</p>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editedProfile.name}
                          onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })}
                          className="mt-3 w-full rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none transition focus:border-slate-400/60 focus:bg-slate-950/90"
                          placeholder="Full name"
                        />
                      ) : (
                        <p className="mt-1 text-base text-slate-200">{profile.name}</p>
                      )}
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Account email</p>
                      <p className="mt-1 text-base text-slate-200">{profile.email}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-[2rem] border border-slate-800/80 bg-slate-900/90 p-8 shadow-premium-xl">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Performance</p>
                  <h2 className="mt-2 text-2xl font-semibold text-white">Exchange stats</h2>
                </div>
                <div className="rounded-2xl bg-slate-800/80 px-3 py-2 text-xs uppercase tracking-[0.25em] text-slate-300">Live</div>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl border border-slate-800/70 bg-slate-950/80 p-5">
                  <p className="text-sm text-slate-400">Active listings</p>
                  <p className="mt-3 text-3xl font-semibold text-white">{totalListings}</p>
                </div>
                <div className="rounded-3xl border border-slate-800/70 bg-slate-950/80 p-5">
                  <p className="text-sm text-slate-400">Completed exchanges</p>
                  <p className="mt-3 text-3xl font-semibold text-white">{completedListings}</p>
                </div>
              </div>

              <div className="mt-6 rounded-3xl border border-slate-800/70 bg-slate-950/80 p-6">
                <p className="text-sm text-slate-400">Total exchange volume</p>
                <p className="mt-2 text-4xl font-bold text-white">{totalListings + completedListings}</p>
                <p className="mt-3 text-slate-400">A clear count of your active and completed listings.</p>
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-800/80 bg-slate-900/90 p-8 shadow-premium-xl">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Recent activity</p>
                  <h2 className="mt-2 text-2xl font-semibold text-white">Latest updates</h2>
                </div>
                <CheckCircle className="h-5 w-5 text-emerald-400" />
              </div>

              <div className="mt-8 space-y-4">
                {totalListings === 0 && completedListings === 0 ? (
                  <div className="rounded-3xl border border-slate-800/70 bg-slate-950/80 p-6 text-slate-300">No active or completed listings yet. Start by adding a listing.</div>
                ) : (
                  <>
                    {totalListings > 0 && (
                      <div className="rounded-3xl border border-slate-800/70 bg-slate-950/80 p-5">
                        <div className="flex items-center gap-3">
                          <Package className="h-5 w-5 text-sky-400" />
                          <div>
                            <p className="font-medium text-white">Active listings</p>
                            <p className="text-sm text-slate-400">{totalListings} currently available.</p>
                          </div>
                        </div>
                      </div>
                    )}
                    {completedListings > 0 && (
                      <div className="rounded-3xl border border-slate-800/70 bg-slate-950/80 p-5">
                        <div className="flex items-center gap-3">
                          <CheckCircle className="h-5 w-5 text-emerald-400" />
                          <div>
                            <p className="font-medium text-white">Completed exchanges</p>
                            <p className="text-sm text-slate-400">{completedListings} finished successfully.</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfilePage;
