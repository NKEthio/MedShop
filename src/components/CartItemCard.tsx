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
      onRemove(item.id);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseInt(e.target.value, 10);
      if (!isNaN(value) && value >= 1) {
          onQuantityChange(item.id, value);
      } else if (e.target.value === '' || (!isNaN(value) && value === 0)) {
          // Allow removing by setting quantity to 0 or empty, but handle removal logic externally if needed
          onQuantityChange(item.id, 1); // Reset to 1 if input is invalid/empty for simplicity, or handle removal
      }
  };

  return (
    <Card className="mb-4 shadow-sm">
      <CardContent className="p-4 flex items-center space-x-4">
        <div className="relative w-20 h-20 flex-shrink-0">
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            sizes="80px"
            style={{ objectFit: 'cover' }}
            className="rounded-md"
            data-ai-hint={item.dataAiHint}
          />
        </div>
        <div className="flex-grow">
          <h3 className="font-semibold">{item.name}</h3>
          <p className="text-sm text-muted-foreground">${item.price.toFixed(2)}</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" onClick={() => handleQuantityChange(-1)} aria-label="Decrease quantity">
            <Minus className="h-4 w-4" />
          </Button>
          <Input
            type="number"
            min="1"
            value={item.quantity}
            onChange={handleInputChange}
            className="w-16 text-center h-9"
            aria-label={`Quantity for ${item.name}`}
          />
          <Button variant="outline" size="icon" onClick={() => handleQuantityChange(1)} aria-label="Increase quantity">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="text-right font-semibold w-24">
          ${(item.price * item.quantity).toFixed(2)}
        </div>
        <Button variant="ghost" size="icon" onClick={() => onRemove(item.id)} className="text-destructive" aria-label={`Remove ${item.name} from cart`}>
          <Trash2 className="h-5 w-5" />
        </Button>
      </CardContent>
    </Card>
  );
}
