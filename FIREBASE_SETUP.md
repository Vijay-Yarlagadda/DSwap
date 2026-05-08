# Firebase Setup - Complete Integration Guide

## ✅ What's Been Completed

### Authentication Flow

1. **Signup**: User enters name, department, phone, email, password
   - Creates Firebase Auth account
   - Saves user details to Firestore `users` collection
   - Auto-logs in after signup

2. **Login**: User enters email and password
   - Authenticates with Firebase
   - Maintains session across page refreshes

3. **Google Sign-In**: Click "Continue with Google"
   - Authenticates with Firebase Google provider
   - Auto-saves user data to Firestore

4. **Logout**: Click profile icon in top-right → "Logout"
   - Signs out from Firebase
   - Redirects to auth page

### Profile Management

- **Automatic**: Profile loads from Firestore on signup/login
- **Editable**: Click "Edit" button to update name, phone, department
- **Real Data**: Shows actual user details (not defaults)
- **Statistics**: Shows count of user's listings

### Listings Management

- **Create**: Dashboard → "Add Listing" button
- **View**: All listings displayed with filters by location
- **Delete**: Your own listings show delete button
- **Contact**: Click "Contact" to call listing phone

### Protected Routes

- `/auth` - Public (for signup/login)
- `/dashboard` - Protected (redirects if not logged in)
- `/profile` - Protected (redirects if not logged in)

## 📋 Files Structure

```
src/
├── firebase/
│   └── config.ts ........................... Firebase initialization
├── context/
│   └── AuthContext.tsx ..................... Auth state management
├── hooks/
│   └── useAuth.ts .......................... Custom hook
├── services/
│   ├── authService.ts ..................... Signup, Login, Google OAuth
│   └── firestoreService.ts ............... Listings & User profile CRUD
├── routes/
│   └── ProtectedRoute.tsx ................. Route protection wrapper
├── pages/
│   ├── AuthPage.tsx
│   ├── DashboardPage.tsx .................. Now fetches real data
│   └── ProfilePage.tsx ................... Fetches & displays user details
├── components/
│   ├── AuthForm.tsx ....................... Integrated Firebase auth
│   ├── Navbar.tsx ......................... Updated with logout dropdown
│   ├── AddListingModal.tsx ................ Saves to Firestore
│   ├── ListingCard.tsx .................... Delete functionality
│   └── [other components]
└── App.tsx ............................... Wrapped with AuthProvider
```

## 🔄 User Flow

### First Time User (Signup)

```
1. Go to http://localhost:5173 (redirects to /auth)
2. Click "Switch to sign up"
3. Fill: Name, Department, Phone, Email, Password
4. Click "Create account"
5. ✅ Saved to Firestore users collection
6. ✅ Auto-redirected to Dashboard
7. Click profile icon → See your details
```

### Returning User (Login)

```
1. Go to http://localhost:5173 (redirects to /auth)
2. Enter Email and Password
3. Click "Sign in"
4. ✅ Authenticated with Firebase
5. ✅ Session persists (even after refresh)
6. ✅ Redirected to Dashboard
```

### Adding Listing

```
1. On Dashboard → Click "Add Listing"
2. Fill: Full Name, Department, Amount, Location, Phone
3. Click "Add Listing"
4. ✅ Saved to Firestore listings collection
5. ✅ Appears in Dashboard listing
```

### Editing Profile

```
1. Click profile icon → "Profile"
2. Click "Edit" button
3. Update name, phone, or department
4. Click "Save"
5. ✅ Updated in Firestore
```

### Logout

```
1. Click profile icon (top-right)
2. Click "Logout"
3. ✅ Signed out from Firebase
4. ✅ Redirected to /auth
```

## 🔐 Firestore Collections

### `users` Collection

**Document ID**: Firebase Auth UID

```json
{
  "email": "user@example.com",
  "name": "John Doe",
  "department": "Computer Science",
  "phone": "+91 9876543210"
}
```

### `listings` Collection

**Document ID**: Auto-generated

```json
{
  "name": "John Doe",
  "department": "Computer Science",
  "phone": "+91 9876543210",
  "location": "Block A",
  "amount": 500,
  "userId": "firebase-uid-here",
  "createdAt": timestamp
}
```

## ⚙️ Firebase Console Setup Required

### Security Rules for Firestore

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write only their own document
    match /users/{uid} {
      allow read, write: if request.auth.uid == uid;
    }

    // Anyone authenticated can read listings
    // Only creators can delete/update their listings
    match /listings/{document=**} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth.uid == resource.data.userId;
    }
  }
}
```

## 🧪 Testing Checklist

- [ ] Sign up with new email → Check Firestore `users` collection
- [ ] Profile shows correct details from signup
- [ ] Edit profile → Update in Firestore verified
- [ ] Add listing → Check Firestore `listings` collection
- [ ] Delete own listing → Removed from Firestore & UI
- [ ] Filter listings by location → Works correctly
- [ ] Login with existing account → Session persists
- [ ] Logout → Redirects to auth page
- [ ] Try accessing /dashboard without login → Redirected to /auth
- [ ] Google Sign-In → User created in Firestore
- [ ] Refresh page while logged in → Still logged in

## 🐛 Troubleshooting

**Issue**: Profile shows default data

- **Fix**: User details not saved during signup
- **Check**: Firebase Auth has user, Firestore `users` collection has document with matching UID

**Issue**: Logout button not visible

- **Fix**: Click profile icon (top-right corner) to see dropdown

**Issue**: Listings not showing

- **Fix**: Make sure you've added listings and check Firestore `listings` collection

**Issue**: Can't add listing

- **Fix**: Make sure you're logged in (protected route)

**Issue**: Firebase errors in console

- **Fix**: Check Firebase config in `src/firebase/config.ts` has correct credentials

## 📞 Support

All data is stored in your Firebase project:

- Auth: Firebase Authentication console
- Data: Firestore Database console
