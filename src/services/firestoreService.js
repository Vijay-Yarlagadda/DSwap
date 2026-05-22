import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  onSnapshot
} from 'firebase/firestore';
import { db } from '../firebase/firebase';

const USERS_COLLECTION = 'users';
const LISTINGS_COLLECTION = 'listings';

const sortByLatest = (listings) =>
  listings.sort((a, b) => {
    const aSeconds = a?.createdAt?.seconds ?? 0;
    const bSeconds = b?.createdAt?.seconds ?? 0;
    return bSeconds - aSeconds;
  });

const isValidListingData = (listing) => {
  if (!listing) return false;

  const amount = Number(listing.amount);
  const location = String(listing.location ?? '').trim();
  const name = String(listing.name ?? '').trim();
  const phone = String(listing.phone ?? '').trim();

  return Number.isFinite(amount) && location.length > 0 && name.length > 0 && phone.length > 0;
};

const formatFirestoreError = (error, fallbackMessage) => {
  if (error instanceof Error) {
    return new Error(error.message || fallbackMessage);
  }
  return new Error(fallbackMessage);
};

export const saveUserData = async (uid, userData) => {
  try {
    const userRef = doc(db, USERS_COLLECTION, uid);
    const existingUser = await getDoc(userRef);
    const existingData = existingUser.exists() ? existingUser.data() : {};

    const payload = {
      name:
        userData?.name?.trim() || existingData?.name?.trim() || '',
      department:
        userData?.department?.trim() ?? existingData?.department ?? '',
      phone:
        userData?.phone?.trim() ?? existingData?.phone ?? '',
      email:
        userData?.email?.trim() || existingData?.email?.trim() || '',
      updatedAt: serverTimestamp(),
    };

    if (!existingUser.exists()) {
      await setDoc(userRef, {
        ...payload,
        createdAt: serverTimestamp(),
      });
      return;
    }

    await setDoc(userRef, payload, { merge: true });
  } catch (error) {
    throw formatFirestoreError(error, 'Failed to save user data.');
  }
};

export const getUserData = async (uid) => {
  try {
    const userRef = doc(db, USERS_COLLECTION, uid);
    const userSnap = await getDoc(userRef);
    return userSnap.exists() ? userSnap.data() : null;
  } catch (error) {
    throw formatFirestoreError(error, 'Failed to fetch user profile.');
  }
};

