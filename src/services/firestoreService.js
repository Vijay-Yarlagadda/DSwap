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
    const listings = snapshot.docs.map((listingDoc) => ({
      id: listingDoc.id,
      ...listingDoc.data(),
    }));
    return sortByLatest(listings);
  } catch (error) {
    throw formatFirestoreError(error, 'Failed to load listings.');
  }
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
    const listings = snapshot.docs.map((listingDoc) => ({
      id: listingDoc.id,
      ...listingDoc.data(),
    }));
    return sortByLatest(listings);
  } catch (error) {
    throw formatFirestoreError(error, 'Failed to load your listings.');
  }
};
