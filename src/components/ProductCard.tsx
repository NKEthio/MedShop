import Image from 'next/image';
import type { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingCart, Edit, Trash2 } from 'lucide-react'; // Added Edit and Trash2 icons
import { useAuth } from '@/context/AuthContext'; // Import useAuth to check user ID

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void; // Made optional
  onEdit?: (product: Product) => void; // Callback for edit action
  onDelete?: (productId: string) => void; // Callback for delete action
  showActions?: boolean; // Flag to show edit/delete buttons
}

export default function ProductCard({
  product,
  onAddToCart,
  onEdit,
  onDelete,
  showActions = false, // Default to false
}: ProductCardProps) {
  const { user } = useAuth(); // Get current user

  // Check if the current user is the seller of this product
  const isSeller = user && user.uid === product.sellerId;

  return (
    // Added group class for hover effect targeting
    <Card className="group flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out hover:scale-105 animate-fadeIn">
      <CardHeader className="p-0">
        {/* Added group-hover effect for image */}
        <div className="relative w-full h-48 overflow-hidden"> {/* Ensure image container hides overflow */}
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" // Adjusted sizes for responsiveness
            style={{ objectFit: 'cover' }}
            className="rounded-t-lg transition-transform duration-300 ease-in-out group-hover:scale-110" // Scale image on hover
            data-ai-hint={product.dataAiHint}
            priority={false} // Avoid too many priority images
          />
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="text-lg font-semibold mb-1 line-clamp-2">{product.name}</CardTitle> {/* Limit title lines */}
        <CardDescription className="text-sm text-muted-foreground mb-2 line-clamp-3">{product.description}</CardDescription> {/* Limit description lines */}
        <p className="text-lg font-bold text-primary mt-2">${product.price.toFixed(2)}</p> {/* Added margin top */}
      </CardContent>
      <CardFooter className="p-4 pt-0 mt-auto"> {/* Ensure footer stays at bottom */}
        {/* Conditional rendering based on showActions and isSeller */}
        {showActions && isSeller ? (
          <div className="flex w-full gap-2">
            <Button onClick={() => onEdit?.(product)} className="w-1/2" variant="outline" size="sm" aria-label={`Edit ${product.name}`}>
              <Edit className="mr-1 h-4 w-4" /> Edit
            </Button>
            <Button onClick={() => onDelete?.(product.id)} className="w-1/2" variant="destructive" size="sm" aria-label={`Delete ${product.name}`}>
              <Trash2 className="mr-1 h-4 w-4" /> Delete
            </Button>
          </div>
        ) : (
          // Show Add to Cart button if not showing actions or not the seller
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
