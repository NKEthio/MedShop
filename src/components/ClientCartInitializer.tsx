'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { useCart } from '@/hooks/useCart';

// Note: This component now mainly serves to ensure Header renders client-side
// for hooks like useCart and useAuth to work correctly.
export default function ClientCartInitializer() {
  const { cartItemCount, isCartInitialized } = useCart();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // This ensures the component only renders on the client after mounting
    setIsClient(true);
  }, []);

  // Render Header regardless of client/init status now,
  // as Header itself handles auth loading state.
  // Pass the cart count, handling the case where it's not ready.
  return <Header cartItemCount={isClient && isCartInitialized ? cartItemCount : 0} />;
}
