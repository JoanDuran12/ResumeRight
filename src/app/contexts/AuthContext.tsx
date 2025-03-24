'use client';

import React, { createContext, useState, useEffect, useContext, ReactNode, useMemo } from 'react';
import { onAuthStateChanged, signOut, User, deleteUser } from 'firebase/auth';
import { auth, signInWithGoogle as firebaseSignInWithGoogle } from '@/app/firebase/config';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  loginWithGoogle: () => Promise<boolean>;
  logout: () => Promise<boolean>;
  deleteAccount: () => Promise<boolean>;
}

const AUTH_LOGOUT_EVENT = 'auth-logout-event';
const AUTH_DELETION_EVENT = 'auth-deletion-event';

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  loginWithGoogle: () => Promise.resolve(false),
  logout: () => Promise.resolve(false),
  deleteAccount: () => Promise.resolve(false)
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    // Listen for logout events from other tabs
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === AUTH_LOGOUT_EVENT || event.key === AUTH_DELETION_EVENT) {
        router.push('/');
      }
    };

    // Add event listener for localStorage changes (for cross-tab communication)
    window.addEventListener('storage', handleStorageChange);

    return () => {
      unsubscribe();
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [router]);

  const loginWithGoogle = async (): Promise<boolean> => {
    try {
      await firebaseSignInWithGoogle();
      return true;
    } catch (error) {
      console.error('Google login error:', error);
      return false;
    }
  };

  const logout = async (): Promise<boolean> => {
    try {
      await signOut(auth);
      
      // Broadcast logout event to other tabs
      localStorage.setItem(AUTH_LOGOUT_EVENT, Date.now().toString());
      // Remove the item immediately so future logouts will also trigger the event
      localStorage.removeItem(AUTH_LOGOUT_EVENT);
      
      router.push('/');
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      return false;
    }
  };

  const deleteAccount = async (): Promise<boolean> => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error('No user is currently signed in');
      }

      // Here you would add code to delete user data from your database
      // For example: await deleteDoc(doc(db, 'users', currentUser.uid));
      
      await deleteUser(currentUser);
      
      // Broadcast account deletion event to other tabs
      localStorage.setItem(AUTH_DELETION_EVENT, Date.now().toString());
      // Remove the item immediately so future deletions will also trigger the event
      localStorage.removeItem(AUTH_DELETION_EVENT);
      
      router.push('/');
      return true;
    } catch (error) {
      console.error('Account deletion error:', error);
      return false;
    }
  };

  const value = useMemo<AuthContextType>(() => ({
    user,
    loading,
    loginWithGoogle,
    logout,
    deleteAccount
  }), [user, loading, router]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => useContext(AuthContext);

export default AuthContext;