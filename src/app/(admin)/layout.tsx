
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading: authLoading, userRole, roleLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const isLoading = authLoading || roleLoading;
    // If finished loading and user is not logged in OR not an admin, redirect
    if (!isLoading && (!user || userRole !== 'admin')) {
      console.log("Redirecting: Not admin or not logged in", { isLoading, user, userRole }); // Debug log
      router.replace('/'); // Redirect to home page
    }
  }, [user, authLoading, userRole, roleLoading, router]);

  // Show loader while checking auth state or admin status
  if (authLoading || roleLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  // If user is logged in and is an admin, render the children (admin pages)
  if (user && userRole === 'admin') {
    return <>{children}</>;
  }

  // Fallback: Should be redirected by useEffect, but good to have a null render
  return null;
}
