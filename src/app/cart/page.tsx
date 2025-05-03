'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/hooks/useCart';
import CartItemCard from '@/components/CartItemCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Loader2, ShoppingCart } from 'lucide-react';
import { useRouter } from 'next/navigation'; // Use next/navigation for App Router

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, clearCart, cartTotal, isCartInitialized } = useCart();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);


  const handleCheckout = () => {
    // Navigate to the checkout page
    router.push('/checkout');
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
      <h1 className="text-3xl font-bold mb-8 text-primary">Your Shopping Cart</h1>
      {cartItems.length === 0 ? (
        <div className="text-center py-16">
          <ShoppingCart className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
          <p className="text-xl text-muted-foreground mb-4">Your cart is empty.</p>
          <Link href="/products" passHref>
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      ) : (
        // Use flexbox for better control on small screens, revert to grid on larger screens
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart items take full width on small screens, 2/3 on large */}
          <div className="flex-grow lg:w-2/3">
            {cartItems.map((item) => (
              <CartItemCard
                key={item.id}
                item={item}
                onQuantityChange={updateQuantity}
                onRemove={removeFromCart}
              />
            ))}
             <div className="mt-4 flex justify-end">
                <Button variant="outline" onClick={clearCart}>Clear Cart</Button>
             </div>
          </div>
          {/* Order summary takes full width on small screens, 1/3 on large */}
          <div className="lg:w-1/3">
             {/* Make summary card sticky on large screens only */}
            <Card className="shadow-lg lg:sticky top-24">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
                 <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Tax</span>
                  <span>Calculated at checkout</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={handleCheckout}>
                  Proceed to Checkout
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
