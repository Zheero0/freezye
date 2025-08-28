
'use client';

import Image from 'next/image';
import { useCart } from '@/hooks/use-cart';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Minus, Plus, Trash2, Candy } from 'lucide-react';
import type { CartItem as CartItemType } from '@/types';

export default function CartItem({ item }: { item: CartItemType }) {
  const { updateQuantity, removeFromCart } = useCart();

  return (
    <div className="flex items-start gap-4">
      <div className="relative h-20 w-20 rounded-md bg-muted flex-shrink-0 flex items-center justify-center">
        <Candy className="h-8 w-8 text-muted-foreground" />
      </div>
      <div className="flex-grow flex flex-col justify-between h-20">
        <div>
            <h3 className="font-semibold font-headline text-base leading-tight">{item.name}</h3>
            <p className="text-sm text-muted-foreground">£{item.price.toFixed(2)}</p>
        </div>
        <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-1">
                <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                    <Minus className="h-4 w-4" />
                </Button>
                <Input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                    className="h-7 w-12 text-center"
                />
                <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                    <Plus className="h-4 w-4" />
                </Button>
            </div>
             <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => removeFromCart(item.id)}>
                <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
        </div>
      </div>
       <div className="text-right font-semibold w-16 flex-shrink-0">
        <p>£{(item.price * item.quantity).toFixed(2)}</p>
      </div>
    </div>
  );
}
