
import type { Currency } from '@/context/CurrencyContext'; // Import Currency type

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number; // Base price, assumed to be in USD
  imageUrl: string;
  category: string;
  dataAiHint: string;
  sellerId: string; // Added to track the seller
}

export interface CartItem extends Product {
  quantity: number;
}

export type UserRole = 'admin' | 'seller' | 'buyer' | null;

// Order Management Types
export type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

export interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number; // Price per unit IN THE CURRENCY OF THE ORDER at the time of purchase
  totalPrice: number; // quantity * price, IN THE CURRENCY OF THE ORDER
  imageUrl?: string; // Optional: for displaying in order details
  dataAiHint?: string;
}

export interface ShippingAddress {
  fullName: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  email: string;
  phone: string;
}

export interface Order {
  id: string; // Firestore document ID
  userId: string; // Firebase UID of the buyer
  userEmail: string; // Email of the buyer
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  totalAmount: number; // Total amount IN THE CURRENCY OF THE ORDER
  currency: Currency; // The currency code for totalAmount (e.g., 'USD', 'EUR', 'ETB')
  orderDate: string; // ISO string or Firebase Timestamp
  lastUpdated: string; // ISO string or Firebase Timestamp for status changes
  location?: { // Optional: User's location at time of order
    latitude: number;
    longitude: number;
  } | null;
}
