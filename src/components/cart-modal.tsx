
'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/hooks/use-cart';
import CartItem from '@/components/cart-item';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetDescription,
} from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, Gift } from 'lucide-react';
import DiscountProgress from './discount-progress';
import { motion } from 'framer-motion';
import { products } from '@/lib/products';
import RecommendedProductItem from './recommended-product-item';
import type { Product } from '@/types';

export default function CartModal() {
  const { isCartOpen, setIsCartOpen, items, subtotal, discount, total, getItemCount } = useCart();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const router = useRouter();
  const itemCount = getItemCount();

  const handleCheckout = () => {
    if (itemCount > 0 && itemCount % 3 !== 0) {
      setShowConfirmation(true);
    } else {
      proceedToCheckout();
    }
  };

  const proceedToCheckout = () => {
    setShowConfirmation(false);
    setIsCartOpen(false);
    router.push('/checkout');
  };

  const recommendedProducts = useMemo(() => {
    if (items.length === 0) return products.slice(0, 3);

    const cartItemIds = items.map(item => item.id);
    return products
      .filter(p => !cartItemIds.includes(p.id))
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
  }, [items]);

  return (
    <>
      <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
        <SheetContent className="flex flex-col w-full sm:max-w-lg h-full p-0">
          <SheetHeader className="p-6 pb-4">
            <SheetTitle>Your Shopping Cart</SheetTitle>
          </SheetHeader>

          {items.length > 0 ? (
            <>
              {/* Scrollable content */}
              <ScrollArea
                className="flex-1 px-6"
              >
                <div className="mb-4">
                  <DiscountProgress />
                </div>
                <div className="flex flex-col gap-4">
                  {items.map((item) => (
                    <CartItem item={item} key={item.id} />
                  ))}
                </div>

                {recommendedProducts.length > 0 && (
                  <div className="mt-4 pt-4 border-t">
                    <h3 className="text-sm font-semibold mb-2 text-center">
                      You might also like...
                    </h3>
                    <div className="grid grid-cols-3 gap-2">
                      {recommendedProducts.map((product) => (
                        <RecommendedProductItem key={product.id} product={product} />
                      ))}
                    </div>
                  </div>
                )}
              </ScrollArea>

              {/* Fixed footer */}
              <SheetFooter className="sticky bottom-0 left-0 right-0 bg-background pt-4 border-t p-6">
                <div className="flex flex-col space-y-4 w-full">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-medium">£{subtotal.toFixed(2)}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>3 for 2 Offer</span>
                        <span className="font-medium">-£{discount.toFixed(2)}</span>
                      </div>
                    )}
                    <Separator />
                    <div className="flex justify-between font-bold text-base">
                      <span>Total</span>
                      <span>£{total.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      onClick={() => {
                        setIsCartOpen(false);
                        router.push('/products');
                      }}
                      size="lg"
                      variant="outline"
                      className="w-full"
                    >
                      Continue Shopping
                    </Button>
                    <Button onClick={handleCheckout} size="lg" className="w-full">
                      Proceed to Checkout
                    </Button>
                  </div>
                </div>
              </SheetFooter>
            </>
          ) : (
            <ScrollArea
              className="flex-1 px-6"
            >
              <div className="flex flex-col items-center justify-center h-full text-center">
                <ShoppingCart className="h-16 w-16 text-muted-foreground mb-4" />
                <h2 className="text-2xl font-bold font-headline mb-2">Your Cart is Empty</h2>
                <p className="text-muted-foreground mb-6">
                  Add some treats to get started!
                </p>

                {recommendedProducts.length > 0 && (
                  <div className="w-full mt-4 pt-4 border-t">
                    <h3 className="text-lg font-semibold mb-4">Our Bestsellers</h3>
                    <div className="grid grid-cols-3 gap-2">
                      {recommendedProducts.map((product) => (
                        <RecommendedProductItem key={product.id} product={product} />
                      ))}
                    </div>
                    <Button onClick={() => setIsCartOpen(false)} className="mt-8">
                      Start Shopping
                    </Button>
                  </div>
                )}
              </div>
            </ScrollArea>
          )}
        </SheetContent>
      </Sheet>

      {/* Checkout confirmation modal */}
      <AlertDialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <AlertDialogContent>
          <AlertDialogHeader className="text-center items-center">
            <motion.div
              animate={{ 
                scale: [1, 1.25, 1, 1.25, 1],
                rotate: [0, -10, 10, -10, 0],
              }}
              transition={{ duration: 1, repeat: Infinity, repeatDelay: 2, ease: 'easeInOut' }}
              className="bg-primary/20 text-primary rounded-full h-16 w-16 flex items-center justify-center mb-4"
            >
              <Gift className="h-8 w-8" />
            </motion.div>
            <AlertDialogTitle>Wait a second!</AlertDialogTitle>
            <AlertDialogDescription>
              You're so close to a great deal! Add {3 - (itemCount % 3)} more item(s) to
              get one for free with our &quot;3 for 2&quot; offer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="sm:justify-center">
            <AlertDialogCancel onClick={() => proceedToCheckout()}>
              Checkout Anyway
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setShowConfirmation(false);
                setIsCartOpen(false);
                router.push('/products');
              }}
            >
              Add More Items
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
