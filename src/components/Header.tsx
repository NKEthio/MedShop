import Link from 'next/link';
import { ShoppingCart, User, LogOut, LogIn, UserPlus, Menu, PackagePlus, Store } from 'lucide-react'; // Added Menu, PackagePlus, Store icons
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"; // Added Sheet components
import { Separator } from '@/components/ui/separator'; // Import Separator


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
        <Link href="/" className="text-xl sm:text-2xl font-bold text-primary flex items-center gap-2">
           <Store className="h-6 w-6" /> {/* Added Store icon */}
          MediShop
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-4">
          <Link href="/products" className="text-foreground hover:text-accent transition-colors">
            Products
          </Link>
          {/* Add Sell link for logged-in users */}
          {user && (
            <Link href="/sell" className="text-foreground hover:text-accent transition-colors flex items-center gap-1">
               <PackagePlus className="h-4 w-4" /> Sell
            </Link>
          )}
          <Link href="/cart" passHref>
            <Button variant="ghost" size="icon" className="relative" aria-label="Shopping Cart">
              <ShoppingCart className="h-6 w-6 text-accent" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                  {cartItemCount}
                </span>
              )}
            </Button>
          </Link>

           {/* Auth Section (Desktop) */}
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
                 <DropdownMenuItem asChild>
                    <Link href="/profile"> {/* Assuming /profile route exists or will be created */}
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                    </Link>
                 </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/sell">
                        <PackagePlus className="mr-2 h-4 w-4" />
                        <span>Sell Product</span>
                    </Link>
                 </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10">
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

         {/* Mobile Navigation Trigger & Cart */}
        <div className="flex md:hidden items-center space-x-2">
             <Link href="/cart" passHref>
                <Button variant="ghost" size="icon" className="relative" aria-label="Shopping Cart">
                <ShoppingCart className="h-6 w-6 text-accent" />
                {cartItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                    {cartItemCount}
                    </span>
                )}
                </Button>
            </Link>
             <Sheet>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" aria-label="Open menu">
                        <Menu className="h-6 w-6" />
                    </Button>
                </SheetTrigger>
                <SheetContent side="right">
                    <SheetHeader>
                         {/* Use Link for Sheet Title to go home */}
                         <SheetTitle asChild>
                            <Link href="/" className="text-primary text-left flex items-center gap-2">
                               <Store className="h-5 w-5" /> MediShop
                            </Link>
                         </SheetTitle>
                    </SheetHeader>
                    <Separator className="my-4" />
                    <nav className="flex flex-col space-y-2">
                         <Link href="/" className="text-foreground hover:text-accent transition-colors p-2 rounded hover:bg-secondary">
                            Home
                        </Link>
                        <Link href="/products" className="text-foreground hover:text-accent transition-colors p-2 rounded hover:bg-secondary">
                            Products
                        </Link>
                         {/* Add Sell link for logged-in users (Mobile) */}
                        {user && (
                            <Link href="/sell" className="text-foreground hover:text-accent transition-colors p-2 rounded hover:bg-secondary flex items-center gap-2">
                                <PackagePlus className="h-4 w-4" /> Sell Product
                            </Link>
                        )}
                        <Separator />
                        {user ? (
                             <>
                                <p className="px-2 py-1 text-sm font-medium text-muted-foreground">Account</p>
                                <p className="px-2 text-xs text-muted-foreground -mt-1 mb-1">{user.email}</p>
                                <Link href="/profile" className="text-foreground hover:text-accent transition-colors p-2 rounded hover:bg-secondary flex items-center">
                                    <User className="mr-2 h-4 w-4" /> Profile
                                </Link>
                                <Button variant="ghost" onClick={handleLogout} className="justify-start p-2 text-destructive hover:text-destructive hover:bg-destructive/10 w-full">
                                    <LogOut className="mr-2 h-4 w-4" /> Log out
                                </Button>
                             </>
                        ) : (
                            <>
                                <Link href="/login" className="text-foreground hover:text-accent transition-colors p-2 rounded hover:bg-secondary flex items-center">
                                    <LogIn className="mr-2 h-4 w-4"/> Log In
                                </Link>
                                <Link href="/signup" className="text-foreground hover:text-accent transition-colors p-2 rounded hover:bg-secondary flex items-center">
                                     <UserPlus className="mr-2 h-4 w-4"/> Sign Up
                                </Link>
                            </>
                        )}
                    </nav>
                </SheetContent>
            </Sheet>
        </div>

      </div>
    </header>
  );
}
