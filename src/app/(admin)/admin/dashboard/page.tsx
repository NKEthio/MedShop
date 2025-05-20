
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Crown, Users, Package, Settings, FileText } from 'lucide-react';

export default function AdminDashboardPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="w-full max-w-4xl mx-auto shadow-lg animate-fadeIn">
        <CardHeader className="text-center items-center">
            <Crown className="h-12 w-12 text-primary mb-4" />
            <CardTitle className="text-3xl font-bold text-primary">Owner Dashboard</CardTitle>
            <CardDescription>Manage your MediShop application as the owner.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
           <p className="text-center text-muted-foreground">
             Welcome to the owner area. You have ownership privileges.
           </p>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                 <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-lg font-medium">User Management</CardTitle>
                    <Users className="h-5 w-5 text-muted-foreground" />
                 </CardHeader>
                 <CardContent>
                    <p className="text-sm text-muted-foreground">View and manage user accounts and roles.</p>
                    <Link href="/admin/users" passHref>
                      <Button variant="outline" className="mt-3 w-full">Manage Users</Button>
                    </Link>
                 </CardContent>
              </Card>
              <Card>
                 <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-lg font-medium">Product Management</CardTitle>
                    <Package className="h-5 w-5 text-muted-foreground" />
                 </CardHeader>
                 <CardContent>
                    <p className="text-sm text-muted-foreground">View, edit, or remove all products listed on the platform.</p>
                    <Link href="/my-products" passHref>
                      <Button variant="outline" className="mt-3 w-full">Manage Products</Button>
                    </Link>
                 </CardContent>
              </Card>
               <Card>
                 <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-lg font-medium">Order Management</CardTitle>
                    <FileText className="h-5 w-5 text-muted-foreground" />
                 </CardHeader>
                 <CardContent>
                    <p className="text-sm text-muted-foreground">View and manage customer orders.</p>
                     <Link href="/admin/orders" passHref>
                        <Button variant="outline" className="mt-3 w-full">Manage Orders</Button>
                     </Link>
                 </CardContent>
              </Card>
               <Card>
                 <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-lg font-medium">Application Settings</CardTitle>
                    <Settings className="h-5 w-5 text-muted-foreground" />
                 </CardHeader>
                 <CardContent>
                    <p className="text-sm text-muted-foreground">Configure application-wide settings (coming soon).</p>
                    {/* <Button variant="outline" className="mt-3 w-full" disabled>Configure Settings</Button> */}
                 </CardContent>
              </Card>
           </div>
        </CardContent>
      </Card>
    </div>
  );
}