export const addListing = async (uid, listingData) => {
  try {
    const listingPayload = {
      amount: Number(listingData.amount),
      location: listingData.location,
      name: listingData.name?.trim(),
      department: listingData.department?.trim(),
      phone: listingData.phone?.trim(),
      userId: uid,
      status: 'active',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const listingRef = await addDoc(collection(db, LISTINGS_COLLECTION), listingPayload);
    return listingRef.id;
  } catch (error) {
    throw formatFirestoreError(error, 'Failed to add listing.');
  }
};

export const getListings = async ({ location } = {}) => {
  try {
    const listingsRef = collection(db, LISTINGS_COLLECTION);
    const listingsQuery = location ? query(listingsRef, where('location', '==', location)) : query(listingsRef);

    const snapshot = await getDocs(listingsQuery);
    const listings = snapshot.docs
      .map((listingDoc) => ({
        id: listingDoc.id,
        ...listingDoc.data(),
      }))
      .filter((listing) => isValidListingData(listing) && listing.status !== 'completed' && !listing.completed);

    return sortByLatest(listings);
  } catch (error) {
    throw formatFirestoreError(error, 'Failed to load listings.');
  }
};

// Real-time subscriptions
export const subscribeToActiveListings = (location, callback) => {
  const listingsRef = collection(db, LISTINGS_COLLECTION);
  const listingsQuery = location 
    ? query(listingsRef, where('location', '==', location)) 
    : query(listingsRef);
    
  return onSnapshot(listingsQuery, (snapshot) => {
    const listings = snapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .filter((listing) => isValidListingData(listing) && listing.status !== 'completed' && !listing.completed);
      
    callback(sortByLatest(listings));
  }, (error) => {
    console.error('Error in listings subscription:', error);
  });
};

export const subscribeToUserListings = (uid, callback) => {
  const listingsRef = collection(db, LISTINGS_COLLECTION);
  const listingsQuery = query(listingsRef, where('userId', '==', uid));
    
  return onSnapshot(listingsQuery, (snapshot) => {
    const listings = snapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .filter((listing) => isValidListingData(listing) && listing.status !== 'completed' && !listing.completed);
      
    callback(sortByLatest(listings));
  }, (error) => {
    console.error('Error in user listings subscription:', error);
  });
};

export const subscribeToCompletedListings = (uid, callback) => {
  const listingsRef = collection(db, LISTINGS_COLLECTION);
  // Support both new `status: 'completed'` and legacy `completed: true`
  const listingsQuery = query(listingsRef, where('userId', '==', uid));
    
  return onSnapshot(listingsQuery, (snapshot) => {
    const listings = snapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .filter((listing) => isValidListingData(listing) && (listing.status === 'completed' || listing.completed === true));
      
    callback(sortByLatest(listings));
  }, (error) => {
    console.error('Error in completed listings subscription:', error);
  });
};

export const updateListingAmount = async (listingId, amount) => {
  try {
    const listingRef = doc(db, LISTINGS_COLLECTION, listingId);
    await updateDoc(listingRef, {
      amount: Number(amount),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    throw formatFirestoreError(error, 'Failed to update listing amount.');
  }
};

export const completeListing = async (listingId) => {
  try {
    const listingRef = doc(db, LISTINGS_COLLECTION, listingId);
    await updateDoc(listingRef, {
      status: 'completed',
      completed: true, // For legacy support if needed elsewhere
      completedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    throw formatFirestoreError(error, 'Failed to complete listing.');
  }
};

export const deleteListing = async (listingId) => {
  try {
    const listingRef = doc(db, LISTINGS_COLLECTION, listingId);
    await deleteDoc(listingRef);
  } catch (error) {
    throw formatFirestoreError(error, 'Failed to delete listing.');
  }
};

// Compatibility helpers for existing pages/components.
export const fetchListings = () => getListings();
export const getUserDetails = (uid) => getUserData(uid);
export const updateUserProfile = async (uid, updates) => {
  await saveUserData(uid, updates);
};
export const fetchUserListings = async (uid) => {
  try {
    const listingsRef = collection(db, LISTINGS_COLLECTION);
    const q = query(listingsRef, where('userId', '==', uid));
    const snapshot = await getDocs(q);
    const listings = snapshot.docs
      .map((listingDoc) => ({
        id: listingDoc.id,
        ...listingDoc.data(),
      }))
      .filter((listing) => isValidListingData(listing) && listing.status !== 'completed' && !listing.completed);
    return sortByLatest(listings);
  } catch (error) {
    throw formatFirestoreError(error, 'Failed to load your listings.');
  }
};

export const fetchCompletedListings = async (uid) => {
  try {
    const listingsRef = collection(db, LISTINGS_COLLECTION);
    const q = query(listingsRef, where('userId', '==', uid));
    const snapshot = await getDocs(q);
    const listings = snapshot.docs
      .map((listingDoc) => ({
        id: listingDoc.id,
        ...listingDoc.data(),
      }))
      .filter((listing) => isValidListingData(listing) && (listing.status === 'completed' || listing.completed === true));
    return sortByLatest(listings);
  } catch (error) {
    throw formatFirestoreError(error, 'Failed to load completed listings.');
  }
};

// Activities collection for cross-device recent activity
const ACTIVITIES_COLLECTION = 'activities';

export const addActivity = async (uid, activity) => {
  try {
    const payload = {
      userId: uid,
      type: activity.type,
      title: activity.title,
      description: activity.description,
      timestamp: serverTimestamp(),
    };
    await addDoc(collection(db, ACTIVITIES_COLLECTION), payload);
  } catch (error) {
    console.error('Failed to add activity:', error);
  }
};

export const subscribeToUserActivities = (uid, callback) => {
  try {
    const activitiesRef = collection(db, ACTIVITIES_COLLECTION);
    const q = query(activitiesRef, where('userId', '==', uid));
    return onSnapshot(q, (snapshot) => {
      const activities = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      callback(activities);
    }, (error) => {
      console.error('Error in activities subscription:', error);
    });
  } catch (error) {
    console.error('subscribeToUserActivities error:', error);
    return () => {};
  }
};
