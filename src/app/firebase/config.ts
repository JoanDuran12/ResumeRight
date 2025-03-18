import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

if (typeof window !== 'undefined') {
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
}

export const auth = typeof window !== 'undefined' ? firebase.auth() : null;

const provider = typeof window !== 'undefined' ? new firebase.auth.GoogleAuthProvider() : null;
if (provider) {
    provider.setCustomParameters({ prompt: 'select_account' });
}

export const signInWithGoogle = () => {
    if (auth && provider) {
        return auth.signInWithRedirect(provider);
    }
    throw new Error('Firebase auth not initialized');
};

export default firebase;