import Link from 'next/link';
import { ShoppingCart, User, LogOut, LogIn, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";


interface HeaderProps {
  cartItemCount: number;
}

export default function Header({ cartItemCount }: HeaderProps) {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    // Optional: Add toast notification for successful logout
  };

   const getInitials = (email: string | null | undefined) => {
    if (!email) return 'U'; // Default if email is null/undefined
    return email.substring(0, 2).toUpperCase();
   };

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
            <Button variant="ghost" size="icon" className="relative" aria-label="Shopping Cart">
              <ShoppingCart className="h-6 w-6 text-accent" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Button>
          </Link>

           {/* Auth Section */}
           {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                 <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                        {/* Add AvatarImage if user has profile picture URL */}
                         {/* <AvatarImage src={user.photoURL || undefined} alt={user.displayName || user.email || 'User'} /> */}
                        <AvatarFallback>{getInitials(user.email)}</AvatarFallback>
                     </Avatar>
                 </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">Account</p>
                    <p className="text-xs leading-none text-muted-foreground">
                       {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {/* Add links to profile, settings, etc. here */}
                 <DropdownMenuItem>
                   <User className="mr-2 h-4 w-4" />
                   <span>Profile</span> {/* Link to /profile */}
                 </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
           ) : (
            <div className="flex items-center space-x-2">
                <Link href="/login" passHref>
                    <Button variant="ghost" size="sm">
                        <LogIn className="mr-1 h-4 w-4"/> Log In
                    </Button>
                </Link>
                <Link href="/signup" passHref>
                    <Button size="sm">
                        <UserPlus className="mr-1 h-4 w-4"/> Sign Up
                    </Button>
                </Link>
            </div>
           )}
        </nav>
      </div>
    </header>
  );
}
