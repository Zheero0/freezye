
'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useCart } from '@/hooks/use-cart';
import { useToast } from '@/hooks/use-toast';
import { products } from '@/lib/products';
import { CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const locations = [
  "London, UK", "Manchester, UK", "Birmingham, UK", "Glasgow, UK", "Liverpool, UK",
  "Bristol, UK", "Edinburgh, UK", "Leeds, UK", "Cardiff, UK", "Dublin, IE"
];

const getRandomItem = <T,>(arr: T[]): T => {
    return arr[Math.floor(Math.random() * arr.length)];
};

const RecentPurchaseToast = ({ productName, location }: { productName: string, location: string }) => {
    return (
        <div className="flex items-center w-full">
            <div className="mr-3 shrink-0">
                <CheckCircle className="h-6 w-6 text-green-500" />
            </div>
            <div className="flex-grow">
                <p className="font-medium text-sm text-foreground">
                    Someone in {location} just bought...
                </p>
                <p className="text-sm font-bold text-primary">
                    {productName}
                </p>
            </div>
        </div>
    );
};


export default function PurchaseNotifier() {
    const { toast } = useToast();
    const { isCartOpen } = useCart();
    const pathname = usePathname();

    useEffect(() => {
        let interval: NodeJS.Timeout | undefined;

        const isCheckoutFlow = isCartOpen || pathname.startsWith('/checkout');

        if (!isCheckoutFlow) {
            const showRandomToast = () => {
                const randomProduct = getRandomItem(products);
                const randomLocation = getRandomItem(locations);

                toast({
                    description: <RecentPurchaseToast productName={randomProduct.name} location={randomLocation} />,
                    className: cn('bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'),
                });
            };

            // Start with a delay, then set the interval
            const initialTimeout = setTimeout(() => {
                showRandomToast();
                interval = setInterval(showRandomToast, 7000);
            }, 3000);

            // Cleanup function
            return () => {
                clearTimeout(initialTimeout);
                if (interval) {
                    clearInterval(interval);
                }
            };
        }
        
        // If in checkout flow, do nothing and ensure any existing interval is cleared by the cleanup.
        return () => {
            if (interval) {
                clearInterval(interval);
            }
        };

    }, [toast, isCartOpen, pathname]);

    return null;
}
