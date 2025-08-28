
'use-client';

import { useCart } from '@/hooks/use-cart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Candy } from 'lucide-react';
import Image from 'next/image';

export default function CartSummary() {
  const { items, subtotal, discount, shippingCost, total } = useCart();

  return (
    <Card className="sticky top-20">
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
            {items.map((item) => (
                <div key={item.id} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-3">
                        <div className="relative h-12 w-12 rounded-md bg-muted flex-shrink-0 flex items-center justify-center">
                            <Candy className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-muted-foreground">
                                Qty: {item.quantity}
                            </p>
                        </div>
                    </div>
                    <p className="font-medium">£{(item.price * item.quantity).toFixed(2)}</p>
                </div>
            ))}
        </div>

        <Separator className="my-4" />

        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>£{subtotal.toFixed(2)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>3 for 2 Offer</span>
              <span>-£{discount.toFixed(2)}</span>
            </div>
          )}
           <div className="flex justify-between">
            <span>Shipping</span>
            <span>£{shippingCost.toFixed(2)}</span>
          </div>
          <Separator />
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>£{total.toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
