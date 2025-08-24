"use client";

import React, { useMemo, useState } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { useToast } from '@/hooks/use-toast';
import { CartContext } from '@/hooks/use-cart';
import type { CartItem, Product } from '@/types';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useLocalStorage<CartItem[]>('cart', []);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { toast } = useToast();

  const addToCart = (product: Product) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevItems, { ...product, quantity: 1 }];
    });
    toast({
      title: "Added to cart!",
      description: `${product.name} is now in your cart.`,
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== productId));
    toast({
        title: "Item removed",
        description: "The item has been removed from your cart.",
      });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getItemCount = () => {
    return items.reduce((count, item) => count + item.quantity, 0);
  };

  const { subtotal, discount, total } = useMemo(() => {
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    
    // "3 for 2" logic
    const allItems = items.flatMap(item => Array(item.quantity).fill(item)).sort((a, b) => a.price - b.price);
    const numberOfDiscountedItems = Math.floor(allItems.length / 3);
    let discount = 0;
    if (numberOfDiscountedItems > 0) {
        discount = allItems.slice(0, numberOfDiscountedItems).reduce((acc, item) => acc + item.price, 0);
    }

    const total = subtotal - discount;
    return { subtotal, discount, total };
  }, [items]);

  const value = {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getItemCount,
    subtotal,
    discount,
    total,
    isCartOpen,
    setIsCartOpen,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
