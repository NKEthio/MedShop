'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { products } from '@/data/products'; // Reuse product data
import ProductCard from '@/components/ProductCard';
import { useCart } from '@/hooks/useCart';
import { HeartPulse, Truck, ShieldCheck } from 'lucide-react';


export default function Home() {
   const { addToCart } = useCart();
   // Select a few featured products (e.g., the first 4)
   const featuredProducts = products.slice(0, 4);


  return (
    <div className="flex flex-col">
        {/* Hero Section */}
        <section className="bg-secondary py-16 md:py-20 text-center relative overflow-hidden">
             <div className="absolute inset-0 opacity-10 z-0">
                 {/* Optional subtle background pattern or image */}
                 {/* Example: <Image src="/path/to/background.svg" layout="fill" objectFit="cover" alt="" /> */}
             </div>
             <div className="container mx-auto px-4 relative z-10">
                <HeartPulse className="mx-auto h-12 w-12 md:h-16 md:w-16 text-primary mb-4" />
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-primary">Welcome to MediShop</h1>
                <p className="text-base sm:text-lg text-foreground mb-8 max-w-lg md:max-w-2xl mx-auto">
                    Your reliable partner for high-quality medical equipment and supplies.
                </p>
                <Link href="/products" passHref>
                    <Button size="lg">Shop All Products</Button>
                </Link>
            </div>
        </section>


        {/* Features Section */}
        <section className="py-12 md:py-16 bg-background">
             <div className="container mx-auto px-4">
                 <h2 className="text-2xl sm:text-3xl font-bold text-center mb-10 md:mb-12 text-primary">Why Choose Us?</h2>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 text-center">
                     {/* Added hover effect and transition */}
                     <div className="flex flex-col items-center p-6 border rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 ease-in-out">
                        <HeartPulse className="h-10 w-10 md:h-12 md:w-12 text-accent mb-4" />
                         <h3 className="text-lg sm:text-xl font-semibold mb-2">Quality Products</h3>
                        <p className="text-sm sm:text-base text-muted-foreground">Carefully selected equipment from trusted manufacturers.</p>
                     </div>
                    {/* Added hover effect and transition */}
                    <div className="flex flex-col items-center p-6 border rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 ease-in-out">
                         <Truck className="h-10 w-10 md:h-12 md:w-12 text-accent mb-4" />
                        <h3 className="text-lg sm:text-xl font-semibold mb-2">Fast Shipping</h3>
                         <p className="text-sm sm:text-base text-muted-foreground">Reliable and prompt delivery to your doorstep.</p>
                    </div>
                     {/* Added hover effect and transition */}
                     <div className="flex flex-col items-center p-6 border rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 ease-in-out">
                         <ShieldCheck className="h-10 w-10 md:h-12 md:w-12 text-accent mb-4" />
                         <h3 className="text-xl font-semibold mb-2">Secure Checkout</h3>
                         <p className="text-sm sm:text-base text-muted-foreground">Your information is safe with our secure payment process.</p>
                     </div>
                </div>
             </div>
        </section>

       {/* Featured Products Section */}
        <section className="py-12 md:py-16 bg-secondary">
             <div className="container mx-auto px-4">
                <h2 className="text-2xl sm:text-3xl font-bold text-center mb-10 md:mb-12 text-primary">Featured Products</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    {featuredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
                    ))}
                </div>
                <div className="text-center mt-10 md:mt-12">
                    <Link href="/products" passHref>
                       <Button variant="outline">View All Products</Button>
                    </Link>
                </div>
             </div>
        </section>
    </div>
  );
}
