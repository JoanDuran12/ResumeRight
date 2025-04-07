'use client';

import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  getRedirectResult,
  deleteUser
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Add this flag at the top to track if a popup is already open
let isAuthPopupOpen = false;

const signInWithGoogle = async () => {
  if (typeof window !== 'undefined') {
    // Check if a popup is already open to prevent multiple requests
    if (isAuthPopupOpen) {
      console.warn("Authentication popup is already open");
      return false;
    }
    
    try {
      isAuthPopupOpen = true;
      const result = await signInWithPopup(auth, googleProvider);
      isAuthPopupOpen = false;
      return true;
    } catch (error: any) {
      isAuthPopupOpen = false;
      
      // Handle specific Firebase auth errors
      if (error.code === 'auth/cancelled-popup-request' || 
          error.code === 'auth/popup-closed-by-user') {
        console.log("Authentication popup was closed by the user");
        return false;
      }
      
      // Handle all other errors
      console.error("Error during Google sign-in:", error);
      throw error; // Re-throw to allow proper error handling in components
    }
  }
  throw new Error('Firebase auth not initialized or not in browser environment');
};

const handleRedirectResult = async () => {
  if (typeof window !== 'undefined') {
    try {
      const result = await getRedirectResult(auth);
      if (result) {
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error handling redirect result:", error);
      return false;
    }
  }
  return false;
};

const deleteUserAccount = async () => {
  if (typeof window !== 'undefined') {
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        await deleteUser(currentUser);
        return true;
      } else {
        throw new Error('No user is currently signed in');
      }
    } catch (error) {
      console.error("Error deleting user account:", error);
      return false;
    }
  }
  throw new Error('Firebase auth not initialized or not in browser environment');
};

export { app, auth, db, signInWithGoogle, handleRedirectResult, deleteUserAccount};