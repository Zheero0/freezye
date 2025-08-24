
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { products as allProducts } from '@/lib/products';
import { useCart } from '@/hooks/use-cart';
import { ShoppingBasket } from 'lucide-react';
import type { Product } from '@/types';
import { Badge } from '@/components/ui/badge';
import StarRating from './star-rating';
import { Card, CardContent } from './ui/card';

export default function ProductList({ products }: { products?: Product[] }) {
  const { addToCart } = useCart();
  const productsToShow = products || allProducts;

  return (
    <>
      {productsToShow.map((product) => (
        <Card key={product.id} className="overflow-hidden transition-shadow hover:shadow-lg h-full flex flex-col rounded-lg border-0">
             <CardContent className="p-0 flex flex-col flex-grow">
                <Link href={`/products/${product.slug}`} className="block relative">
                    <div className="aspect-square w-full relative">
                        <Image
                            src={product.imageUrl}
                            alt={product.name}
                            fill
                            className="object-cover"
                            data-ai-hint={product.imageHint}
                        />
                         {product.promotion && (
                            <Badge variant="destructive" className="absolute top-2 right-2 z-10">
                                {product.promotion}
                            </Badge>
                        )}
                    </div>
                </Link>
                <div className="p-4 flex flex-col flex-grow text-left">
                    <h3 className="text-lg font-headline font-bold mb-1">
                        <Link href={`/products/${product.slug}`}>{product.name}</Link>
                    </h3>
                    <div className="mb-2">
                        <StarRating rating={product.rating} reviewCount={product.reviewCount} className="justify-start"/>
                    </div>
                    <div className="flex justify-between items-center mt-auto">
                        <p className="text-xl font-bold text-primary">£{product.price.toFixed(2)}</p>
                        <Button variant="secondary" size="icon" onClick={() => addToCart(product)}>
                            <ShoppingBasket className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
             </CardContent>
        </Card>
      ))}
    </>
  );
}
