import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCWUVqyD_oEOeQ8TLM21WQiM5cR-nmSi30",
    authDomain: "resumeright-7b242.firebaseapp.com",
    projectId: "resumeright-7b242",
    storageBucket: "resumeright-7b242.firebasestorage.app",
    messagingSenderId: "996099157912",
    appId: "1:996099157912:web:ead704a9f6a1bea23ec5ed",
    measurementId: "G-8TB2SRZLCH"
}

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