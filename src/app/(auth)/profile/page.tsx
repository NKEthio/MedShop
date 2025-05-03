'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Loader2, LogOut, UserCircle2 } from 'lucide-react';
import { useEffect } from 'react';
import Link from 'next/link';

export default function ProfilePage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect to login if not authenticated and not loading
    if (!loading && !user) {
      router.replace('/login?redirect=/profile'); // Redirect back to profile after login
    }
  }, [user, loading, router]);

  const handleLogout = async () => {
    await logout();
    router.push('/'); // Redirect to homepage after logout
  };

  const getInitials = (email: string | null | undefined) => {
    if (!email) return '??';
    // More robust initial generation, handles names like "John Doe" or just "john"
    const parts = email.split('@')[0].split(/[\.\s_-]/).filter(Boolean);
    if (parts.length >= 2) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    } else if (parts.length === 1 && parts[0].length >= 2) {
        return parts[0].substring(0, 2).toUpperCase();
    } else if (parts.length === 1) {
        return parts[0][0].toUpperCase();
    }
    return 'U'; // Fallback
   };


  if (loading || !user) {
    // Show loader while checking auth or if redirecting
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center items-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="w-full max-w-md mx-auto shadow-lg">
        <CardHeader className="text-center items-center">
           <Avatar className="h-20 w-20 mb-4">
             {/* Placeholder for user avatar image */}
             {/* <AvatarImage src={user.photoURL || undefined} alt={user.displayName || user.email || 'User'} /> */}
             <AvatarFallback className="text-3xl">
               {getInitials(user.email)}
             </AvatarFallback>
           </Avatar>
          <CardTitle className="text-2xl font-bold text-primary">Your Profile</CardTitle>
          <CardDescription>Manage your account details.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
           <div className="flex items-center space-x-3 p-3 border rounded-md">
                <UserCircle2 className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm font-medium">Email:</span>
                <span className="text-sm text-muted-foreground truncate">{user.email}</span>
           </div>
            {/* Add more profile details here as needed */}
            {/* Example:
             <div className="flex items-center space-x-3 p-3 border rounded-md">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm font-medium">Joined:</span>
                <span className="text-sm text-muted-foreground">{user.metadata.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : 'N/A'}</span>
             </div>
            */}
             <div className="flex flex-col sm:flex-row gap-3 pt-4">
                 <Link href="/sell" passHref className='w-full'>
                     <Button variant="outline" className="w-full">List a Product</Button>
                 </Link>
                 {/* Placeholder for Edit Profile button */}
                 <Button variant="outline" className="w-full" disabled>Edit Profile (Soon)</Button>
             </div>

             <Button variant="destructive" onClick={handleLogout} className="w-full mt-2">
                <LogOut className="mr-2 h-4 w-4" /> Logout
             </Button>
        </CardContent>
      </Card>
    </div>
  );
}
