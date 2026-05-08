import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp
} from 'firebase/firestore';
import { db } from '../firebase/config';

export interface Listing {
  id?: string;
  name: string;
  department: string;
  phone: string;
  location: string;
  amount: number;
  userId: string;
}

// Add a new listing
export const addListing = async (userId: string, listingData: Omit<Listing, 'id' | 'userId'>) => {
  try {
    const listingsRef = collection(db, 'listings');
    const docRef = await addDoc(listingsRef, {
      ...listingData,
      userId,
      createdAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding listing:', error);
    throw error;
  }
};

// Fetch all listings
export const fetchListings = async (): Promise<Listing[]> => {
  try {
    const listingsRef = collection(db, 'listings');
    const snapshot = await getDocs(listingsRef);
    
    const listings: Listing[] = [];
    snapshot.forEach((doc) => {
      listings.push({
        id: doc.id,
        ...doc.data(),
      } as Listing);
    });
    
    return listings;
  } catch (error) {
    console.error('Error fetching listings:', error);
    throw error;
  }
};

// Fetch listings by user
export const fetchUserListings = async (userId: string): Promise<Listing[]> => {
  try {
    const listingsRef = collection(db, 'listings');
    const q = query(listingsRef, where('userId', '==', userId));
    const snapshot = await getDocs(q);
    
    const listings: Listing[] = [];
    snapshot.forEach((doc) => {
      listings.push({
        id: doc.id,
        ...doc.data(),
      } as Listing);
    });
    
    return listings;
  } catch (error) {
    console.error('Error fetching user listings:', error);
    throw error;
  }
};

// Update listing amount
export const updateListingAmount = async (listingId: string, newAmount: number) => {
  try {
    const listingRef = doc(db, 'listings', listingId);
    await updateDoc(listingRef, {
      amount: newAmount,
    });
  } catch (error) {
    console.error('Error updating listing amount:', error);
    throw error;
  }
};

// Delete a listing
export const deleteListing = async (listingId: string) => {
  try {
    const listingRef = doc(db, 'listings', listingId);
    await deleteDoc(listingRef);
  } catch (error) {
    console.error('Error deleting listing:', error);
    throw error;
  }
};

// Fetch user details
export const fetchUserDetails = async (userId: string) => {
  try {
    const userRef = doc(db, 'users', userId);
    const snapshot = await getDocs(collection(db, 'users'));
    
    let userDetails = null;
    snapshot.forEach((doc) => {
      if (doc.id === userId) {
        userDetails = {
          id: doc.id,
          ...doc.data(),
        };
      }
    });
    
    return userDetails;
  } catch (error) {
    console.error('Error fetching user details:', error);
    throw error;
  }
};
