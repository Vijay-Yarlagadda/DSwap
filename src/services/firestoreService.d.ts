export interface UserData {
  name: string;
  department: string;
  phone: string;
  email: string;
}

export interface ListingData {
  amount: number;
  location: string;
  name: string;
  department: string;
  phone: string;
}

export interface Listing extends ListingData {
  id?: string;
  userId: string;
  createdAt?: { seconds: number; nanoseconds: number };
  updatedAt?: { seconds: number; nanoseconds: number };
}

export function saveUserData(uid: string, userData: Partial<UserData>): Promise<void>;
export function getUserData(uid: string): Promise<UserData | null>;
export function addListing(uid: string, listingData: ListingData): Promise<string>;
export function addActivity(uid: string, activity: { id?: string; type: string; title: string; description: string; timestamp?: number }): Promise<string>;
export function getListings(filters?: { location?: string }): Promise<Listing[]>;
export function updateListingAmount(listingId: string, amount: number): Promise<void>;
export function deleteListing(listingId: string): Promise<void>;
export function completeListing(listingId: string): Promise<void>;
export function subscribeToUserListings(uid: string, callback: (listings: Listing[]) => void): () => void;
export function subscribeToCompletedListings(uid: string, callback: (listings: Listing[]) => void): () => void;
export function fetchCompletedListings(uid: string): Promise<Listing[]>;

export function fetchListings(): Promise<Listing[]>;
export function getUserDetails(uid: string): Promise<UserData | null>;
export function updateUserProfile(uid: string, updates: Partial<UserData>): Promise<void>;
export function fetchUserListings(uid: string): Promise<Listing[]>;
