
'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, Users, ShieldAlert } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { UserRole } from '@/types';

interface ManagedUser {
  uid: string;
  email?: string; 
  role: UserRole;
}

export default function UserManagementPage() {
  const { userRole: adminRole } = useAuth();
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const usersCollectionRef = collection(db, 'users');
        const querySnapshot = await getDocs(usersCollectionRef);
        const fetchedUsers: ManagedUser[] = [];
        querySnapshot.forEach((docSnap) => {
          const data = docSnap.data();
          fetchedUsers.push({
            uid: docSnap.id,
            email: data.email || 'N/A', 
            role: data.role || 'buyer', 
          });
        });
        setUsers(fetchedUsers);
      } catch (e: any) {
        console.error("Error fetching users: ", e);
        setError("Failed to fetch users. " + e.message);
        toast({
          title: "Error",
          description: "Could not fetch user data.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (adminRole === 'admin') {
      fetchUsers();
    }
  }, [adminRole]);

  const handleRoleChange = async (uid: string, newRole: UserRole) => {
    if (!newRole || !['admin', 'seller', 'buyer'].includes(newRole)) {
        toast({ title: "Error", description: "Invalid role selected.", variant: "destructive" });
        return;
    }
    try {
      const userDocRef = doc(db, 'users', uid);
      await updateDoc(userDocRef, { role: newRole });
      setUsers(prevUsers =>
        prevUsers.map(u => (u.uid === uid ? { ...u, role: newRole } : u))
      );
      toast({
        title: "Role Updated",
        description: `User's role changed to ${newRole}.`,
      });
    } catch (e: any) {
      console.error("Error updating role: ", e);
      toast({
        title: "Error",
        description: "Failed to update user role. " + e.message,
        variant: "destructive",
      });
    }
  };


  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-muted-foreground">Loading users...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <ShieldAlert className="mx-auto h-12 w-12 text-destructive mb-4" />
        <h2 className="text-xl font-semibold text-destructive mb-2">Error Loading Users</h2>
        <p className="text-muted-foreground">{error}</p>
        <Button onClick={() => window.location.reload()} className="mt-4">Try Again</Button>
      </div>
    );
  }
  
  if (adminRole !== 'admin') {
    return (
        <div className="container mx-auto px-4 py-12 text-center">
            <ShieldAlert className="mx-auto h-12 w-12 text-destructive mb-4" />
            <h2 className="text-xl font-semibold text-destructive mb-2">Access Denied</h2>
            <p className="text-muted-foreground">You do not have permission to view this page.</p>
        </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="w-full shadow-lg animate-fadeIn">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <Users className="h-8 w-8 text-primary" />
            <div>
              <CardTitle className="text-2xl font-bold text-primary">User Management</CardTitle>
              <CardDescription>View and manage user accounts and their roles.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {users.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No users found in the 'users' collection.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[200px]">User ID</TableHead>
                    <TableHead className="min-w-[200px]">Email</TableHead>
                    <TableHead className="min-w-[100px]">Role</TableHead>
                    <TableHead className="text-right min-w-[150px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.uid}>
                      <TableCell className="font-medium truncate max-w-xs">{user.uid}</TableCell>
                      <TableCell className="truncate max-w-xs">{user.email || 'N/A'}</TableCell>
                      <TableCell className="capitalize">{user.role}</TableCell>
                      <TableCell className="text-right">
                        <Select
                          value={user.role || 'buyer'}
                          onValueChange={(value) => handleRoleChange(user.uid, value as UserRole)}
                        >
                          <SelectTrigger className="w-[120px] h-9">
                            <SelectValue placeholder="Change role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="buyer">Buyer</SelectItem>
                            <SelectItem value="seller">Seller</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

