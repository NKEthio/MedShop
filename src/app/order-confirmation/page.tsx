'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function OrderConfirmationPage() {
  return (
    <div className="container mx-auto px-4 py-16 flex justify-center items-center min-h-[calc(100vh-200px)]">
      <Card className="w-full max-w-md text-center shadow-lg">
        <CardHeader>
          <CheckCircle2 className="mx-auto h-16 w-16 text-green-500 mb-4" />
          <CardTitle className="text-2xl font-bold text-primary">Order Confirmed!</CardTitle>
          <CardDescription>Thank you for your purchase.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-6">
            Your order has been successfully placed. You will receive an email confirmation shortly.
          </p>
          <Link href="/products" passHref>
            <Button>Continue Shopping</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
