
import Image from 'next/image';
import type { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingCart, Edit, Trash2 } from 'lucide-react';
import { useCurrency } from '@/context/CurrencyContext';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onEdit?: (product: Product) => void;
  onDelete?: (productId: string) => void;
  showActions?: boolean;
}

export default function ProductCard({
  product,
  onAddToCart,
  onEdit,
  onDelete,
  showActions = false,
}: ProductCardProps) {
  const { formatPrice, convertToSelectedCurrency, selectedCurrency } = useCurrency();
  const displayPrice = convertToSelectedCurrency(product.price);

  return (
    <Card className="group flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out hover:scale-105 animate-fadeIn">
      <CardHeader className="p-0">
        <div className="relative w-full h-48 overflow-hidden">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            style={{ objectFit: 'cover' }}
            className="rounded-t-lg transition-transform duration-300 ease-in-out group-hover:scale-110"
            data-ai-hint={product.dataAiHint}
            priority={false}
          />
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="text-lg font-semibold mb-1 line-clamp-2">{product.name}</CardTitle>
        <CardDescription className="text-sm text-muted-foreground mb-2 line-clamp-3">{product.description}</CardDescription>
        <p className="text-lg font-bold text-primary mt-2">
          {formatPrice(displayPrice, selectedCurrency)}
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-0 mt-auto">
        {showActions ? (
          <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2 w-full">
            <Button onClick={() => onEdit?.(product)} className="w-full sm:w-1/2" variant="outline" size="sm" aria-label={`Edit ${product.name}`}>
              <Edit className="mr-1 h-4 w-4" /> Edit
            </Button>
            <Button onClick={() => onDelete?.(product.id)} className="w-full sm:w-1/2" variant="destructive" size="sm" aria-label={`Delete ${product.name}`}>
              <Trash2 className="mr-1 h-4 w-4" /> Delete
            </Button>
          </div>
        ) : (
          onAddToCart && (
             <Button onClick={() => onAddToCart(product)} className="w-full" aria-label={`Add ${product.name} to cart`}>
               <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
             </Button>
           )
        )}
      </CardFooter>
    </Card>
  );
}
