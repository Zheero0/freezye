
'use client';

import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  reviewCount?: number;
  className?: string;
}

export default function StarRating({ rating, reviewCount, className }: StarRatingProps) {
  return (
    <div className={cn('flex items-center justify-center gap-2', className)}>
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => {
          const ratingValue = i + 1;
          return (
            <Star
              key={i}
              className={cn(
                'h-5 w-5',
                ratingValue <= Math.round(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground'
              )}
            />
          );
        })}
      </div>
      {reviewCount !== 0 && <span className="text-sm text-muted-foreground">({reviewCount})</span>}
    </div>
  );
}
