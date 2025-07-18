
import Link from 'next/link';
import { ShoppingCart, User, LogOut, LogIn, UserPlus, Menu, PackagePlus, Store, Crown, PackageSearch, DollarSign, Euro, CircleDollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useCurrency, type Currency } from '@/context/CurrencyContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Separator } from '@/components/ui/separator';


interface HeaderProps {
  cartItemCount: number;
}

export default function Header({ cartItemCount }: HeaderProps) {
  const { user, logout, userRole } = useAuth();
  const { selectedCurrency, setSelectedCurrency, currencies, currencySymbols } = useCurrency();

  const handleLogout = async () => {
    await logout();
  };

   const getInitials = (email: string | null | undefined) => {
    if (!email) return 'U';
    const namePart = email.split('@')[0];
    if (namePart.includes('.')) {
        const parts = namePart.split('.');
        return (parts[0][0] + (parts[1]?.[0] || '')).toUpperCase();
    } else if (namePart.length >= 2) {
        return namePart.substring(0, 2).toUpperCase();
    } else if (namePart.length === 1) {
        return namePart.toUpperCase();
    }
    return email.substring(0, 1).toUpperCase();
   };

  const getCurrencyIcon = (currency: Currency) => {
    switch (currency) {
      case 'USD': return <DollarSign className="h-4 w-4" />;
      case 'EUR': return <Euro className="h-4 w-4" />;
      case 'ETB': return <CircleDollarSign className="h-4 w-4" />; // Using a generic icon for ETB
      default: return <CircleDollarSign className="h-4 w-4" />;
    }
  }


  return (
    <header className="bg-secondary shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="text-xl sm:text-2xl font-bold text-primary flex items-center gap-2">
           <Store className="h-6 w-6" />
          MediShop
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-2 lg:space-x-4">
          <Link href="/products" className="text-foreground hover:text-accent transition-colors px-2 py-1 rounded-md text-sm">
            Products
          </Link>
          
          {userRole === 'admin' && (
              <Link href="/admin/dashboard" className="text-destructive font-medium hover:text-destructive/80 transition-colors px-2 py-1 rounded-md text-sm flex items-center gap-1">
                   <Crown className="h-4 w-4" /> Owner
              </Link>
          )}
          
          {(userRole === 'seller' || userRole === 'admin') && (
             <>
                 <Link href="/my-products" className="text-foreground hover:text-accent transition-colors px-2 py-1 rounded-md text-sm flex items-center gap-1">
                    <PackageSearch className="h-4 w-4" /> My Products
                 </Link>
                 <Link href="/sell" className="text-foreground hover:text-accent transition-colors px-2 py-1 rounded-md text-sm flex items-center gap-1">
                    <PackagePlus className="h-4 w-4" /> Sell
                 </Link>
             </>
          )}

          <Link href="/cart" passHref>
            <Button variant="ghost" size="icon" className="relative" aria-label="Shopping Cart">
              <ShoppingCart className="h-5 w-5 text-accent" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                  {cartItemCount}
                </span>
              )}
            </Button>
          </Link>

          {/* Currency Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="flex items-center gap-1">
                {getCurrencyIcon(selectedCurrency)}
                <span className="hidden lg:inline">{selectedCurrency}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Select Currency</DropdownMenuLabel>
              <DropdownMenuRadioGroup value={selectedCurrency} onValueChange={(value) => setSelectedCurrency(value as Currency)}>
                {currencies.map((currencyCode) => (
                  <DropdownMenuRadioItem key={currencyCode} value={currencyCode} className="flex items-center gap-2">
                     {getCurrencyIcon(currencyCode)} {currencyCode} ({currencySymbols[currencyCode]})
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>


           {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                 <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                        <AvatarFallback>{getInitials(user.email)}</AvatarFallback>
                     </Avatar>
                 </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">Account ({userRole})</p>
                    <p className="text-xs leading-none text-muted-foreground">
                       {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                 <DropdownMenuItem asChild>
                    <Link href="/profile">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                    </Link>
                 </DropdownMenuItem>
                 
                 {(userRole === 'seller' || userRole === 'admin') && (
                     <>
                         <DropdownMenuItem asChild>
                            <Link href="/my-products">
                                <PackageSearch className="mr-2 h-4 w-4" />
                                <span>My Products</span>
                            </Link>
                         </DropdownMenuItem>
                         <DropdownMenuItem asChild>
                            <Link href="/sell">
                                <PackagePlus className="mr-2 h-4 w-4" />
                                <span>Sell Product</span>
                            </Link>
                         </DropdownMenuItem>
                     </>
                 )}
                 
                  {userRole === 'admin' && (
                    <DropdownMenuItem asChild>
                        <Link href="/admin/dashboard">
                            <Crown className="mr-2 h-4 w-4 text-destructive" />
                            <span className="text-destructive font-medium">Owner Dashboard</span>
                        </Link>
                    </DropdownMenuItem>
                  )}
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

        {/* Mobile Navigation */}
        <div className="flex md:hidden items-center space-x-1">
             <Link href="/cart" passHref>
                <Button variant="ghost" size="icon" className="relative" aria-label="Shopping Cart">
                <ShoppingCart className="h-5 w-5 text-accent" />
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
                <SheetContent side="right" className="w-[280px] sm:w-[320px]">
                    <SheetHeader>
                         <SheetTitle asChild>
                           <SheetClose asChild>
                            <Link href="/" className="text-primary text-left flex items-center gap-2 text-lg">
                               <Store className="h-5 w-5" /> MediShop
                            </Link>
                           </SheetClose>
                         </SheetTitle>
                    </SheetHeader>
                    <Separator className="my-4" />
                    <nav className="flex flex-col space-y-2">
                        <SheetClose asChild><Link href="/" className="text-foreground hover:text-accent transition-colors p-2 rounded hover:bg-secondary">Home</Link></SheetClose>
                        <SheetClose asChild><Link href="/products" className="text-foreground hover:text-accent transition-colors p-2 rounded hover:bg-secondary">Products</Link></SheetClose>
                        
                        {userRole === 'admin' && (
                           <SheetClose asChild>
                            <Link href="/admin/dashboard" className="text-destructive font-medium hover:text-destructive/80 transition-colors p-2 rounded hover:bg-destructive/10 flex items-center gap-2">
                                <Crown className="h-4 w-4" /> Owner Dashboard
                            </Link>
                           </SheetClose>
                        )}
                        
                         {(userRole === 'seller' || userRole === 'admin') && (
                            <>
                                <SheetClose asChild>
                                <Link href="/my-products" className="text-foreground hover:text-accent transition-colors p-2 rounded hover:bg-secondary flex items-center gap-2">
                                    <PackageSearch className="h-4 w-4" /> My Products
                                </Link>
                                </SheetClose>
                                <SheetClose asChild>
                                <Link href="/sell" className="text-foreground hover:text-accent transition-colors p-2 rounded hover:bg-secondary flex items-center gap-2">
                                    <PackagePlus className="h-4 w-4" /> Sell Product
                                </Link>
                                </SheetClose>
                            </>
                         )}

                        {/* Mobile Currency Selector */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="justify-start p-2 w-full flex items-center gap-2 text-foreground hover:text-accent hover:bg-secondary">
                                {getCurrencyIcon(selectedCurrency)}
                                <span>{selectedCurrency} ({currencySymbols[selectedCurrency]})</span>
                            </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" className="w-[calc(100vw-80px)] ml-2 sm:w-[280px]">
                            <DropdownMenuLabel>Select Currency</DropdownMenuLabel>
                            <DropdownMenuRadioGroup value={selectedCurrency} onValueChange={(value) => setSelectedCurrency(value as Currency)}>
                                {currencies.map((currencyCode) => (
                                <DropdownMenuRadioItem key={currencyCode} value={currencyCode} className="flex items-center gap-2">
                                    {getCurrencyIcon(currencyCode)} {currencyCode} ({currencySymbols[currencyCode]})
                                </DropdownMenuRadioItem>
                                ))}
                            </DropdownMenuRadioGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>


                        <Separator className="my-4" />
                        {user ? (
                             <>
                                <p className="px-2 py-1 text-sm font-medium text-muted-foreground">Account ({userRole})</p>
                                <p className="px-2 text-xs text-muted-foreground -mt-1 mb-1">{user.email}</p>
                                <SheetClose asChild>
                                <Link href="/profile" className="text-foreground hover:text-accent transition-colors p-2 rounded hover:bg-secondary flex items-center">
                                    <User className="mr-2 h-4 w-4" /> Profile
                                </Link>
                                </SheetClose>
                                <SheetClose asChild>
                                <Button variant="ghost" onClick={handleLogout} className="justify-start p-2 text-destructive hover:text-destructive hover:bg-destructive/10 w-full">
                                    <LogOut className="mr-2 h-4 w-4" /> Log out
                                </Button>
                                </SheetClose>
                             </>
                        ) : (
                            <>
                                <SheetClose asChild>
                                <Link href="/login" className="text-foreground hover:text-accent transition-colors p-2 rounded hover:bg-secondary flex items-center">
                                    <LogIn className="mr-2 h-4 w-4"/> Log In
                                </Link>
                                </SheetClose>
                                <SheetClose asChild>
                                <Link href="/signup" className="text-foreground hover:text-accent transition-colors p-2 rounded hover:bg-secondary flex items-center">
                                     <UserPlus className="mr-2 h-4 w-4"/> Sign Up
                                </Link>
                                </SheetClose>
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
