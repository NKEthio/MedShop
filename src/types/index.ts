
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  dataAiHint: string;
  sellerId: string; // Added to track the seller
}

export interface CartItem extends Product {
  quantity: number;
}

export type UserRole = 'admin' | 'seller' | 'buyer' | null;
