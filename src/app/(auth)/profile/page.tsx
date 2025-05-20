
'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Loader2, LogOut, UserCircle2, PackageSearch, PackagePlus, ShieldCheck, Briefcase } from 'lucide-react';
import { useEffect } from 'react';
import Link from 'next/link';

export default function ProfilePage() {
  const { user, userRole, loading, roleLoading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !roleLoading && !user) {
      router.replace('/login?redirect=/profile');
    }
  }, [user, loading, roleLoading, router]);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const getInitials = (email: string | null | undefined) => {
    if (!email) return '??';
    const parts = email.split('@')[0].split(/[\.\s_-]/).filter(Boolean);
    if (parts.length >= 2) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    } else if (parts.length === 1 && parts[0].length >= 2) {
        return parts[0].substring(0, 2).toUpperCase();
    } else if (parts.length === 1) {
        return parts[0][0].toUpperCase();
    }
    return 'U';
   };

  const getRoleIcon = () => {
    switch (userRole) {
      case 'admin': return <ShieldCheck className="h-5 w-5 text-destructive" />;
      case 'seller': return <Briefcase className="h-5 w-5 text-blue-500" />;
      case 'buyer': return <UserCircle2 className="h-5 w-5 text-green-500" />;
      default: return <UserCircle2 className="h-5 w-5 text-muted-foreground" />;
    }
  };


  if (loading || roleLoading || !user) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center items-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="w-full max-w-md mx-auto shadow-lg animate-fadeIn">
        <CardHeader className="text-center items-center">
           <Avatar className="h-20 w-20 mb-4">
             <AvatarFallback className="text-3xl">
               {getInitials(user.email)}
             </AvatarFallback>
           </Avatar>
          <CardTitle className="text-2xl font-bold text-primary">Your Profile</CardTitle>
          <CardDescription>Manage your account details and listings.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
           <div className="flex items-center space-x-3 p-3 border rounded-md">
                <UserCircle2 className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm font-medium">Email:</span>
                <span className="text-sm text-muted-foreground truncate">{user.email}</span>
           </div>
            <div className="flex items-center space-x-3 p-3 border rounded-md">
                {getRoleIcon()}
                <span className="text-sm font-medium">Role:</span>
                <span className="text-sm text-muted-foreground capitalize">{userRole || 'N/A'}</span>
           </div>
            
             <div className="grid grid-cols-1 gap-3 pt-4">
                  {(userRole === 'seller' || userRole === 'admin') && (
                    <>
                      <Link href="/my-products" passHref>
                        <Button variant="outline" className="w-full flex items-center justify-center">
                            <PackageSearch className="mr-2 h-4 w-4" /> My Products
                        </Button>
                      </Link>
                      <Link href="/sell" passHref>
                          <Button variant="outline" className="w-full flex items-center justify-center">
                              <PackagePlus className="mr-2 h-4 w-4" /> List a Product
                          </Button>
                      </Link>
                    </>
                  )}
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
