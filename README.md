# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Configure Firebase:
   - Create a new project in [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication with Google provider
   - Enable Firestore Database
   - Update the `firebaseConfig` in `firebase.ts` with your project credentials
3. Run the app:
   `npm run dev`

## Firebase Configuration

You need to configure Firebase before running the app:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select an existing one
3. Enable Authentication:
   - Go to Authentication > Sign-in method
   - Enable Google provider
   - Add your domain to authorized domains
4. Enable Firestore Database:
   - Go to Firestore Database
   - Create database in production mode
5. Get your config:
   - Go to Project Settings > General
   - Scroll down to "Your apps" section
   - Click on the web icon to create a web app
   - Copy the config object and paste it in `firebase.ts`

## Features

- Firebase Authentication with Google
- Email/Password authentication
- Firestore database for user profiles
- Role-based access control (admin/user)
- Responsive design with Tailwind CSS