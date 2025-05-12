
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useRouter } from 'next/navigation';
import { processPayment, type PaymentInfo } from '@/services/payment';
import { toast } from "@/hooks/use-toast";
import Image from 'next/image';
import { Loader2 } from 'lucide-react';

// Zod schema for form validation
const checkoutSchema = z.object({
  // Shipping Information
  fullName: z.string().min(2, { message: 'Full name must be at least 2 characters.' }),
  address: z.string().min(5, { message: 'Address must be at least 5 characters.' }),
  city: z.string().min(2, { message: 'City must be at least 2 characters.' }),
  state: z.string().min(2, { message: 'State must be at least 2 characters.' }),
  zip: z.string().regex(/^\d{5}(-\d{4})?$/, { message: 'Invalid ZIP code format.' }),
  email: z.string().email({ message: 'Invalid email address.' }),
  phone: z.string().regex(/^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/, { message: 'Invalid phone number format.' }),

  // Payment Information (Simplified for example)
  cardNumber: z.string().regex(/^\d{16}$/, { message: 'Invalid card number (must be 16 digits).' }),
  expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, { message: 'Invalid expiry date (MM/YY).' }),
  cvv: z.string().regex(/^\d{3,4}$/, { message: 'Invalid CVV (must be 3 or 4 digits).' }),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const { cartItems, cartTotal, clearCart, isCartInitialized } = useCart();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);


  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: '',
      address: '',
      city: '',
      state: '',
      zip: '',
      email: '',
      phone: '',
      cardNumber: '',
      expiryDate: '',
      cvv: '',
    },
  });

  // Redirect if cart is empty and initialized on client
   useEffect(() => {
    if (isClient && isCartInitialized && cartItems.length === 0) {
      toast({
          title: "Cart Empty",
          description: "Your cart is empty. Redirecting to products.",
          variant: "destructive",
      });
      router.replace('/products');
    }
   }, [isClient, isCartInitialized, cartItems, router]);


  const onSubmit = async (data: CheckoutFormData) => {
    setIsProcessing(true);
    console.log('Checkout Data:', data);

    const paymentInfo: PaymentInfo = {
      amount: cartTotal,
      currency: 'USD', // Assuming USD
      method: 'credit card', // Simplified
      // In a real app, you'd pass more detailed, tokenized payment data
    };

    try {
      const paymentSuccessful = await processPayment(paymentInfo);

      if (paymentSuccessful) {
        // Simulate sending order to admin email
        const orderDetailsForAdmin = {
          customerInfo: data,
          items: cartItems.map(item => ({
            id: item.id,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            total: item.price * item.quantity,
          })),
          orderTotal: cartTotal,
          orderDate: new Date().toISOString(),
        };
        console.log("SIMULATING SENDING ORDER TO ADMIN: info1079net@gmail.com");
        console.log("Order Details:", JSON.stringify(orderDetailsForAdmin, null, 2));
        // In a real app, you would call an API endpoint here to send an email.
        // Example: await fetch('/api/send-order-email', { method: 'POST', body: JSON.stringify(orderDetailsForAdmin) });


        toast({
          title: "Payment Successful!",
          description: "Your order has been placed.",
        });
        clearCart();
        router.push('/order-confirmation'); // Redirect to a confirmation page
      } else {
        throw new Error('Payment processing failed.');
      }
    } catch (error) {
       console.error('Checkout Error:', error);
       toast({
          title: "Checkout Failed",
          description: "There was an issue processing your payment. Please try again.",
          variant: "destructive",
       });
    } finally {
       setIsProcessing(false);
    }
  };

    // Render loading state or placeholder until client-side hydration and cart initialization
    if (!isClient || !isCartInitialized) {
       return (
          <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[calc(100vh-200px)]">
               <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
       );
    }


  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-primary">Checkout</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Shipping & Payment Form */}
        <div className="lg:col-span-2">
          <Card className="shadow-lg">
             <CardHeader>
                <CardTitle>Shipping & Payment Information</CardTitle>
             </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                   {/* Shipping Details */}
                   <h3 className="text-lg font-semibold border-b pb-2 mb-4">Shipping Address</h3>
                   {/* Improved responsiveness for name/email fields */}
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                       <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="John Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                        <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="john.doe@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                   </div>

                    <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Street Address</FormLabel>
                            <FormControl>
                              <Input placeholder="123 Main St" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    {/* Improved responsiveness for city/state/zip */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                       <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City</FormLabel>
                            <FormControl>
                              <Input placeholder="Anytown" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                       <FormField
                        control={form.control}
                        name="state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>State</FormLabel>
                            <FormControl>
                              <Input placeholder="CA" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="zip"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>ZIP Code</FormLabel>
                            <FormControl>
                              <Input placeholder="90210" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <Input type="tel" placeholder="123-456-7890" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                    {/* Payment Details */}
                     <h3 className="text-lg font-semibold border-b pb-2 mb-4 pt-4">Payment Details</h3>
                      <FormField
                        control={form.control}
                        name="cardNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Card Number</FormLabel>
                            <FormControl>
                              <Input placeholder="**** **** **** 1234" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                     {/* Improved responsiveness for expiry/cvv */}
                     <div className="grid grid-cols-2 gap-4">
                       <FormField
                        control={form.control}
                        name="expiryDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Expiry Date (MM/YY)</FormLabel>
                            <FormControl>
                              <Input placeholder="MM/YY" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                       <FormField
                        control={form.control}
                        name="cvv"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>CVV</FormLabel>
                            <FormControl>
                              <Input placeholder="123" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                     </div>

                  <Button type="submit" className="w-full mt-6" disabled={isProcessing}>
                    {isProcessing ? (
                      <>
                       <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                       Processing...
                      </>
                    ) : (
                       `Place Order - $${cartTotal.toFixed(2)}`
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24 shadow-lg">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              {cartItems.length > 0 ? (
                // Added responsive max-height
                <div className="space-y-4 max-h-64 sm:max-h-96 overflow-y-auto pr-2">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center space-x-3 border-b pb-2 last:border-b-0 last:pb-0">
                       {/* Responsive image size */}
                      <div className="relative w-12 h-12 sm:w-16 sm:h-16 flex-shrink-0">
                         <Image
                            src={item.imageUrl}
                            alt={item.name}
                            fill
                            sizes="(max-width: 640px) 48px, 64px"
                            style={{ objectFit: 'cover' }}
                            className="rounded-md"
                            data-ai-hint={item.dataAiHint}
                          />
                      </div>
                      <div className="flex-grow">
                         {/* Adjusted text sizes for responsiveness */}
                        <p className="text-xs sm:text-sm font-medium">{item.name}</p>
                        <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                       {/* Adjusted text sizes for responsiveness */}
                      <p className="text-xs sm:text-sm font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">Your cart is empty.</p>
              )}
               <Separator className="my-4" />
                 {/* Adjusted text sizes for responsiveness */}
                 <div className="space-y-2 text-sm sm:text-base">
                    <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>${cartTotal.toFixed(2)}</span>
                    </div>
                    {/* Add potential shipping/tax calculation here */}
                    <div className="flex justify-between">
                        <span>Shipping</span>
                        <span>$0.00</span> {/* Placeholder */}
                    </div>
                     <div className="flex justify-between">
                        <span>Tax</span>
                        <span>$0.00</span> {/* Placeholder */}
                    </div>
                 </div>
               <Separator className="my-4" />
                {/* Adjusted text sizes for responsiveness */}
               <div className="flex justify-between font-bold text-base sm:text-lg">
                  <span>Total</span>
                  <span>${cartTotal.toFixed(2)}</span>
               </div>
            </CardContent>
              <CardFooter>
                  {/* Footer might contain secure payment icons or trust badges */}
              </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}


    