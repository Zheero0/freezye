
"use client";

import { createContext, useContext } from 'react';
import type { CartItem, Product } from '@/types';

export type ShippingMethod = 'standard' | 'express';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getItemCount: () => number;
  subtotal: number;
  discount: number;
  shippingCost: number;
  total: number;
  shippingMethod: ShippingMethod;
  setShippingMethod: (method: ShippingMethod) => void;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

export function useCart(): CartContextType {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
