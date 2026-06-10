# DSwap

A modern, responsive frontend-only web application for campus-based digital cash exchange.

## Features

- **Authentication**: Split-layout sign in/sign up with Google integration
- **Dashboard**: Browse cash listings with location filters
- **Add Listings**: Modal form for posting available cash
- **Profile**: User profile management with statistics

## Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Lucide React Icons

## Prerequisites

- Node.js version 20.19+ or 22.12+
- npm

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

## Development

Start the development server:

```bash
npm run dev
```

## Firebase setup

This app requires Firebase configuration values to be available as Vite environment variables.

1. Open Firebase Console and select your project.
2. Go to Project Settings → General.
3. Scroll to Your apps and locate the Firebase SDK configuration.
4. Copy these values into Vercel environment variables or a local `.env` file:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`

5. In Firebase Console, open Authentication → Settings → Authorized domains.
6. Add your deployed Vercel domain, for example `your-app-name.vercel.app`.

If you do not add these values, the app will fail with a Firebase config error.

## Build

Build for production:

```bash
npm run build
```

## Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/         # Page components
├── layouts/       # Layout components
├── hooks/         # Custom React hooks
├── routes/        # Route configurations
├── assets/        # Static assets
└── App.tsx        # Main app component
```

## Design System

- **Colors**: Dark blue primary (#1e40af) with white secondary
- **Typography**: Clean, modern fonts with proper hierarchy
- **Components**: Rounded corners, soft shadows, smooth transitions
- **Responsive**: Mobile-first design with breakpoints

## Note

This is a frontend-only application. Backend integration (Firebase) can be added later to the existing structure.
