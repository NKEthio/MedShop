
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck, Crown } from 'lucide-react'; // Changed icon to Crown

export default function AdminDashboardPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="w-full max-w-4xl mx-auto shadow-lg">
        <CardHeader className="text-center items-center">
            <Crown className="h-12 w-12 text-primary mb-4" /> {/* Changed icon */}
            <CardTitle className="text-3xl font-bold text-primary">Owner Dashboard</CardTitle> {/* Changed title */}
            <CardDescription>Manage your MediShop application as the owner.</CardDescription> {/* Changed description */}
        </CardHeader>
        <CardContent className="space-y-6">
           <p className="text-center text-muted-foreground">
             Welcome to the owner area. You have ownership privileges. {/* Changed text */}
           </p>
           {/* Add more owner-specific components and information here */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                 <CardHeader>
                    <CardTitle className="text-lg">User Management</CardTitle>
                 </CardHeader>
                 <CardContent>
                    <p className="text-sm text-muted-foreground">View and manage user accounts (coming soon).</p>
                 </CardContent>
              </Card>
              <Card>
                 <CardHeader>
                    <CardTitle className="text-lg">Product Management</CardTitle>
                 </CardHeader>
                 <CardContent>
                    <p className="text-sm text-muted-foreground">Add, edit, or remove products (coming soon).</p>
                 </CardContent>
              </Card>
               <Card>
                 <CardHeader>
                    <CardTitle className="text-lg">Order Management</CardTitle>
                 </CardHeader>
                 <CardContent>
                    <p className="text-sm text-muted-foreground">View and process customer orders (coming soon).</p>
                 </CardContent>
              </Card>
               <Card>
                 <CardHeader>
                    <CardTitle className="text-lg">Settings</CardTitle>
                 </CardHeader>
                 <CardContent>
                    <p className="text-sm text-muted-foreground">Configure application settings (coming soon).</p>
                 </CardContent>
              </Card>
           </div>
        </CardContent>
      </Card>
    </div>
  );
}
