
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
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel } from '@/components/ui/alert-dialog';
import { ArrowLeft, Candy, Package, Eye, Loader2, Copy } from 'lucide-react';
import type { Order } from '@/types';
import { useToast } from '@/hooks/use-toast';
import BrandedLoader from '@/components/branded-loader';

function OrderDetails() {
    const params = useParams();
    const router = useRouter();
    const { getOrderById, updateOrderStatus } = useOrders();
    const [order, setOrder] = useState<Order | undefined | null>(undefined);
    const [isClient, setIsClient] = useState(false);
    const { toast } = useToast();

    // State for label generation
    const [isGenerating, setIsGenerating] = useState(false);
    const [label, setLabel] = useState<{trackingNumber: string, labelUrl: string} | null>(null);
    const [isLabelModalOpen, setIsLabelModalOpen] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (isClient && typeof window !== 'undefined' && params.id) {
            const foundOrder = getOrderById(params.id as string);
            setOrder(foundOrder);
        }
    }, [isClient, getOrderById, params.id]);

    const handleCreateLabel = () => {
        if (!order) return;
        setIsGenerating(true);
        // Simulate API call
        setTimeout(() => {
            const fakeTrackingNumber = `FRZYE${Math.floor(1000000000 + Math.random() * 9000000000)}`;
            setLabel({
                trackingNumber: fakeTrackingNumber,
                labelUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=' // 1x1 transparent pixel
            });
            setIsGenerating(false);
            toast({
                title: 'Label Generated',
                description: `Tracking number: ${fakeTrackingNumber}`
            })
        }, 1500);
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast({ title: 'Copied to clipboard!'});
    }

    if (!isClient || order === undefined) {
        return (
             <div className="relative min-h-[calc(100vh-10rem)] flex items-center justify-center">
                 <BrandedLoader 
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
                            <div className="flex justify-between">
                                <span>Shipping</span>
                                <span>£{order.shippingCost?.toFixed(2) ?? '0.00'}</span>
                            </div>
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
                            <CardTitle>Shipping Label</CardTitle>
                            {!label && <CardDescription>Generate a new label for this shipment.</CardDescription>}
                        </CardHeader>
                        <CardContent>
                           {label ? (
                               <div className="space-y-3">
                                   <div>
                                       <p className="text-sm font-medium">Tracking Number</p>
                                       <div className="flex items-center gap-2">
                                         <p className="text-muted-foreground text-sm font-mono">{label.trackingNumber}</p>
                                         <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyToClipboard(label.trackingNumber)}>
                                             <Copy className="h-3 w-3" />
                                         </Button>
                                       </div>
                                   </div>
                                   <Button onClick={() => setIsLabelModalOpen(true)} variant="secondary" className="w-full">
                                       <Eye className="mr-2 h-4 w-4"/> View Label
                                   </Button>
                               </div>
                           ) : (
                                <Button onClick={handleCreateLabel} disabled={isGenerating} className="w-full">
                                    {isGenerating ? (
                                        <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Generating...</>
                                    ) : (
                                        <><Package className="mr-2 h-4 w-4"/> Generate Shipping Label</>
                                    )}
                                </Button>
                           )}
                        </CardContent>
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

            {label && (
                <AlertDialog open={isLabelModalOpen} onOpenChange={setIsLabelModalOpen}>
                    <AlertDialogContent className="max-w-lg w-full">
                        <AlertDialogHeader>
                            <AlertDialogTitle>Shipping Label</AlertDialogTitle>
                            <AlertDialogDescription>
                                This is a mock shipping label. In a real application, this would be a PDF or image from a shipping provider.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <div className="bg-white text-black p-4 rounded-md aspect-[4/6] max-h-[70vh] overflow-y-auto">
                            <div className="border-b-2 border-dashed border-black pb-4 text-center">
                                <h3 className="font-bold text-lg">FREEZYE COSMIC SWEETS</h3>
                                <p className="text-xs">Unit 42, Starship Enterprise, Outer Rim, NW10 7AB</p>
                                <p className="text-xs font-bold">www.freezye.com</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4 py-4 border-b-2 border-dashed border-black">
                                <div>
                                    <p className="text-xs font-bold">SHIP FROM:</p>
                                    <p className="text-xs">Freezye HQ</p>
                                    <p className="text-xs">Unit 42, Starship Enterprise</p>
                                    <p className="text-xs">Outer Rim, NW10 7AB, UK</p>
                                </div>
                                <div>
                                    <p className="text-xs font-bold">SHIP TO:</p>
                                    <p className="text-xs">{order.customer.name}</p>
                                    <p className="text-xs">{order.customer.street}</p>
                                    <p className="text-xs">{order.customer.city}, {order.customer.zip}</p>
                                    <p className="text-xs">{order.customer.country}</p>
                                </div>
                            </div>
                            <div className="py-4 text-center">
                                <p className="text-xs font-bold">TRACKING #: {label.trackingNumber}</p>
                                <div className="flex justify-center items-center py-2">
                                     <svg className="h-16 w-full" x="0px" y="0px" viewBox="0 0 320 60" >
                                        <g>
                                            <rect x="0" y="0" width="4" height="60" fill="black"/>
                                            <rect x="7" y="0" width="2" height="60" fill="black"/>
                                            <rect x="12" y="0" width="6" height="60" fill="black"/>
                                            <rect x="22" y="0" width="2" height="60" fill="black"/>
                                            <rect x="28" y="0" width="4" height="60" fill="black"/>
                                            <rect x="34" y="0" width="2" height="60" fill="black"/>
                                            <rect x="40" y="0" width="4" height="60" fill="black"/>
                                            <rect x="48" y="0" width="2" height="60" fill="black"/>
                                            <rect x="53" y="0" width="4" height="60" fill="black"/>
                                            <rect x="60" y="0" width="2" height="60" fill="black"/>
                                            <rect x="66" y="0" width="4" height="60" fill="black"/>
                                            <rect x="72" y="0" width="2" height="60" fill="black"/>
                                            <rect x="78" y="0" width="6" height="60" fill="black"/>
                                            <rect x="88" y="0" width="2" height="60" fill="black"/>
                                            <rect x="94" y="0" width="4" height="60" fill="black"/>
                                            <rect x="100" y="0" width="2" height="60" fill="black"/>
                                            <rect x="106" y="0" width="4" height="60" fill="black"/>
                                            <rect x="114" y="0" width="2" height="60" fill="black"/>
                                            <rect x="119" y="0" width="4" height="60" fill="black"/>
                                            <rect x="126" y="0" width="2" height="60" fill="black"/>
                                            <rect x="132" y="0" width="6" height="60" fill="black"/>
                                            <rect x="142" y="0" width="2" height="60" fill="black"/>
                                            <rect x="148" y="0" width="4" height="60" fill="black"/>
                                            <rect x="154" y="0" width="2" height="60" fill="black"/>
                                            <rect x="160" y="0" width="4" height="60" fill="black"/>
                                            <rect x="168" y="0" width="2" height="60" fill="black"/>
                                            <rect x="173" y="0" width="4" height="60" fill="black"/>
                                            <rect x="180" y="0" width="2" height="60" fill="black"/>
                                            <rect x="186" y="0" width="4" height="60" fill="black"/>
                                            <rect x="192" y="0" width="2" height="60" fill="black"/>
                                            <rect x="198" y="0" width="6" height="60" fill="black"/>
                                            <rect x="208" y="0" width="2" height="60" fill="black"/>
                                            <rect x="214" y="0" width="4" height="60" fill="black"/>
                                            <rect x="220" y="0" width="2" height="60" fill="black"/>
                                            <rect x="226" y="0" width="4" height="60" fill="black"/>
                                            <rect x="234" y="0" width="2" height="60" fill="black"/>
                                            <rect x="239" y="0" width="4" height="60" fill="black"/>
                                            <rect x="246" y="0" width="2" height="60" fill="black"/>
                                            <rect x="252" y="0" width="6" height="60" fill="black"/>
                                            <rect x="262" y="0" width="2" height="60" fill="black"/>
                                            <rect x="268" y="0" width="4" height="60" fill="black"/>
                                            <rect x="274" y="0" width="2" height="60" fill="black"/>
                                            <rect x="280" y="0" width="4" height="60" fill="black"/>
                                            <rect x="288" y="0" width="2" height="60" fill="black"/>
                                            <rect x="293" y="0" width="4" height="60" fill="black"/>
                                            <rect x="300" y="0" width="2" height="60" fill="black"/>
                                            <rect x="306" y="0" width="4" height="60" fill="black"/>
                                            <rect x="312" y="0" width="2" height="60" fill="black"/>
                                            <rect x="318" y="0" width="2" height="60" fill="black"/>
                                        </g>
                                    </svg>
                                </div>
                                <p className="font-mono text-sm pt-1 tracking-widest">{label.trackingNumber}</p>
                            </div>
                        </div>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Close</AlertDialogCancel>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}
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
