'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { useCart } from '@/hooks/useCart';

export default function ClientCartInitializer() {
  const { cartItemCount, isCartInitialized } = useCart();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // This ensures the component only renders on the client after mounting
    setIsClient(true);
  }, []);

  // Render Header only on the client side after the cart state is initialized
  if (!isClient || !isCartInitialized) {
    // Render a placeholder or the header with 0 items during SSR/initial load
    return <Header cartItemCount={0} />;
  }

  return <Header cartItemCount={cartItemCount} />;
}
