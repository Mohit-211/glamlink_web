// Client-side Firebase wrapper with better error handling
import { app, auth, db, storage } from './firebase';
import { FirebaseApp } from 'firebase/app';
import { Auth } from 'firebase/auth';
import { Firestore } from 'firebase/firestore';
import { FirebaseStorage } from 'firebase/storage';

export const isFirebaseInitialized = () => {
  return !!(app && auth && db && storage);
};

export const getFirebaseError = () => {
  if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
    return 'Firebase API Key is not set. Please check your .env file.';
  }
  if (!process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN) {
    return 'Firebase Auth Domain is not set. Please check your .env file.';
  }
  if (!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
    return 'Firebase Project ID is not set. Please check your .env file.';
  }
  if (!app) {
    return 'Firebase app failed to initialize. Check the browser console for errors.';
  }
  return null;
};

// Export initialized services with fallback warnings
export const firebaseAuth = auth as Auth | null;
export const firebaseDb = db as Firestore | null;
export const firebaseStorage = storage as FirebaseStorage | null;

