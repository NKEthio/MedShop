import { useState, useEffect, useCallback } from 'react';
import type { Product, CartItem } from '@/types';
import { toast } from "@/hooks/use-toast";

const CART_STORAGE_KEY = 'medishop-cart';

export function useCart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartInitialized, setIsCartInitialized] = useState(false);

  // Load cart from localStorage on initial mount (client-side only)
  useEffect(() => {
    try {
      const storedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (storedCart) {
        setCartItems(JSON.parse(storedCart));
      }
    } catch (error) {
      console.error("Failed to load cart from localStorage:", error);
      // Optionally clear corrupted storage
      // localStorage.removeItem(CART_STORAGE_KEY);
    }
    setIsCartInitialized(true);
  }, []);

  // Save cart to localStorage whenever it changes (client-side only)
  useEffect(() => {
    if (isCartInitialized) {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
      } catch (error) {
        console.error("Failed to save cart to localStorage:", error);
        toast({
            title: "Storage Error",
            description: "Could not save your cart. Your browser storage might be full or unavailable.",
            variant: "destructive",
        });
      }
    }
  }, [cartItems, isCartInitialized]);

  const addToCart = useCallback((product: Product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      if (existingItem) {
        // Increase quantity if item already exists
        return prevItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        // Add new item with quantity 1
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
     toast({
       title: "Item Added",
       description: `${product.name} added to your cart.`,
     });
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity < 1) {
      // Remove item if quantity is less than 1
      removeFromCart(productId);
    } else {
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.id === productId ? { ...item, quantity: quantity } : item
        )
      );
    }
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCartItems((prevItems) => {
        const itemToRemove = prevItems.find(item => item.id === productId);
        if (itemToRemove) {
             toast({
               title: "Item Removed",
               description: `${itemToRemove.name} removed from your cart.`,
               variant: "destructive",
             });
        }
       return prevItems.filter((item) => item.id !== productId)
    });
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
    toast({
       title: "Cart Cleared",
       description: "Your shopping cart has been emptied.",
    });
  }, []);

  const cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const cartItemCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  return {
    cartItems,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    cartTotal,
    cartItemCount,
    isCartInitialized, // Expose initialization status if needed elsewhere
  };
}
