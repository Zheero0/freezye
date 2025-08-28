
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useOrders } from '@/hooks/use-orders';
import { OrdersProvider } from '@/components/orders-provider';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Candy } from 'lucide-react';
import type { Order } from '@/types';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import BrandedLoader from '@/components/branded-loader';

function OrderDetails() {
    const params = useParams();
    const router = useRouter();
    const { getOrderById, updateOrderStatus } = useOrders();
    const [order, setOrder] = useState<Order | undefined | null>(undefined);
    const [isClient, setIsClient] = useState(false);
    const { toast } = useToast();

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
                    title="Summoning Order Details..."
                    description="Please wait while we fetch the complete order information."
                 />
            </div>
        );
    }

    if (order === null) {
        return (
            <div className="text-center py-12 container mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-2xl font-bold">Order not found</h2>
                <p className="text-muted-foreground">The requested order could not be located.</p>
                <Button onClick={() => router.push('/admin')} className="mt-4">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Orders
                </Button>
            </div>
        );
    }
    
    const getStatusVariant = (status: Order['status']) => {
        switch (status) {
          case 'Processing': return 'default';
          case 'Shipped': return 'secondary';
          case 'Delivered': return 'outline';
          case 'Cancelled': return 'destructive';
          default: return 'default';
        }
    };
    
    const StatusSelector = ({ order }: { order: Order }) => (
        <Select
            value={order.status}
            onValueChange={(value) => updateOrderStatus(order.id, value as Order['status'])}
        >
            <SelectTrigger className="w-40 focus:ring-0 focus:ring-offset-0">
                <SelectValue asChild>
                    <Badge variant={getStatusVariant(order.status)} className="capitalize text-sm py-1 px-3">
                        {order.status}
                    </Badge>
                </SelectValue>
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="Processing">Processing</SelectItem>
                <SelectItem value="Shipped">Shipped</SelectItem>
                <SelectItem value="Delivered">Delivered</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
            </SelectContent>
        </Select>
    );

    return (
        <div className="space-y-6 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" onClick={() => router.push('/admin')}>
                    <ArrowLeft className="h-4 w-4" />
                    <span className="sr-only">Back to orders</span>
                </Button>
                <div>
                    <h1 className="text-2xl font-bold font-headline">Order #{order.id.slice(-6)}</h1>
                    <p className="text-muted-foreground">
                        Placed on {new Date(order.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Order Items</CardTitle>
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

                    <Card>
                        <CardHeader><CardTitle>Payment & Shipping</CardTitle></CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Shipping Method</span>
                                <span className="font-medium capitalize">{order.shipping}</span>
                            </div>
                            <Separator/>
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
                            <div className="flex justify-between font-bold">
                                <span>Total</span>
                                <span>£{order.total.toFixed(2)}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <div className="space-y-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Status</CardTitle>
                            <StatusSelector order={order} />
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Customer Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-1 text-sm">
                           <p className="font-medium">{order.customer.name}</p>
                           <p className="text-muted-foreground">{order.customer.email}</p>
                           <Separator className="my-2"/>
                           <p>{order.customer.street}</p>
                           <p>{order.customer.city}, {order.customer.zip}</p>
                           <p>{order.customer.country}</p>
                        </CardContent>
                        {order.referralSource && (
                            <CardFooter>
                                <p className="text-xs text-muted-foreground">Referred from: <span className="font-medium capitalize">{order.referralSource}</span></p>
                            </CardFooter>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    );
}

export default function OrderDetailsPage() {
    return (
        <OrdersProvider>
            <OrderDetails />
        </OrdersProvider>
    )
}
