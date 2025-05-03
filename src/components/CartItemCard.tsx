import Image from 'next/image';
import type { CartItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Minus, Plus, Trash2 } from 'lucide-react';

interface CartItemCardProps {
  item: CartItem;
  onQuantityChange: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
}

export default function CartItemCard({ item, onQuantityChange, onRemove }: CartItemCardProps) {
  const handleQuantityChange = (change: number) => {
    const newQuantity = item.quantity + change;
    if (newQuantity >= 1) {
      onQuantityChange(item.id, newQuantity);
    } else if (newQuantity === 0) {
      // Allow decreasing to 0 via button to trigger removal
      onRemove(item.id);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseInt(e.target.value, 10);
      if (!isNaN(value) && value >= 1) {
          onQuantityChange(item.id, value);
      } else if (e.target.value === '' || (!isNaN(value) && value === 0)) {
          // Handle removal if input is cleared or set to 0
          onRemove(item.id);
      }
       // If input is invalid (e.g., negative, non-numeric), do nothing or revert (optional)
  };

  return (
    <Card className="mb-4 shadow-sm overflow-hidden">
      {/* Added flex-wrap and gap for better wrapping on small screens */}
      <CardContent className="p-3 sm:p-4 flex flex-wrap items-center gap-4">
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0">
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            sizes="(max-width: 640px) 64px, 80px"
            style={{ objectFit: 'cover' }}
            className="rounded-md"
            data-ai-hint={item.dataAiHint}
          />
        </div>
        {/* Adjusted flex-grow and width constraints */}
        <div className="flex-grow min-w-[150px]">
          <h3 className="font-semibold text-sm sm:text-base">{item.name}</h3>
          <p className="text-xs sm:text-sm text-muted-foreground">${item.price.toFixed(2)}</p>
        </div>
        {/* Grouped quantity controls */}
        <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
          <Button variant="outline" size="icon" className="h-8 w-8 sm:h-9 sm:w-9" onClick={() => handleQuantityChange(-1)} aria-label="Decrease quantity">
            <Minus className="h-4 w-4" />
          </Button>
          <Input
            type="number"
            min="1" // Min attribute for native browser validation
            value={item.quantity}
            onChange={handleInputChange}
            // Added min-w-16 for better spacing, adjusted height
            className="w-12 sm:w-16 text-center h-8 sm:h-9 px-1"
            aria-label={`Quantity for ${item.name}`}
          />
          <Button variant="outline" size="icon" className="h-8 w-8 sm:h-9 sm:w-9" onClick={() => handleQuantityChange(1)} aria-label="Increase quantity">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
         {/* Adjusted width and text alignment for consistency */}
        <div className="text-right font-semibold w-20 sm:w-24 text-sm sm:text-base">
          ${(item.price * item.quantity).toFixed(2)}
        </div>
         {/* Ensured button is consistently placed */}
        <Button variant="ghost" size="icon" onClick={() => onRemove(item.id)} className="text-destructive h-8 w-8 sm:h-9 sm:w-9 ml-auto sm:ml-0" aria-label={`Remove ${item.name} from cart`}>
          <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />
        </Button>
      </CardContent>
    </Card>
  );
}
