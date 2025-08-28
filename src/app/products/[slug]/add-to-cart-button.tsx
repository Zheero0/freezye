'use client';

import { useCart } from '@/hooks/use-cart';
import { Button } from '@/components/ui/button';
import { ShoppingBasket } from 'lucide-react';
import type { Product } from '@/types';

export default function AddToCartButton({ product }: { product: Product }) {
  const { addToCart } = useCart();
  return (
    <Button size="lg" onClick={() => addToCart(product)}>
      <ShoppingBasket className="mr-2 h-5 w-5" />
      Add to Cart
    </Button>
  );
}
