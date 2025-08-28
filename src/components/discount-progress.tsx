
'use client';

import { useCart } from '@/hooks/use-cart';
import { Progress } from '@/components/ui/progress';
import { Gift } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';


export default function DiscountProgress() {
    const { getItemCount } = useCart();
    const itemCount = getItemCount();

    const itemsNeededForOffer = 3;
    const itemsAway = (itemsNeededForOffer - (itemCount % itemsNeededForOffer)) % itemsNeededForOffer;
    const progress = ((itemsNeededForOffer - itemsAway) / itemsNeededForOffer) * 100;
    const isOfferUnlocked = itemsAway === 0 && itemCount > 0;

    return (
        <div className="bg-muted p-4 rounded-lg text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
                <motion.div
                    key={itemCount} // Re-trigger animation when itemCount changes
                    initial={{ scale: 1, rotate: 0 }}
                    animate={{ scale: [1, 1.2, 1], rotate: [0, -10, 10, 0] }}
                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                >
                    <Gift className={cn("h-5 w-5", isOfferUnlocked ? "text-primary" : "text-muted-foreground")} />
                </motion.div>
                <p className="text-sm font-medium">
                    {isOfferUnlocked ? (
                        "You've unlocked a 3 for 2 deal!"
                    ) : (
                        `Add ${itemsAway} more item${itemsAway > 1 ? 's' : ''} to get one for free!`
                    )}
                </p>
            </div>
            <Progress value={progress} className="h-2" />
        </div>
    );
}
