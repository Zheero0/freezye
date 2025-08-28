
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useOrders } from '@/hooks/use-orders';
import { OrdersProvider } from '@/components/orders-provider';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { CheckCircle, ShoppingBag, Candy } from 'lucide-react';
import type { Order } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import AnimatedSweets from '@/components/animated-sweets';
import BrandedLoader from '@/components/branded-loader';

function OrderConfirmation() {
    const params = useParams();
    const router = useRouter();
    const { getOrderById } = useOrders();
    const [order, setOrder] = useState<Order | undefined | null>(undefined);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (isClient && typeof window !== 'undefined' && params.id) {
            const foundOrder = getOrderById(params.id as string);
            setOrder(foundOrder);
        }
    }, [isClient, getOrderById, params.id]);

    if (!isClient || order === undefined) {
        return (
             <div className="relative min-h-[calc(100vh-10rem)] flex items-center justify-center">
                <BrandedLoader 
                    description="Please wait while we fetch your order details."
                />
            </div>
        );
    }

    if (order === null) {
        return (
            <div className="text-center py-12 container mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-2xl font-bold">Order not found</h2>
                <p className="text-muted-foreground">The requested order could not be located.</p>
                <Button onClick={() => router.push('/')} className="mt-4">
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    Continue Shopping
                </Button>
            </div>
        );
    }
    
    return (
        <div className="space-y-6 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Card className="text-center py-8 bg-secondary">
                <CardHeader>
                    <div className="mx-auto bg-green-500 rounded-full h-12 w-12 flex items-center justify-center mb-4">
                        <CheckCircle className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-2xl md:text-3xl font-bold font-headline">Thank You For Your Order!</CardTitle>
                    <CardDescription className="text-base">
                        Your cosmic treats are being prepared. Order ID: #{order.id.slice(-6)}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                     <Button asChild>
                        <Link href="/products">
                            <ShoppingBag className="mr-2 h-4 w-4" />
                            Continue Shopping
                        </Link>
                    </Button>
                </CardContent>
            </Card>

            <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Order Summary</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="hidden md:table-cell">Image</TableHead>
                                        <TableHead>Product</TableHead>
                                        <TableHead>Quantity</TableHead>
                                        <TableHead className="text-right">Total</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {order.items.map(item => (
                                        <TableRow key={item.id}>
                                            <TableCell className="hidden md:table-cell">
                                                <div className="w-16 h-16 bg-muted rounded-md flex items-center justify-center">
                                                    <Candy className="h-8 w-8 text-muted-foreground" />
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <p className="font-medium">{item.name}</p>
                                                <p className="text-sm text-muted-foreground">£{item.price.toFixed(2)}</p>
                                            </TableCell>
                                            <TableCell>x{item.quantity}</TableCell>
                                            <TableCell className="text-right font-medium">£{(item.price * item.quantity).toFixed(2)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                             <CardTitle>Shipping To</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-1 text-sm">
                                <p className="font-medium">{order.customer.name}</p>
                                <p>{order.customer.street}</p>
                                <p>{order.customer.city}, {order.customer.zip}</p>
                                <p>{order.customer.country}</p>
                            </div>
                            <div className="aspect-video rounded-md overflow-hidden bg-muted flex items-center justify-center">
                                <p className="text-muted-foreground text-sm">Map Placeholder</p>
                            </div>
                        </CardContent>
                    </Card>

                     <Card>
                        <CardHeader><CardTitle>Total</CardTitle></CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span>£{order.subtotal.toFixed(2)}</span>
                            </div>
                             {order.discount > 0 && (
                                <div className="flex justify-between text-green-600">
                                    <span>Discount</span>
                                    <span>-£{order.discount.toFixed(2)}</span>
                                </div>
                            )}
                             <div className="flex justify-between">
                                <span>Shipping</span>
                                <span>£{order.shippingCost.toFixed(2)}</span>
                            </div>
                            <Separator/>
                            <div className="flex justify-between font-bold">
                                <span>Total Paid</span>
                                <span>£{order.total.toFixed(2)}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

export default function OrderConfirmationPage() {
    return (
        <OrdersProvider>
            <OrderConfirmation />
        </OrdersProvider>
    )
}
