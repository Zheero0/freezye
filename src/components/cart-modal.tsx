
'use client';

import React, { useState }from 'react';
import Link from 'next/link';
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

export default function CartModal() {
  const { isCartOpen, setIsCartOpen, items, subtotal, discount, total, getItemCount } = useCart();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const router = useRouter();
  const itemCount = getItemCount();

  const handleCheckout = () => {
    // Check if the user is missing out on the 3-for-2 deal
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

  return (
    <>
      <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
        <SheetContent className="flex flex-col w-full sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>Your Shopping Cart</SheetTitle>
            <SheetDescription>
              Review your items and proceed to checkout.
            </SheetDescription>
          </SheetHeader>
          {items.length > 0 ? (
            <>
              <div className="px-6 -mx-6 my-4">
                  <DiscountProgress />
              </div>
              <ScrollArea className="flex-grow pr-6 -mr-6 my-4">
                <div className="flex flex-col gap-4">
                  {items.map((item) => (
                      <CartItem item={item} key={item.id} />
                  ))}
                </div>
              </ScrollArea>
              <SheetFooter className="mt-auto">
                <div className="flex flex-col space-y-4 w-full">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span className='font-medium'>£{subtotal.toFixed(2)}</span>
                      </div>
                      {discount > 0 && (
                        <div className="flex justify-between text-green-600">
                          <span>3 for 2 Offer</span>
                          <span className='font-medium'>-£{discount.toFixed(2)}</span>
                        </div>
                      )}
                      <Separator />
                      <div className="flex justify-between font-bold text-base">
                        <span>Total</span>
                        <span>£{total.toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <Button onClick={() => { setIsCartOpen(false); router.push('/products'); }} size="lg" variant="outline" className="w-full">
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
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingCart className="h-16 w-16 text-muted-foreground mb-4" />
              <h2 className="text-2xl font-bold font-headline mb-2">Your Cart is Empty</h2>
              <p className="text-muted-foreground mb-6">Add some treats to get started!</p>
              <Button onClick={() => setIsCartOpen(false)}>Continue Shopping</Button>
            </div>
          )}
        </SheetContent>
      </Sheet>

      <AlertDialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <AlertDialogContent>
          <AlertDialogHeader className="text-center items-center">
            <motion.div
                animate={{ rotate: [-15, 15, -15, 0], scale: [1, 1.1, 1] }}
                transition={{ duration: 0.5, repeat: 1, repeatDelay: 2, ease: "easeInOut" }}
                className="bg-primary/20 text-primary rounded-full h-16 w-16 flex items-center justify-center mb-4"
            >
                <Gift className="h-8 w-8" />
            </motion.div>
            <AlertDialogTitle>Wait a second!</AlertDialogTitle>
            <AlertDialogDescription>
              You're so close to a great deal! Add {3 - (itemCount % 3)} more item(s) to get one for free with our "3 for 2" offer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="sm:justify-center">
            <AlertDialogCancel onClick={() => proceedToCheckout()}>Checkout Anyway</AlertDialogCancel>
            <AlertDialogAction onClick={() => {
              setShowConfirmation(false);
              setIsCartOpen(false);
              router.push('/products');
            }}>
              Add More Items
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
