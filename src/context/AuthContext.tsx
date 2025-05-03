'use client';

import type { ReactNode } from 'react';
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getAuth, onAuthStateChanged, type User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { app, db } from '@/lib/firebase'; // Import initialized Firebase app and db
import { Loader2 } from 'lucide-react';

interface AuthContextType {
  user: User | null;
  loading: boolean; // Initial auth state loading
  isAdmin: boolean;
  isAdminLoading: boolean; // Loading state for admin check
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // For initial auth check
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isAdminLoading, setIsAdminLoading] = useState<boolean>(true); // Start loading admin status
  const auth = getAuth(app); // Get auth instance

  const checkAdminStatus = useCallback(async (uid: string) => {
    setIsAdminLoading(true);
    setIsAdmin(false); // Reset admin status before check
    console.log("Checking admin status for UID:", uid); // Debug log
    if (!uid) {
        setIsAdminLoading(false);
        return;
    }
    try {
      const adminDocRef = doc(db, 'admins', uid); // Check document in 'admins' collection with user's UID
      const adminDocSnap = await getDoc(adminDocRef);
      if (adminDocSnap.exists()) {
         console.log("User is admin."); // Debug log
        // Optionally check for a specific field like `isAdmin: true`
        // const data = adminDocSnap.data();
        // if (data && data.isAdmin === true) {
        //   setIsAdmin(true);
        // } else {
        //    setIsAdmin(false); // Document exists but doesn't confirm admin role
        // }
         setIsAdmin(true); // Document existence is enough for this example
      } else {
         console.log("User is not admin."); // Debug log
         setIsAdmin(false);
      }
    } catch (error) {
      console.error("Error checking admin status:", error);
      setIsAdmin(false); // Assume not admin if error occurs
    } finally {
      setIsAdminLoading(false);
    }
  }, []);


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setLoading(false); // Initial auth check finished

      if (currentUser) {
        // If user is logged in, check their admin status
        await checkAdminStatus(currentUser.uid);
      } else {
        // If user is logged out, reset admin status
        setIsAdmin(false);
        setIsAdminLoading(false); // No admin check needed
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [auth, checkAdminStatus]);

  const logout = async () => {
    setLoading(true); // Use general loading state for logout process
    setIsAdminLoading(true); // Reset admin loading state
    setIsAdmin(false); // Reset admin status immediately
    try {
      await auth.signOut();
      setUser(null); // Explicitly set user to null on logout
    } catch (error) {
      console.error("Error signing out: ", error);
      // Handle logout error (e.g., show toast)
    } finally {
      setLoading(false);
      setIsAdminLoading(false); // Ensure loading states are reset
    }
  };

  // Show loading indicator while checking initial auth state OR admin status
  if (loading || (user && isAdminLoading)) {
    return (
        <div className="flex justify-center items-center min-h-screen">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, isAdminLoading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
