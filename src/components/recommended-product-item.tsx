
'use client';

import { useCart } from '@/hooks/use-cart';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import type { Product } from '@/types';
import { Card, CardContent } from './ui/card';
import { Candy } from 'lucide-react';

export default function RecommendedProductItem({ product }: { product: Product }) {
  const { addToCart } = useCart();

  return (
    <Card className="overflow-hidden group text-center">
        <CardContent className="p-2">
            <div className="aspect-square w-full relative bg-muted rounded-md flex items-center justify-center mb-2">
                <Candy className="w-8 h-8 text-muted-foreground transition-transform group-hover:scale-110" />
            </div>
            <h4 className="text-xs font-semibold truncate">{product.name}</h4>
            <p className="text-xs text-muted-foreground mb-1">£{product.price.toFixed(2)}</p>
            <Button size="sm" className="h-6 w-full text-xs" onClick={() => addToCart(product)}>
                <Plus className="h-3 w-3 mr-1" />
                Add
            </Button>
        </CardContent>
    </Card>
  );
}
