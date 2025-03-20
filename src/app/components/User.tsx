'use client'

import React, { useState } from 'react';
import { IconLogout, IconTrash, IconUser, IconAlertTriangle, IconX } from '@tabler/icons-react';
import { useAuth } from "@/app/contexts/AuthContext";
import { useTheme } from "@/app/contexts/ThemeContext";

const User = () => {
  const { user, logout, deleteAccount } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  
  const handleSignOut = async () => {
    try {
      await logout();
      // Redirection is handled in the AuthContext
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };
  
  const handleDeleteAccount = async () => {
    try {
      setIsDeleting(true);
      setDeleteError('');
      
      const success = await deleteAccount();
      
      if (!success) {
        throw new Error("Failed to delete account");
      }
      
      // Redirection is handled in the AuthContext
    } catch (error) {
      console.error("Error deleting account:", error);
      setDeleteError('There was an error deleting your account. Please try again later.');
    } finally {
      setIsDeleting(false);
    }
  };

  if (!user) {
    return <div className="max-w-2xl mx-auto p-6">Loading user information...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6 rounded-lg shadow-sm m-8" style={{ background: 'var(--background)', color: 'var(--foreground)' }}>
      <h2 className="text-2xl font-semibold mb-6">User Profile</h2>
      
      {/* User Info Section */}
      <div className="flex items-center mb-8 pb-6 border-b border-opacity-20" style={{ borderColor: 'var(--foreground)' }}>
        <div className="w-16 h-16 rounded-full mr-4 flex items-center justify-center overflow-hidden" 
             style={{ background: 'var(--foreground)', color: 'var(--background)' }}>
          {user.photoURL ? (
            <img 
              src={user.photoURL} 
              alt="Profile" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <IconUser size={32} />
          )}
        </div>
        <div>
          <h3 className="font-medium text-lg">{user.displayName || 'User'}</h3>
          <p className="opacity-70">{user.email}</p>
        </div>
      </div>
      
      {/* Preferences Section */}
      <div className="mb-8 pb-6 border-b border-opacity-20" style={{ borderColor: 'var(--foreground)' }}>
        <h3 className="font-medium text-lg mb-4">Preferences</h3>
        {/* Theme Toggle */}
        <div className="flex items-center justify-between mb-4 border rounded-md p-4" 
             style={{ background: `rgba(var(--foreground-rgb), 0.05)` }}>
          <span>Theme</span>
          <div className="flex items-center">
            <span className="px-2 text-sm">Light</span>
            <button 
              onClick={toggleTheme}
              className="relative inline-flex h-6 w-11 items-center rounded-full"
              style={{ 
                background: theme === 'dark' ? 'var(--foreground)' : '#e5e5e5',
                border: '1px solid rgba(0,0,0,0.1)'
              }}
            >
              <span 
                className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out shadow-sm"
                style={{ 
                  transform: theme === 'dark' ? 'translateX(24px)' : 'translateX(2px)'
                }}
              />
            </button>
            <span className="px-2 text-sm">Dark</span>
          </div>
        </div>
      </div>
      
      {/* Account Actions */}
      <div>
        <h3 className="font-medium text-lg mb-4">Account Actions</h3>
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
          <button 
            onClick={handleSignOut}
            className="px-4 py-2 rounded transition flex items-center gap-2"
            style={{ 
              background: 'rgba(var(--foreground-rgb), 0.1)', 
              color: 'var(--foreground)' 
            }}
          >
            <IconLogout size={18} />
            Sign Out
          </button>
          <button 
            onClick={() => setIsDeleteDialogOpen(true)}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition flex items-center gap-2"
          >
            <IconTrash size={18} />
            Delete Account
          </button>
        </div>
      </div>
      
      {/* Custom Delete Account Confirmation Dialog */}
      {isDeleteDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="rounded-lg max-w-md w-full p-6 shadow-lg" 
               style={{ background: 'var(--background)', color: 'var(--foreground)' }}>
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                <IconAlertTriangle size={24} className="text-red-500" />
                <h3 className="text-lg font-semibold">Are you absolutely sure?</h3>
              </div>
              <button 
                onClick={() => setIsDeleteDialogOpen(false)}
                className="opacity-70 hover:opacity-100"
              >
                <IconX size={20} />
              </button>
            </div>
            
            <div className="mb-6">
              <p className="opacity-70">
                This action cannot be undone. This will permanently delete your account and remove all
                your data from our servers.
              </p>
              
              {deleteError && (
                <div className="mt-4 p-3 bg-red-100 text-red-800 rounded">
                  {deleteError}
                </div>
              )}
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsDeleteDialogOpen(false)}
                className="px-4 py-2 rounded transition"
                style={{ 
                  background: 'rgba(var(--foreground-rgb), 0.1)', 
                  color: 'var(--foreground)' 
                }}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition flex items-center gap-2"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span className="ml-2">Deleting...</span>
                  </>
                ) : (
                  <>
                    <IconTrash size={18} />
                    Delete Account
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default User;