# DSwap - Secure Document & Cash Exchange Platform

A modern, secure, and fully responsive web application for campus-based digital cash and document exchange. Built with React, TypeScript, and Firebase, DSwap provides a seamless peer-to-peer transaction experience with real-time updates and comprehensive profile management.

**Live Demo**: [Visit DSwap](https://dswap.vercel.app)

---

## 📋 Features

### 🔐 **Authentication & Security**

- **Google OAuth 2.0 Integration**: Secure single sign-on with Google
- **Split-Layout Auth UI**: Professional sign-in and sign-up interface
- **Session Management**: Secure token handling and automatic session persistence
- **Protected Routes**: Role-based access control for authenticated users
- **Network-Resilient Auth**: Exponential backoff retry logic with graceful fallbacks

### 💼 **Dashboard & Listings**

- **Real-Time Listings Browse**: View available cash listings with live updates
- **Advanced Filtering**: Filter by location (Block A, B, C, Library, Lakeview, Cuisine) and department
- **Search Functionality**: Quick search across listings
- **Listing Cards**: Detailed information display with user verification status
- **Relative Time Display**: Shows when listings were created (e.g., "2m ago", "3h ago")

### ➕ **Add & Manage Listings**

- **Create New Listings**: Modal form to post available cash
- **Auto-Fill User Data**: Automatic population from user profile
- **Location & Department Selection**: Dropdown selectors with predefined options
- **Real-Time Updates**: Instant synchronization across all active users
- **Validation**: Comprehensive form validation before submission

### 👤 **User Profile Management**

- **Complete Profile Setup**: Name, email, department, phone, and bio
- **Statistics Dashboard**: Track total transactions, completed deals, and activity
- **Profile Completion Tracking**: Onboarding flow for new users
- **User Activity History**: Real-time tracking of all user activities (created, completed, deleted)
- **Profile Updates**: Edit and update user information at any time

### 📊 **Activity Tracking**

- **Transaction History**: Complete record of all completed transactions
- **Listing Management**: View, edit, and delete personal listings
- **Activity Timeline**: Chronological log of all account activities
- **Local Storage Backup**: Activity data persists across sessions
- **Real-Time Sync**: Firestore integration for data persistence

### 🎨 **User Experience**

- **Modern Design System**: Dark-themed UI with vibrant accent colors (Yellow, Red, Blue, Violet)
- **Smooth Animations**: Framer Motion transitions and effects
- **Particle Background**: Dynamic particle effects for visual appeal
- **Responsive Layout**: Mobile-first design that works on all devices
- **Error Boundaries**: Graceful error handling with user-friendly messages
- **Loading States**: Clear visual feedback during async operations

### 🔔 **Additional Features**

- **Department System**: Integration with campus departments
- **Contact Modal**: Quick communication between users
- **Navbar Navigation**: Intuitive navigation with user menu
- **Dark Theme**: Professional dark interface for reduced eye strain

---

## 🛠️ Tech Stack

### Frontend

- **React 18** - Modern UI library with hooks
- **TypeScript** - Type-safe development
- **Vite 6** - Next-generation build tool for lightning-fast development
- **Tailwind CSS 3** - Utility-first CSS framework
- **React Router 7** - Client-side routing and navigation
- **Framer Motion 12** - Smooth animations and transitions
- **Lucide React** - Beautiful, consistent icon library

### Backend & Database

- **Firebase 12.13** - Authentication, Firestore database, and real-time updates
- **Firestore** - NoSQL cloud database with real-time listeners
- **Firebase Authentication** - Secure user authentication

### Styling & Development

- **PostCSS** - CSS transformations
- **Autoprefixer** - Vendor prefix management
- **TypeScript 6** - Strict type checking

### Deployment

- **Vercel** - Serverless hosting platform with automatic deployments
- **Node.js 20.19+** or **22.12+** - JavaScript runtime

---

## 📦 Prerequisites

- **Node.js**: Version 20.19+ or 22.12+
- **npm** or **yarn**: Package manager
- **Firebase Project**: Created at [firebase.google.com](https://firebase.google.com)
- **Google Cloud Project**: For OAuth 2.0 credentials

---

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/DSwap.git
cd DSwap
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Firebase Configuration

#### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project named "DSwap"
3. Enable Firestore Database in test mode (configure security rules later)
4. Enable Firebase Authentication with Google provider

#### Step 2: Get Firebase Credentials

1. In Firebase Console, navigate to **Project Settings** → **General**
2. Under "Your apps", click **Web** icon to register the app
3. Copy the Firebase SDK configuration

#### Step 3: Create Environment File

1. Create a `.env` file in the project root:

```bash
cp .env.example .env
```

2. Fill in your Firebase credentials:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_bucket.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

#### Step 4: Configure Firebase Security Rules

In Firebase Console, go to **Firestore Database** → **Rules** and apply:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null;
      allow create, update: if request.auth != null && request.auth.uid == userId;
      allow delete: if false;
    }
    // Listings collection
    match /listings/{document=**} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && resource.data.userId == request.auth.uid;
    }
    // Activities collection
    match /activities/{document=**} {
      allow read: if request.auth != null && resource.data.userId == request.auth.uid;
      allow create: if request.auth != null;
    }
  }
}
```

#### Step 5: Authorize Your Domain

1. In Firebase Console → **Authentication** → **Settings** → **Authorized domains**
2. Add your deployment domain (e.g., `dswap.vercel.app`)
3. For local development, `localhost:5175` is usually added automatically

---

## 💻 Development

### Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5175`

