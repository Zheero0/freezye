
'use client';

import * as React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { cn } from '@/lib/utils';
import { services } from '@/lib/services';
import type { Service } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, ArrowLeft, Check as CheckIcon, Phone, Mail, StickyNote, CreditCard, Sparkles, MapPin, Truck, Package, Loader2, Plus, Minus, Wallet } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { getAvailability, getAvailableDates, removeAvailability } from '@/lib/availability';

const repaintCost = 20;
const collectionFee = 10;

// Type definition for form values
type BookingFormValues = {
  serviceId: string;
  quantity: number;
  repaint: boolean;
  deliveryMethod: 'collection' | 'dropoff';
  paymentMethod: 'card' | 'cash';
  bookingDate?: Date;
  bookingTime?: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  pickupAddress?: string;
  notes?: string;
};

const steps = [
  { id: 'service', title: 'Select Service' },
  { id: 'delivery', title: 'Delivery Method' },
  { id: 'schedule', title: 'Schedule' },
  { id: 'details', title: 'Your Details' },
  { id: 'payment', title: 'Payment Method' },
  { id: 'confirm', title: 'Confirmation' },
];

if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
  throw new Error('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not set in the environment variables.');
}
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const CheckoutForm = ({ onPaymentSuccess, isProcessing }: { onPaymentSuccess: (paymentIntentId: string) => void, isProcessing: boolean }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) {
      return;
    }
    setIsSubmitting(true);
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/book`,
      },
      redirect: 'if_required',
    });

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Payment Failed',
        description: error.message || 'There was a problem processing your payment.',
      });
      setIsSubmitting(false);
    } else if (paymentIntent) {
      onPaymentSuccess(paymentIntent.id); 
    }
  };

  return (
    <div id="payment-form">
      <PaymentElement />
      <Button
        type="button"
        onClick={handleSubmit}
        size="lg"
        disabled={!stripe || isSubmitting || isProcessing}
        className="w-full mt-6"
      >
        {isSubmitting || isProcessing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <span>Pay & Confirm</span>
            <CreditCard className="h-4 w-4 ml-2" />
          </>
        )}
      </Button>
    </div>
  )
}

function BookingFormContents() {
  const [currentStep, setCurrentStep] = React.useState(0);
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const { toast } = useToast();
  const [clientSecret, setClientSecret] = React.useState<string | null>(null);
  const [isProcessing, setIsProcessing] = React.useState(false);
  
  const [availableDates, setAvailableDates] = React.useState<Date[]>([]);
  const [availableTimes, setAvailableTimes] = React.useState<string[]>([]);

  React.useEffect(() => {
    getAvailableDates().then(dates => {
      setAvailableDates(dates);
    });
  }, []);

  const form = useForm<BookingFormValues>({
    defaultValues: {
      serviceId: 'standard',
      quantity: 1,
      repaint: false,
      deliveryMethod: 'dropoff',
      paymentMethod: 'card',
      pickupAddress: '',
      notes: '',
      fullName: '',
      email: '',
      phoneNumber: '',
    },
  });

  const { watch, setValue, getValues, trigger } = form;
  const watchedValues = watch();

  const selectedService = services.find(s => s.id === watchedValues.serviceId);
  const subtotal = selectedService ? selectedService.price * watchedValues.quantity : 0;
  const repaintTotal = watchedValues.repaint ? repaintCost * watchedValues.quantity : 0;
  const deliveryFee = watchedValues.deliveryMethod === 'collection' ? collectionFee : 0;
  const totalCost = subtotal + repaintTotal + deliveryFee;

  React.useEffect(() => {
    if (watchedValues.bookingDate) {
      const dateString = format(watchedValues.bookingDate, 'yyyy-MM-dd');
      getAvailability(dateString).then(slots => {
        setAvailableTimes(slots);
      });
    } else {
      setAvailableTimes([]);
    }
  }, [watchedValues.bookingDate]);

  const createPaymentIntent = async () => {
    try {
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: totalCost * 100 }),
      });
      if (!response.ok) throw new Error('Failed to create payment intent');
      const { clientSecret } = await response.json();
      setClientSecret(clientSecret);
      return true;
    } catch (error) {
      console.error('Error creating payment intent:', error);
      toast({ variant: 'destructive', title: 'Booking Error', description: 'Could not initialize payment.' });
      return false;
    }
  }
  
  const handleFinalSubmit = async (paymentIntentId?: string) => {
    setIsProcessing(true);
    try {
        const data = getValues();
        if (!data.bookingDate || !data.bookingTime) {
            toast({ variant: 'destructive', title: 'Missing Information', description: 'Please ensure a date and time are selected.' });
            setIsProcessing(false);
            return;
        }

        const orderData = {
            ...data,
            bookingDate: format(data.bookingDate, 'yyyy-MM-dd'),
            paymentIntentId: paymentIntentId,
        };

        const response = await fetch('/api/create-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to save booking');
        }

        await removeAvailability(format(data.bookingDate, 'yyyy-MM-dd'), data.bookingTime);
        setIsSubmitted(true);
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        console.error('Error creating order: ', message);
        toast({
            variant: 'destructive',
            title: 'Booking Failed',
            description: message || 'There was an issue creating your booking. Please contact support.',
        });
    } finally {
        setIsProcessing(false);
    }
  };

  const handleNext = async () => {
    setIsProcessing(true);
    let fieldsToValidate: (keyof BookingFormValues)[] = [];
    if (currentStep === 0) fieldsToValidate = ['serviceId', 'quantity'];
    if (currentStep === 1) fieldsToValidate = ['deliveryMethod'];
    if (currentStep === 2) {
      if (!getValues('bookingDate') || !getValues('bookingTime')) {
         toast({ variant: "destructive", title: "Incomplete Selection", description: "Please select both a date and time." });
         setIsProcessing(false);
         return;
      }
    }
    if (currentStep === 3) fieldsToValidate = ['fullName', 'email', 'phoneNumber', 'pickupAddress'];
    if (currentStep === 4) fieldsToValidate = ['paymentMethod'];

    const isValid = await trigger(fieldsToValidate);

    if (isValid) {
      if (currentStep < steps.length - 1) {
        if (currentStep === steps.length - 2 && watchedValues.paymentMethod === 'card') {
            const paymentIntentCreated = await createPaymentIntent();
            if(paymentIntentCreated) setCurrentStep(s => s + 1);
        } else {
            setCurrentStep(s => s + 1);
        }
      }
    }
    setIsProcessing(false);
  };
  
  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(s => s - 1);
      if(currentStep === steps.length - 1) setClientSecret(null);
    }
  };
  
  if (isSubmitted) {
    const values = getValues();
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
        <Card className="bg-card/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <motion.div className="mx-auto bg-primary text-primary-foreground w-16 h-16 rounded-full flex items-center justify-center mb-4" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.2 }}>
              <CheckIcon className="w-8 h-8" />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <CardTitle className="text-3xl font-headline">Booking Confirmed!</CardTitle>
              <CardDescription className="text-lg text-muted-foreground">Thank you, {values.fullName}! Your booking is complete.</CardDescription>
            </motion.div>
          </CardHeader>
          <CardContent className="text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
              <p className="mb-2">A confirmation email has been sent to <span className="font-semibold text-primary">{values.email}</span>.</p>
              {values.bookingDate && values.bookingTime && <p className="text-muted-foreground">We'll see you on {format(values.bookingDate, 'PPP')} at {values.bookingTime}.</p>}
              <Button onClick={() => window.location.reload()} className="mt-8">Book Another Service</Button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  const options: StripeElementsOptions = {
    clientSecret: clientSecret || undefined,
    appearance: { theme: 'night', variables: { colorPrimary: '#8EACFF', colorBackground: '#111111', colorText: '#ffffff' }},
  };
  
  const iconAnimation = {
    scale: [1, 1.1, 1],
    y: [0, -5, 0],
    transition: {
      duration: 1,
      ease: "easeInOut",
      repeat: Infinity,
      repeatDelay: 2,
    },
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={(e) => e.preventDefault()}>
            <Card className="bg-card/80 backdrop-blur-sm transition-shadow duration-300">
              <CardHeader>
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm font-medium text-primary">{`Step ${currentStep + 1} of ${steps.length}`}</p>
                  <p className="text-sm text-muted-foreground">{steps[currentStep]?.title}</p>
                </div>
                <div className="flex w-full gap-2">
                  {steps.map((step, index) => (
                    <div key={step.id} className={cn("h-1 rounded-full w-full bg-secondary", index <= currentStep && "bg-primary")} />
                  ))}
                </div>
              </CardHeader>
              <AnimatePresence mode="wait">
                <motion.div key={currentStep} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.3 }}>
                  <CardContent className="min-h-[420px]">
                    {currentStep === 0 && (
                      <div className="space-y-8">
                        <div>
                          <Label className="text-lg font-semibold mb-4 block">Select Turnaround Time</Label>
                           <RadioGroup onValueChange={(value) => setValue('serviceId', value)} defaultValue={watchedValues.serviceId} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {services.map(service => (
                                <Label key={service.id} htmlFor={service.id} className={cn("block rounded-lg border p-4 cursor-pointer transition-all", watchedValues.serviceId === service.id ? 'border-primary bg-primary/10 shadow-lg' : 'border-border hover:border-primary/50')}>
                                <RadioGroupItem value={service.id} id={service.id} className="sr-only" />
                                <h3 className="font-bold text-lg mb-1">{service.name}</h3>
                                <p className="text-sm text-muted-foreground mb-2">{service.description}</p>
                                <p className="font-bold text-xl text-white">£{service.price}</p>
                                </Label>
                            ))}
                          </RadioGroup>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                          <div>
                              <Label htmlFor="quantity" className="text-lg font-semibold mb-2 block">Quantity</Label>
                              <div className="flex items-center gap-2">
                                  <Button type="button" variant="outline" onClick={() => setValue('quantity', Math.max(1, (watchedValues.quantity || 1) - 1))}><Minus className="h-4 w-4" /></Button>
                                  <Input id="quantity" type="number" className="w-20 text-center text-lg font-bold" {...form.register('quantity', { valueAsNumber: true, min: 1 })} />
                                  <Button type="button" variant="outline" onClick={() => setValue('quantity', (watchedValues.quantity || 1) + 1)}><Plus className="h-4 w-4" /></Button>
                              </div>
                          </div>
                           <div className="flex items-center space-x-3 space-y-0 p-4 rounded-lg border border-border bg-secondary/50">
                              <Checkbox id="repaint" checked={watchedValues.repaint} onCheckedChange={(checked) => setValue('repaint', !!checked)} />
                              <div className="space-y-1 leading-none">
                                  <Label htmlFor="repaint" className="font-semibold text-base md:text-lg">Add Repaint?</Label>
                                  <p className="text-sm text-muted-foreground">+£{repaintCost} per pair</p>
                              </div>
                          </div>
                        </div>
                      </div>
                    )}
                    {currentStep === 1 && (
                       <div>
                          <Label className="text-lg font-semibold mb-4 block">How will you get your sneakers to us?</Label>
                           <RadioGroup onValueChange={(value) => setValue('deliveryMethod', value as 'collection' | 'dropoff')} defaultValue={watchedValues.deliveryMethod} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <Label htmlFor="collection" className={cn("flex flex-col items-center justify-center rounded-lg border p-6 cursor-pointer transition-all h-48", watchedValues.deliveryMethod === "collection" ? 'border-primary bg-primary/10 shadow-lg' : 'border-border hover:border-primary/50')}>
                                  <RadioGroupItem value="collection" id="collection" className="sr-only" />
                                  <motion.div animate={iconAnimation}><Truck className="w-10 h-10 mb-4 text-primary"/></motion.div>
                                  <div className="flex items-baseline gap-2 mb-1"><h3 className="font-bold text-lg">We Collect</h3><span className="text-xs text-muted-foreground">(fees inc)</span></div>
                                  <p className="text-sm text-muted-foreground text-center">A £{collectionFee} fee is applied for courier collection from your address.</p>
                              </Label>
                              <Label htmlFor="dropoff" className={cn("flex flex-col items-center justify-center rounded-lg border p-6 cursor-pointer transition-all h-48", watchedValues.deliveryMethod === "dropoff" ? 'border-primary bg-primary/10 shadow-lg' : 'border-border hover:border-primary/50')}>
                                  <RadioGroupItem value="dropoff" id="dropoff" className="sr-only" />
                                  <motion.div animate={iconAnimation}><Package className="w-10 h-10 mb-4 text-primary"/></motion.div>
                                  <h3 className="font-bold text-lg mb-1">You Drop Off</h3>
                                  <div className="text-sm text-muted-foreground text-center">
                                      <p className="font-semibold">Store first St Modwen Rd</p>
                                      <p>Trafford Park, M32 0ZF</p>
                                      <p className="mt-2 text-xs">Mon - Sat: 8am - 6pm</p>
                                      <p className="text-xs">Sun: 10am - 4pm</p>
                                  </div>
                              </Label>
                          </RadioGroup>
                       </div>
                    )}
                    {currentStep === 2 && (
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-4">
                        <div>
                          <Label className="text-lg font-semibold mb-4 block">Select Date</Label>
                           <Calendar mode="single" selected={watchedValues.bookingDate} onSelect={(date) => { if (date) { setValue('bookingDate', date); setValue('bookingTime', undefined); }}} disabled={(date) => { if (!date) return true; const dateString = format(date, 'yyyy-MM-dd'); const isDateAvailable = availableDates.some(d => format(d, 'yyyy-MM-dd') === dateString); const isPast = date.setHours(0,0,0,0) < new Date().setHours(0,0,0,0); return !isDateAvailable || isPast; }} initialFocus />
                        </div>
                        <div className="flex flex-col mt-8 md:mt-0">
                          <Label className="text-lg font-semibold mb-4 block">Select Time Slot</Label>
                          {watchedValues.bookingDate ? (<> {availableTimes.length > 0 ? (<RadioGroup onValueChange={(value) => setValue('bookingTime', value)} value={watchedValues.bookingTime} className="grid grid-cols-2 gap-2"> {availableTimes.map((time) => (<div key={time} className="flex-1"><RadioGroupItem value={time} id={time} className="sr-only peer" /><Label htmlFor={time} className="block text-center p-4 rounded-md border border-input peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 cursor-pointer">{time}</Label></div>))} </RadioGroup>) : (<div className="flex items-center justify-center h-full text-muted-foreground bg-secondary/50 rounded-md p-4 text-center"><p>No slots available for this date.</p></div>)} </>) : (<div className="flex items-center justify-center h-full text-muted-foreground bg-secondary/50 rounded-md p-8 text-center md:min-h-[290px]"><p>Please select a date first.</p></div>)}
                        </div>
                      </div>
                    )}
                    {currentStep === 3 && (
                      <div className="space-y-4">
                          <div><Label className="text-lg">Full Name</Label><Input {...form.register('fullName', { required: true })} /></div>
                           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div><Label className="text-lg">Email Address</Label><Input type="email" {...form.register('email', { required: true })} /></div>
                              <div><Label className="text-lg">Phone</Label><Input type="tel" {...form.register('phoneNumber', { required: true })} /></div>
                           </div>
                           {watchedValues.deliveryMethod === 'collection' && (<div><Label className="text-lg" >Pickup Address</Label><Textarea placeholder='Address and Postcode' {...form.register('pickupAddress', { required: watchedValues.deliveryMethod === 'collection' })} /></div>)}
                          <div><Label className="text-lg">Additional Notes (Optional)</Label><Textarea placeholder="e.g. specific stains, areas to focus on" {...form.register('notes')} /></div>
                      </div>
                    )}
                     {currentStep === 4 && (
                       <div>
                          <Label className="text-lg font-semibold mb-4 block">How would you like to pay?</Label>
                           <RadioGroup onValueChange={(value) => setValue('paymentMethod', value as 'card' | 'cash')} defaultValue={watchedValues.paymentMethod} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <Label htmlFor="card" className={cn("flex flex-col items-center justify-center rounded-lg border p-6 cursor-pointer transition-all h-48", watchedValues.paymentMethod === "card" ? 'border-primary bg-primary/10 shadow-lg' : 'border-border hover:border-primary/50')}>
                                  <RadioGroupItem value="card" id="card" className="sr-only" /><motion.div animate={iconAnimation}><CreditCard className="w-10 h-10 mb-4 text-primary"/></motion.div><h3 className="font-bold text-lg mb-1">Pay by Card</h3><p className="text-sm text-muted-foreground text-center">Secure online payment with Stripe.</p>
                              </Label>
                              <Label htmlFor="cash" className={cn("flex flex-col items-center justify-center rounded-lg border p-6 cursor-pointer transition-all h-48", watchedValues.paymentMethod === "cash" ? 'border-primary bg-primary/10 shadow-lg' : 'border-border hover:border-primary/50')}>
                                  <RadioGroupItem value="cash" id="cash" className="sr-only" /><motion.div animate={iconAnimation}><Wallet className="w-10 h-10 mb-4 text-primary"/></motion.div><h3 className="font-bold text-lg mb-1">Pay with Cash</h3><p className="text-sm text-muted-foreground text-center">Pay in person upon drop-off or collection.</p>
                              </Label>
                          </RadioGroup>
                       </div>
                    )}
                    {currentStep === 5 && (
                      <div>
                          <h3 className="text-2xl font-headline font-bold mb-6">Confirm Your Booking</h3>
                          <div className="space-y-4 p-6 rounded-lg border border-border bg-secondary/50">
                              <div className="flex justify-between"><span className="text-muted-foreground">Service</span><span className="font-semibold text-white">{selectedService?.name} x {watchedValues.quantity}</span></div>
                              {watchedValues.repaint && (<div className="flex justify-between"><span className="text-muted-foreground">Repaint</span><span className="font-semibold text-white">Yes x {watchedValues.quantity}</span></div>)}
                              {deliveryFee > 0 && (<div className="flex justify-between"><span className="text-muted-foreground">Collection Fee</span><span className="font-semibold text-white">£{deliveryFee.toFixed(2)}</span></div>)}
                              <div className="flex justify-between"><span className="text-muted-foreground">{watchedValues.deliveryMethod === 'collection' ? 'Collection' : 'Drop-off'} Time</span><span className="font-semibold text-white text-right">{watchedValues.bookingDate ? format(watchedValues.bookingDate, 'E, d MMM yyyy') : ''} at {watchedValues.bookingTime}</span></div>
                               {watchedValues.deliveryMethod === 'collection' && watchedValues.pickupAddress && (<div className="flex justify-between items-start"><span className="text-muted-foreground">Address</span><span className="font-semibold text-white text-right max-w-[70%]">{watchedValues.pickupAddress}</span></div>)}
                              <div className="flex justify-between"><span className="text-muted-foreground">Contact</span><span className="font-semibold text-white text-right">{watchedValues.email}</span></div>
                              <div className="border-t border-border my-4"></div>
                              <div className="flex justify-between text-xl"><span className="text-muted-foreground">Total</span><span className="font-bold text-primary">£{totalCost.toFixed(2)}</span></div>
                          </div>
                          <div className="mt-6">
                              {watchedValues.paymentMethod === 'card' ? (
                                clientSecret ? (<Elements stripe={stripePromise} options={options}><CheckoutForm onPaymentSuccess={(id) => handleFinalSubmit(id)} isProcessing={isProcessing} /></Elements>) : (<div className="flex items-center justify-center h-24"><Loader2 className="mr-2 h-8 w-8 animate-spin text-primary" /><span className="text-muted-foreground">Initializing payment...</span></div>)
                              ) : (
                                <Button size="lg" className="w-full" onClick={() => handleFinalSubmit()} disabled={isProcessing}>
                                    {isProcessing ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Processing...</> : <>Confirm Cash Booking <Wallet className="h-4 w-4 ml-2"/></>}
                                </Button>
                              )}
                          </div>
                      </div>
                    )}
                  </CardContent>
                </motion.div>
              </AnimatePresence>
              <CardFooter className="flex justify-between items-center w-full border-t border-border pt-6">
                  <div>{currentStep > 0 && (<Button type="button" variant="ghost" onClick={handlePrev} disabled={isProcessing} className="text-muted-foreground flex items-center gap-2"><ArrowLeft className="h-4 w-4" /><span>Back</span></Button>)}</div>
                  <div className="flex items-center gap-4">
                      <div className="text-right"><p className="text-sm text-muted-foreground">Total</p><p className="text-2xl font-bold text-white">£{totalCost.toFixed(2)}</p></div>
                      {currentStep < steps.length -1 && (
                          <Button type="button" onClick={handleNext} size="lg" disabled={isProcessing} className="flex">
                            {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Next <ArrowRight className="h-4 w-4 ml-2" /></> }
                          </Button>
                      )}
                  </div>
              </CardFooter>
            </Card>
      </form>
    </FormProvider>
  );
}


export function BookingForm() {
  return <BookingFormContents />;
}
