
'use client';

import type { ReactNode } from 'react';
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getAuth, onAuthStateChanged, type User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { app, db } from '@/lib/firebase'; // Import initialized Firebase app and db
import { Loader2 } from 'lucide-react';
import type { UserRole } from '@/types';

interface AuthContextType {
  user: User | null;
  loading: boolean; // Initial auth state loading
  userRole: UserRole;
  roleLoading: boolean; // Loading state for role check
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // For initial auth check
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [roleLoading, setRoleLoading] = useState<boolean>(true); // Start loading role status
  const auth = getAuth(app); // Get auth instance

  const fetchUserRole = useCallback(async (uid: string) => {
    setRoleLoading(true);
    setUserRole(null); // Reset role status before check
    console.log("Fetching user role for UID:", uid);

    if (!uid) {
      setUserRole('buyer'); // Default to buyer if no UID
      setRoleLoading(false);
      return;
    }

    try {
      // 1. Check 'admins' collection (for 'admin' role primarily)
      const adminDocRef = doc(db, 'admins', uid);
      const adminDocSnap = await getDoc(adminDocRef);
      if (adminDocSnap.exists()) {
        console.log("User is admin (from admins collection).");
        setUserRole('admin');
        setRoleLoading(false);
        return;
      }

      // 2. If not in 'admins', check 'users' collection for a 'role' field
      const userDocRef = doc(db, 'users', uid);
      const userDocSnap = await getDoc(userDocRef);
      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        if (userData && userData.role && ['admin', 'seller', 'buyer'].includes(userData.role)) {
          console.log(`User role from users collection: ${userData.role}`);
          setUserRole(userData.role as UserRole);
        } else {
          console.log("User document exists but no valid role field, defaulting to buyer.");
          setUserRole('buyer'); // Default if role field is missing or invalid
        }
      } else {
        // 3. If no document in 'users' collection, default to 'buyer'
        console.log("User not found in admins or users collection, defaulting to buyer.");
        setUserRole('buyer');
      }
    } catch (error) {
      console.error("Error fetching user role:", error);
      setUserRole('buyer'); // Default to buyer on error
    } finally {
      setRoleLoading(false);
    }
  }, []);


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setLoading(false); // Initial auth check finished

      if (currentUser) {
        await fetchUserRole(currentUser.uid);
      } else {
        setUserRole(null);
        setRoleLoading(false); 
      }
    });

    return () => unsubscribe();
  }, [auth, fetchUserRole]);

  const logout = async () => {
    setLoading(true); 
    setRoleLoading(true); 
    setUserRole(null); 
    try {
      await auth.signOut();
      setUser(null); 
    } catch (error) {
      console.error("Error signing out: ", error);
    } finally {
      setLoading(false);
      setRoleLoading(false); 
    }
  };

  if (loading || (user && roleLoading)) {
    return (
        <div className="flex justify-center items-center min-h-screen">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, loading, userRole, roleLoading, logout }}>
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
