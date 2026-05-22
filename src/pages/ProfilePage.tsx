import { useState, useEffect } from 'react';
import { User, Building, Phone, Mail, Edit, CheckCircle, ArrowLeft, AlertCircle, LogOut, Trash2, PlusCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { DEPARTMENTS } from '../constants/departments';
import { useAuth } from '../hooks/useAuth';
import * as fireService from '../services/firestoreService.js';
const { getUserData, updateUserProfile, subscribeToUserListings, subscribeToCompletedListings, subscribeToUserActivities } = (fireService as any);
import { motion } from 'framer-motion';

interface UserProfile {
  email: string;
  name: string;
  department: string;
  phone: string;
}

type ActivityType = 'completed' | 'deleted' | 'created';

interface ActivityItem {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  timestamp: number;
}

const STORAGE_KEY = 'dswap_recent_activity';

const formatActivityDate = (timestamp: number | { seconds?: number; toDate?: () => Date }) => {
  let seconds = 0;
  if (typeof timestamp === 'number') {
    seconds = timestamp;
  } else if (timestamp?.seconds) {
    seconds = timestamp.seconds;
  } else if (typeof timestamp?.toDate === 'function') {
    seconds = Math.floor(timestamp.toDate().getTime() / 1000);
  }

  const date = new Date(seconds * 1000);
  return date.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
};

const loadStoredActivity = (): ActivityItem[] => {
  if (typeof window === 'undefined') return [];
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      console.log('No stored activities found in localStorage');
      return [];
    }
    const parsed = JSON.parse(saved);
    const result = Array.isArray(parsed) ? parsed : [];
    console.log('Loaded stored activities from localStorage:', result.length);
    return result;
  } catch (err) {
    console.error('Error loading stored activities from localStorage:', err);
    return [];
  }
};

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
  const [createdListingsCount, setCreatedListingsCount] = useState(0);
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);
  const [firestoreActivities, setFirestoreActivities] = useState<ActivityItem[]>([]);
  const [completedActivitiesState, setCompletedActivitiesState] = useState<ActivityItem[]>([]);

  useEffect(() => {
    loadUserProfile();
    setRecentActivity(loadStoredActivity());

    if (currentUser) {
      const unsubscribeActive = subscribeToUserListings(currentUser.uid, (listings: any[]) => {
        setTotalListings(listings.length);
      });
      const unsubscribeCompleted = subscribeToCompletedListings(currentUser.uid, (listings: any[]) => {
        setCompletedListings(listings.length);

        const completedActivities = listings
          .map((listing) => ({
            id: listing.id || `${listing.userId}-${listing.updatedAt?.seconds || listing.createdAt?.seconds || Date.now()}`,
            type: 'completed' as const,
            title: 'DSwap completed',
            description: `${listing.amount} ₹ • ${listing.location || 'Unknown location'}`,
            timestamp: listing.completedAt?.seconds || listing.updatedAt?.seconds || Math.floor(Date.now() / 1000),
          }))
          .sort((a, b) => b.timestamp - a.timestamp);

        setCompletedActivitiesState(completedActivities);
        // merge with stored and firestore activities below via effect
      });
      let unsubscribeActivities = () => {};
      if (typeof subscribeToUserActivities === 'function') {
        unsubscribeActivities = subscribeToUserActivities(currentUser.uid, (activities: any[]) => {
          if (!Array.isArray(activities)) {
            console.warn('subscribeToUserActivities returned non-array:', activities);
            return;
          }
          const mapped = activities
            .map((a) => ({
              id: a.id,
              type: a.type as ActivityItem['type'],
              title: a.title,
              description: a.description,
              timestamp: typeof a.timestamp === 'number'
                ? a.timestamp
                : a.timestamp?.seconds || Math.floor(Date.now() / 1000),
            }))
            .sort((a, b) => b.timestamp - a.timestamp);
          console.log('Firestore activities loaded:', mapped.length, 'items');
          setFirestoreActivities(mapped);
        }) || (() => {});
      } else {
        console.warn('subscribeToUserActivities function not found');
      }
      
      return () => {
        unsubscribeActive();
        unsubscribeCompleted();
        unsubscribeActivities();
      };
    }
  }, [currentUser]);

  // Whenever any source updates, merge stored + firestoreActivities + completedActivitiesState
  useEffect(() => {
    const stored = loadStoredActivity();
    const allActivities = [...stored, ...firestoreActivities, ...completedActivitiesState];
    
    console.log('Merging activities - Stored:', stored.length, 'Firestore:', firestoreActivities.length, 'Completed:', completedActivitiesState.length);
    
    const unique = allActivities.reduce<Record<string, ActivityItem>>((acc, item) => {
      const key = item.id || `${item.type}-${item.description}-${item.timestamp}`;
      acc[key] = item;
      return acc;
    }, {} as Record<string, ActivityItem>);
    
    const sorted = Object.values(unique).sort((a, b) => b.timestamp - a.timestamp);
    const createdCount = sorted.filter((activity) => activity.type === 'created').length;

    console.log('Final unique activities:', sorted.length);
    sorted.forEach((a, i) => {
      console.log(`  ${i + 1}. ${a.title} - ${a.type}`);
    });

    setCreatedListingsCount(createdCount);
    setRecentActivity(sorted.slice(0, 10));
  }, [firestoreActivities, completedActivitiesState, totalListings, completedListings]);

  // Listen for localStorage changes (cross-tab) and merge sources when storage updates
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (!e.key || e.key === STORAGE_KEY) {
        console.log('Storage event detected - refreshing activities');
        const stored = loadStoredActivity();
        const merged = [...stored, ...firestoreActivities, ...completedActivitiesState];
        const unique = merged.reduce<Record<string, ActivityItem>>((acc, item) => {
          const key = item.id || `${item.type}-${item.description}-${item.timestamp}`;
          acc[key] = item;
          return acc;
        }, {} as Record<string, ActivityItem>);
        const sorted = Object.values(unique).sort((a, b) => b.timestamp - a.timestamp);
        console.log('Activities after storage update:', sorted.length);
        setRecentActivity(sorted.slice(0, 10));
      }
    };

    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [firestoreActivities, completedActivitiesState]);

  const loadUserProfile = async () => {
    if (!currentUser) return;

    try {
      setIsLoading(true);
      setError('');

      // Fetch user details
      const userDetails = await getUserData(currentUser.uid);
      setProfile(userDetails);
      setEditedProfile(userDetails);
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
            <motion.div whileHover={{ y: -4 }} className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 text-center backdrop-blur-xl">
              <div className="text-3xl font-semibold text-white mb-2">{totalListings}</div>
              <div className="text-slate-400">Active Listings</div>
            </motion.div>
            <motion.div whileHover={{ y: -4 }} className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 text-center backdrop-blur-xl">
              <div className="text-3xl font-semibold text-white mb-2">{completedListings}</div>
              <div className="text-slate-400">DSwap done</div>
            </motion.div>
            <motion.div whileHover={{ y: -4 }} className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-6 text-center backdrop-blur-xl">
              <div className="text-3xl font-semibold text-white mb-2">{createdListingsCount > 0 ? createdListingsCount : totalListings + completedListings}</div>
              <div className="text-slate-400">Total Listings</div>
            </motion.div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-8 backdrop-blur-xl">
            <h3 className="text-xl font-semibold text-white mb-6">Recent Activity</h3>
            <div className="space-y-3 max-h-[28rem] overflow-y-auto pr-2 recent-activity-scroll">
              {recentActivity.length === 0 ? (
                <p className="text-slate-300 text-center py-8">No recent activity yet. Complete or delete a listing to see your activity here.</p>
              ) : (
                recentActivity.map((activity) => (
                  <div key={activity.id} className="rounded-3xl border border-white/10 bg-slate-950/80 px-4 py-4 text-sm text-slate-200 shadow-[0_10px_30px_rgba(0,0,0,0.18)]">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-2xl ${activity.type === 'completed' ? 'bg-emerald-400/10 text-emerald-300' : activity.type === 'deleted' ? 'bg-rose-500/10 text-rose-300' : 'bg-sky-400/10 text-sky-300'}`}>
                          {activity.type === 'completed' ? <CheckCircle className="h-5 w-5" /> : activity.type === 'deleted' ? <Trash2 className="h-5 w-5" /> : <PlusCircle className="h-5 w-5" />}
                        </div>
                        <div>
                          <p className="font-semibold text-white">{activity.title}</p>
                          <p className="text-slate-300">{activity.description}</p>
                        </div>
                      </div>
                      <span className="text-xs text-slate-500">{formatActivityDate(activity.timestamp)}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfilePage;
