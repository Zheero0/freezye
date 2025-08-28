
'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { products } from '@/lib/products';
import { useCart } from '@/hooks/use-cart';
import { ShoppingBasket, Candy } from 'lucide-react';
import Autoplay from "embla-carousel-autoplay"
import React from 'react';
import { motion } from 'framer-motion';
import StarRating from './star-rating';


export default function ProductCarousel() {
  const { addToCart } = useCart();
  const plugin = React.useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true })
  )

  const featuredProducts = products.slice(0, 8);

  return (
    <Carousel
      plugins={[plugin.current]}
      opts={{
        align: 'start',
        loop: true,
      }}
      className="w-full"
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
    >
      <CarouselContent className="-ml-4">
        {featuredProducts.map((product, index) => (
          <CarouselItem key={product.id} className="md:basis-1/2 lg:basis-1/3 pl-4">
            <motion.div 
              className="p-1 h-full"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="overflow-hidden transition-shadow hover:shadow-lg h-full flex flex-col rounded-lg bg-background border-0">
                <CardContent className="p-0 flex flex-col flex-grow">
                  <Link href={`/products/${product.slug}`} className="block">
                    <div className="aspect-square w-full relative bg-muted flex items-center justify-center">
                       <Candy className="w-24 h-24 text-muted-foreground" />
                    </div>
                  </Link>
                  <div className="p-4 flex flex-col flex-grow text-left">
                    <h3 className="text-lg font-headline font-bold mb-1">{product.name}</h3>
                    <div className="mb-2">
                        <StarRating rating={product.rating} reviewCount={product.reviewCount} className="justify-start"/>
                    </div>
                    <p className="text-muted-foreground mb-4 text-sm flex-grow">{product.description}</p>
                    <div className="flex justify-between items-center mt-auto">
                        <p className="text-xl font-bold text-primary">£{product.price.toFixed(2)}</p>
                        <Button variant="secondary" onClick={() => addToCart(product)}>
                            <ShoppingBasket className="mr-2 h-4 w-4" /> Add
                        </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="hidden sm:flex" />
      <CarouselNext className="hidden sm:flex" />
    </Carousel>
  );
}
