'use client';

import ProductCard from '@/components/ProductCard';
import { products } from '@/data/products';
import { useCart } from '@/hooks/useCart';

export default function ProductsPage() {
  const { addToCart } = useCart();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center text-primary">Our Medical Equipment</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
        ))}
      </div>
    </div>
  );
}
