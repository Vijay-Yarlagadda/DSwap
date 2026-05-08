import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from '../firebase/firebase';

const USERS_COLLECTION = 'users';
const LISTINGS_COLLECTION = 'listings';

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

    const payload = {
      name: userData.name?.trim() || '',
      department: userData.department?.trim() || '',
      phone: userData.phone?.trim() || '',
      email: userData.email?.trim() || '',
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
    const listingsQuery = location
      ? query(listingsRef, where('location', '==', location), orderBy('createdAt', 'desc'))
      : query(listingsRef, orderBy('createdAt', 'desc'));

    const snapshot = await getDocs(listingsQuery);
    return snapshot.docs.map((listingDoc) => ({
      id: listingDoc.id,
      ...listingDoc.data(),
    }));
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
    const q = query(listingsRef, where('userId', '==', uid), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((listingDoc) => ({
      id: listingDoc.id,
      ...listingDoc.data(),
    }));
  } catch (error) {
    throw formatFirestoreError(error, 'Failed to load your listings.');
  }
};
