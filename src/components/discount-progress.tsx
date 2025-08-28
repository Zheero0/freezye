
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

    const giftAnimation = {
        scale: [1, 1.1, 1],
        transition: {
            duration: 1,
            repeat: Infinity,
            repeatDelay: 4,
            ease: "easeInOut",
        }
    };
    
    return (
        <div className="bg-muted p-4 rounded-lg text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
                <motion.div
                    animate={giftAnimation}
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
