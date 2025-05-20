
'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, doc, updateDoc, query, orderBy, Timestamp } from 'firebase/firestore';
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
import { Loader2, FileText, ShieldAlert, PackageSearch } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { Order, OrderStatus } from '@/types';
import { format } from 'date-fns';

// Helper function to format Firestore Timestamp or string date
const formatDate = (dateInput: string | Timestamp | undefined): string => {
  if (!dateInput) return 'N/A';
  if (dateInput instanceof Timestamp) {
    return format(dateInput.toDate(), 'PPpp'); // E.g., Sep 21, 2023, 4:30 PM
  }
  // Attempt to parse if it's a string (ISO format)
  try {
    return format(new Date(dateInput), 'PPpp');
  } catch (e) {
    return 'Invalid Date';
  }
};


export default function OrderManagementPage() {
  const { userRole: adminRole } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const orderStatuses: OrderStatus[] = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const ordersCollectionRef = collection(db, 'orders');
        // Order by 'orderDate' in descending order to show newest first
        const q = query(ordersCollectionRef, orderBy('orderDate', 'desc'));
        const querySnapshot = await getDocs(q);
        const fetchedOrders: Order[] = [];
        querySnapshot.forEach((docSnap) => {
          const data = docSnap.data();
          fetchedOrders.push({
            id: docSnap.id,
            userId: data.userId,
            userEmail: data.userEmail,
            items: data.items,
            shippingAddress: data.shippingAddress,
            totalAmount: data.totalAmount,
            status: data.status,
            orderDate: data.orderDate ? formatDate(data.orderDate as Timestamp) : 'N/A',
            lastUpdated: data.lastUpdated ? formatDate(data.lastUpdated as Timestamp) : 'N/A',
          });
        });
        setOrders(fetchedOrders);
      } catch (e: any) {
        console.error("Error fetching orders: ", e);
        setError("Failed to fetch orders. " + e.message);
        toast({
          title: "Error",
          description: "Could not fetch order data.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (adminRole === 'admin') {
      fetchOrders();
    }
  }, [adminRole, toast]);

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    if (!newStatus || !orderStatuses.includes(newStatus)) {
        toast({ title: "Error", description: "Invalid status selected.", variant: "destructive" });
        return;
    }
    try {
      const orderDocRef = doc(db, 'orders', orderId);
      await updateDoc(orderDocRef, { 
        status: newStatus,
        lastUpdated: serverTimestamp() 
      });
      setOrders(prevOrders =>
        prevOrders.map(o => (o.id === orderId ? { ...o, status: newStatus, lastUpdated: formatDate(new Date()) } : o))
      );
      toast({
        title: "Order Status Updated",
        description: `Order ${orderId} status changed to ${newStatus}.`,
      });
    } catch (e: any) {
      console.error("Error updating order status: ", e);
      toast({
        title: "Error",
        description: "Failed to update order status. " + e.message,
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-muted-foreground">Loading orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <ShieldAlert className="mx-auto h-12 w-12 text-destructive mb-4" />
        <h2 className="text-xl font-semibold text-destructive mb-2">Error Loading Orders</h2>
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
            <FileText className="h-8 w-8 text-primary" />
            <div>
              <CardTitle className="text-2xl font-bold text-primary">Order Management</CardTitle>
              <CardDescription>View and manage customer orders.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <div className="text-center py-16 border border-dashed rounded-lg">
              <PackageSearch className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
              <p className="text-xl text-muted-foreground mb-4">No orders found.</p>
               <p className="text-sm text-muted-foreground">Once customers place orders, they will appear here.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[150px]">Order ID</TableHead>
                    <TableHead className="min-w-[200px]">Customer Email</TableHead>
                    <TableHead className="min-w-[180px]">Order Date</TableHead>
                    <TableHead className="min-w-[100px] text-right">Total</TableHead>
                    <TableHead className="min-w-[150px] text-center">Status</TableHead>
                    <TableHead className="text-right min-w-[180px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium truncate max-w-xs">{order.id}</TableCell>
                      <TableCell className="truncate max-w-xs">{order.userEmail}</TableCell>
                      <TableCell>{order.orderDate}</TableCell>
                      <TableCell className="text-right">${order.totalAmount.toFixed(2)}</TableCell>
                      <TableCell className="text-center capitalize">{order.status}</TableCell>
                      <TableCell className="text-right">
                        <Select
                          value={order.status}
                          onValueChange={(value) => handleStatusChange(order.id, value as OrderStatus)}
                        >
                          <SelectTrigger className="w-[150px] h-9">
                            <SelectValue placeholder="Change status" />
                          </SelectTrigger>
                          <SelectContent>
                            {orderStatuses.map(status => (
                                <SelectItem key={status} value={status}>{status}</SelectItem>
                            ))}
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
