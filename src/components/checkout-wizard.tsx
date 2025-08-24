
"use client";

import { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCart } from '@/hooks/use-cart';
import { useOrders } from '@/hooks/use-orders';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import CartSummary from './cart-summary';
import { Skeleton } from './ui/skeleton';
import { Loader2, Candy, CheckCircle } from 'lucide-react';
import BrandedLoader from './branded-loader';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const checkoutSchema = z.object({
    name: z.string().min(2, "Name is too short"),
    email: z.string().email("Invalid email address"),
    street: z.string().min(5, "Street address is too short"),
    city: z.string().min(2, "City is too short"),
    zip: z.string().min(4, "Invalid ZIP code"),
    country: z.string().min(2, "Country is too short"),
    referralSource: z.enum(['tiktok', 'instagram', 'friend', 'other', '']),
    shippingMethod: z.enum(['standard', 'express']),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

type ProcessingState = 'idle' | 'processing_payment' | 'finalizing_order';

function CheckoutForm({ clientSecret }: { clientSecret: string }) {
  const [processingState, setProcessingState] = useState<ProcessingState>('idle');
  const cart = useCart();
  const { addOrder } = useOrders();
  const { toast } = useToast();
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      name: '', email: '', street: '', city: '', zip: '', country: '',
      referralSource: '',
      shippingMethod: 'standard',
    },
  });

  const onSubmit = async (data: CheckoutFormValues) => {
    if (!stripe || !elements || !clientSecret) {
        toast({
            title: "Error",
            description: "Payment services are not ready. Please wait a moment and try again.",
            variant: "destructive"
        });
      return;
    }
    
    setProcessingState('processing_payment');

    const { error } = await stripe.confirmPayment({
        elements,
        redirect: 'if_required',
    });

    if (error) {
        toast({
            title: "Payment failed",
            description: error.message || "An unexpected error occurred.",
            variant: "destructive",
        });
        setProcessingState('idle');
    } else {
        setProcessingState('finalizing_order');
        const {name, email, street, city, zip, country, referralSource} = data;
        const newOrder = addOrder({
            customer: { name, email, street, city, zip, country },
            items: cart.items,
            subtotal: cart.subtotal,
            discount: cart.discount,
            total: cart.total,
            shipping: data.shippingMethod,
            referralSource
        });
        cart.clearCart();
        toast({
            title: "Order Placed!",
            description: "Thank you for your purchase. Your cosmic treats are on their way!",
        });
        
        // Slight delay before redirecting to allow the user to see the state change
        setTimeout(() => {
            router.push(`/order-confirmation/${newOrder.id}`);
        }, 1000);
    }
  };

  const getButtonContent = () => {
    switch(processingState) {
        case 'processing_payment':
            return <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing Payment...</>;
        case 'finalizing_order':
            return <><CheckCircle className="mr-2 h-4 w-4" /> Finalizing Order...</>;
        case 'idle':
        default:
            return 'Place Order';
    }
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
            <Card>
                <CardHeader>
                <CardTitle>Contact &amp; Shipping Address</CardTitle>
                <CardDescription>Where should we send your goodies?</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="name" render={({ field }) => ( <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="email" render={({ field }) => ( <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>)} />
                </div>
                <FormField control={form.control} name="street" render={({ field }) => ( <FormItem><FormLabel>Street Address</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField control={form.control} name="city" render={({ field }) => ( <FormItem><FormLabel>City</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="zip" render={({ field }) => ( <FormItem><FormLabel>ZIP / Postal Code</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="country" render={({ field }) => ( <FormItem><FormLabel>Country</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                </div>
                <FormField control={form.control} name="referralSource" render={({ field }) => (<FormItem><FormLabel>How did you hear about us?</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a source" /></SelectTrigger></FormControl><SelectContent><SelectItem value="tiktok">TikTok</SelectItem><SelectItem value="instagram">Instagram</SelectItem><SelectItem value="friend">From a Friend</SelectItem><SelectItem value="other">Other</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                </CardContent>
            </Card>
            
            <Card>
                <CardHeader><CardTitle>Shipping Method</CardTitle></CardHeader>
                <CardContent>
                <FormField control={form.control} name="shippingMethod" render={({ field }) => (
                    <FormItem className="space-y-3">
                    <FormControl>
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">
                        <FormItem className="flex items-center space-x-3 space-y-0 border rounded-md p-4"><FormControl><RadioGroupItem value="standard" /></FormControl><FormLabel className="font-normal w-full">Standard Shipping (5-7 days) - £4.99</FormLabel></FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0 border rounded-md p-4"><FormControl><RadioGroupItem value="express" /></FormControl><FormLabel className="font-normal w-full">Express Shipping (2-3 days) - £12.99</FormLabel></FormItem>
                        </RadioGroup>
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}/>
                </CardContent>
            </Card>

             <Card>
                <CardHeader>
                <CardTitle>Payment Information</CardTitle>
                <CardDescription>Your payment details are securely handled by Stripe.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <PaymentElement />
                </CardContent>
            </Card>

            <div className="mt-6 flex justify-end">
                <Button type="submit" size="lg" className="w-full md:w-auto" disabled={processingState !== 'idle' || !stripe || !elements || !clientSecret}>
                    {getButtonContent()}
                </Button>
            </div>
        </div>
        <div className="md:col-span-1">
          <CartSummary />
        </div>
      </form>
    </FormProvider>
  );
}

export default function CheckoutWizard() {
  const [clientSecret, setClientSecret] = useState('');
  const cart = useCart();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (cart.total > 0) {
      fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: Math.round(cart.total * 100) }),
      })
      .then(res => res.json())
      .then(data => {
        if(data.clientSecret) {
          setClientSecret(data.clientSecret)
        } else if (data.error) {
          console.error("Error creating payment intent:", data.error);
        }
      }).catch(error => {
        console.error("Fetch error for payment intent:", error);
      });
    }
  }, [cart.total]);


  if (!isClient) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-8">
                <Card>
                    <CardHeader>
                        <Skeleton className="h-6 w-48 mb-2" />
                        <Skeleton className="h-4 w-64" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <Skeleton className="h-6 w-32 mb-2" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                    </CardContent>
                </Card>
            </div>
            <div className="md:col-span-1">
                <Card>
                    <CardHeader><Skeleton className="h-6 w-32" /></CardHeader>
                    <CardContent className="space-y-4">
                        <Skeleton className="h-5 w-full" />
                        <Skeleton className="h-5 w-full" />
                        <Separator />
                        <Skeleton className="h-6 w-full" />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
  }

  if (cart.items.length === 0 && isClient) {
    return (
        <div className="flex items-center justify-center py-20">
            <Card className="max-w-md w-full text-center">
                <CardHeader>
                    <CardTitle>Your Cart is Empty</CardTitle>
                    <CardDescription>Looks like you haven't added any cosmic treats yet.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button onClick={() => router.push('/products')}>Go Shopping</Button>
                </CardContent>
            </Card>
        </div>
    );
  }

  const options = {
    clientSecret,
    appearance: {
        theme: 'stripe' as const,
        variables: {
            colorPrimary: '#f97316', // Orange
            colorBackground: '#ffffff',
            colorText: '#1c1917',
            colorDanger: '#dc2626',
            fontFamily: 'Lato, sans-serif',
            borderRadius: '0.5rem',
        }
    }
  };

  return (
    <>
      {clientSecret ? (
        <Elements stripe={stripePromise} options={options}>
          <CheckoutForm clientSecret={clientSecret} />
        </Elements>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6 relative rounded-lg overflow-hidden min-h-[60vh]">
                 <BrandedLoader 
                    title="Preparing Your Cosmic Treats..."
                    description="Please wait while we initialize a secure payment portal for your order."
                 />
            </div>
             <div className="md:col-span-1">
                 <CartSummary />
             </div>
        </div>
      )}
    </>
  )
}

    