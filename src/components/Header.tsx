import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  cartItemCount: number;
}

export default function Header({ cartItemCount }: HeaderProps) {
  return (
    <header className="bg-secondary shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-primary">
          MediShop
        </Link>
        <nav className="flex items-center space-x-4">
          <Link href="/products" className="text-foreground hover:text-accent transition-colors">
            Products
          </Link>
          <Link href="/cart" passHref>
            <Button variant="ghost" size="icon" aria-label="Shopping Cart">
              <ShoppingCart className="h-6 w-6 text-accent" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}