### Available Development Scripts

```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build locally
npm preview
```

---

## 🔨 Build & Production

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist/` folder.

### Deploy to Vercel

1. Push your repository to GitHub
2. Connect your GitHub repository to Vercel
3. Add environment variables in Vercel dashboard with your Firebase credentials
4. Vercel will automatically deploy on each push to main branch

**Automatic Deploys**: The `vercel.json` configuration ensures optimal build settings.

---

## 📁 Project Structure

```
DSwap/
├── src/
│   ├── components/              # Reusable UI components
│   │   ├── AddListingModal.tsx   # Modal for creating listings
│   │   ├── AuthForm.tsx          # Authentication UI component
│   │   ├── ContactModal.tsx      # User contact modal
│   │   ├── ErrorBoundary.tsx     # Error handling component
│   │   ├── FilterChips.tsx       # Location/department filters
│   │   ├── ListingCard.tsx       # Individual listing display
│   │   ├── Navbar.tsx            # Navigation bar
│   │   └── ParticleBackground.tsx # Dynamic particle effects
│   ├── pages/                    # Page-level components
│   │   ├── AuthPage.tsx          # Authentication page
│   │   ├── CompleteProfilePage.tsx # Profile setup
│   │   ├── DashboardPage.tsx     # Main dashboard with listings
│   │   └── ProfilePage.tsx       # User profile management
│   ├── routes/
│   │   └── ProtectedRoute.tsx    # Route protection for authenticated users
│   ├── services/
│   │   ├── authService.ts        # Authentication logic
│   │   └── firestoreService.js   # Firestore database operations
│   ├── hooks/
│   │   └── useAuth.ts            # Custom auth hook
│   ├── context/
│   │   └── AuthContext.tsx       # Global authentication state
│   ├── firebase/
│   │   ├── config.ts             # Firebase configuration
│   │   └── firebase.js           # Firebase initialization
│   ├── constants/
│   │   └── departments.ts        # Department list constant
│   ├── assets/                   # Static assets
│   ├── App.tsx                   # Main app component
│   ├── main.tsx                  # Application entry point
│   └── style.css                 # Global styles
├── public/                       # Static files
├── index.html                    # HTML entry point
├── package.json                  # Dependencies and scripts
├── tsconfig.json                 # TypeScript configuration
├── tailwind.config.js            # Tailwind CSS configuration
├── postcss.config.js             # PostCSS configuration
├── vercel.json                   # Vercel deployment config
└── README.md                     # This file
```

---

## 🎨 Design System

### Color Palette

- **Primary**: Blue (#1e40af) - Main brand color
- **Accent Colors**: Yellow, Red, Blue, Violet - Used for listing indicators
- **Background**: Dark theme (#0f172a) - Eye-friendly dark interface
- **Text**: White/Gray - High contrast for readability

### Typography

- **Headings**: Bold, sans-serif for hierarchy
- **Body**: Clean, modern fonts with proper spacing
- **Labels**: Medium weight for clarity

### Components

- **Rounded Corners**: 8px border-radius for modern look
- **Shadows**: Subtle shadows for depth
- **Transitions**: Smooth 300ms transitions for interactions
- **Responsive**: Mobile-first design with tablet and desktop breakpoints

### Icons

- All icons from **Lucide React** for consistency
- Properly sized and colored for visual hierarchy

---

## 🔐 Security

### Authentication

- **OAuth 2.0**: Secure Google authentication
- **Session Tokens**: Handled securely by Firebase
- **Protected Routes**: Authenticated routes require valid user session
- **Type Safety**: TypeScript prevents many security vulnerabilities

### Database Security

- **Firestore Rules**: Strict security rules prevent unauthorized access
- **User Isolation**: Users can only access their own data
- **Data Validation**: Server-side validation of all operations

### Best Practices

- **Environment Variables**: Sensitive data stored securely
- **HTTPS Only**: All communications encrypted
- **Network Resilience**: Automatic retry logic for failed requests

---

## 📸 Screenshots

(Add your DSwap screenshots here)

- **Authentication Page**: Professional split layout for sign-in/sign-up
- **Dashboard**: Browse available listings with filters
- **Add Listing Modal**: Create new cash listings
- **Profile Page**: Manage user information and activity history
- **Responsive Design**: Works seamlessly on mobile and desktop

---

## 🚀 Features Roadmap & Future Enhancements

### Upcoming Features

- **In-App Messaging**: Direct messaging between users for transactions
- **Transaction Ratings**: User reviews and rating system (1-5 stars)
- **Transaction Verification**: Confirmation flow for completed deals
- **Advanced Search**: Full-text search with filters and sorting
- **Notifications**: Email and in-app notifications for new messages
- **Favorites**: Save frequently contacted users or listings
- **Analytics Dashboard**: User statistics and trends
- **Mobile App**: Native iOS and Android applications
- **Payment Integration**: Direct payment processing (Stripe/PayPal)
- **Scheduled Listings**: Auto-expire listings after set time
- **Verification Badges**: Verified user badges based on transaction history
- **Report Feature**: Report suspicious users or listings
- **Multi-Language Support**: Support for multiple languages

### Performance Optimizations

- **Code Splitting**: Lazy-load components for faster initial load
- **Image Optimization**: Compress and optimize images
- **Database Indexing**: Optimize Firestore queries
- **Caching Strategy**: Implement service workers for offline support

---

## 🐛 Troubleshooting

### Firebase Config Error

**Issue**: "Firebase configuration error"

- **Solution**: Verify all environment variables are correctly set in `.env`
- Ensure Firebase project is active and not deleted

### Authentication Fails

**Issue**: "Failed to authenticate with Google"

- **Solution**: Check Firebase Console → Authentication → Authorized domains
- Clear browser cache and cookies
- Verify Google OAuth credentials are correct

### Listings Not Loading

**Issue**: "No listings appear on dashboard"

- **Solution**: Check Firestore database connection
- Verify Firestore security rules allow reads
- Check browser console for error messages

### Slow Performance

**Issue**: "App feels sluggish"

- **Solution**: Check network throttling in DevTools
- Verify Firebase region matches your location
- Check for blocking extensions or adblockers

---

## 📞 Support & Contact

For issues, feature requests, or questions:

- **GitHub Issues**: Create an issue on the repository
- **Email**: [Your contact email]

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

The MIT License allows you to:

- ✅ Use for commercial purposes
- ✅ Modify the source code
- ✅ Distribute the software
- ✅ Use privately

With the condition that:

- ✅ Include the original license and copyright notice

---

## 👨‍💻 Author

**Your Name**

- GitHub: [@yourusername](https://github.com/yourusername)
- Email: your.email@example.com
- Portfolio: [Your portfolio URL]

---

## 🙏 Acknowledgments

- Built with [React](https://react.dev) and [Firebase](https://firebase.google.com)
- Styled with [Tailwind CSS](https://tailwindcss.com)
- Deployed on [Vercel](https://vercel.com)
- Icons from [Lucide React](https://lucide.dev)
- Animations by [Framer Motion](https://www.framer.com/motion)

---

## 📊 Project Stats

- **GitHub Stars**: ⭐
- **Contributors**: 1
- **Last Updated**: 2026
- **License**: MIT

---

## 🔗 Useful Links

- [Firebase Documentation](https://firebase.google.com/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Vite Documentation](https://vitejs.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

---

**Happy coding! 🚀**
