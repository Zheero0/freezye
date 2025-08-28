
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import AnimatedSweets from '@/components/animated-sweets';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import StarRating from '@/components/star-rating';
import ProductCarousel from '@/components/product-carousel';
import { Rocket, Sparkles, Star, UserCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  const testimonials = [
    {
      name: 'Sarah K.',
      rating: 5,
      review: 'Absolutely mind-blowing! The Cosmic Crunchies have a texture and flavour that is out of this world. My kids are obsessed!',
    },
    {
      name: 'Tom H.',
      rating: 5,
      review: 'The express delivery was super fast, and the sweets were even better than I imagined. You\'ve got a customer for life!',
    },
    {
      name: 'Emily R.',
      rating: 5,
      review: 'I bought a selection for a party and they were a massive hit. The Asteroid Bites are dangerously addictive. 10/10!',
    },
  ];

  const Feature = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
    <div className="flex flex-col items-center">
      {icon}
      <h3 className="text-xl font-bold font-headline mt-4 mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );

  return (
    <div className="flex flex-col items-center text-center space-y-16 md:space-y-24">
      {/* Hero Section */}
      <section className="relative w-full bg-accent text-accent-foreground pt-20 md:pt-28 pb-24 md:pb-32">
        <AnimatedSweets />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-5xl md:text-8xl font-black font-headline tracking-tight mb-4 text-shadow-lg"
            >
              Try the <span className="text-primary text-shadow">viral</span>
              <br />
              Freeze-Dried Candy
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="max-w-2xl mx-auto text-lg md:text-xl text-accent-foreground/90 mb-8 text-shadow"
            >
              Find out why everyone's obsessed! Experience the viral craze with an explosive crunch and incredibly intense flavours.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Button asChild size="lg" className="mt-4">
                <Link href="/products">Shop The Entire Collection</Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <motion.section 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5 }}
        className="w-full container mx-auto px-4 -mt-24 md:-mt-32 relative z-10"
      >
        <h2 className="text-3xl font-bold font-headline tracking-tight text-foreground sm:text-4xl mb-12">
          Our Bestsellers
        </h2>
        <ProductCarousel />
        <div className="mt-12 text-center">
            <Button asChild size="lg" variant="secondary">
                <Link href="/products">View All Sweets</Link>
            </Button>
        </div>
      </motion.section>

      {/* How It Works Section */}
      <motion.section 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5 }}
        className="w-full bg-card py-16"
      >
        <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold font-headline tracking-tight text-foreground sm:text-4xl mb-12">
                From Chewy to Crunchy
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="flex flex-col md:flex-row items-center gap-4"
                >
                    <div className="flex-shrink-0 bg-primary/20 text-primary rounded-full h-16 w-16 flex items-center justify-center font-bold text-2xl">1</div>
                    <div>
                        <h3 className="text-xl font-bold mb-2">We Pick Your Faves</h3>
                        <p className="text-muted-foreground">We start with the classic, well-loved sweets you already know and adore.</p>
                    </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="flex flex-col md:flex-row items-center gap-4"
                >
                    <div className="flex-shrink-0 bg-primary/20 text-primary rounded-full h-16 w-16 flex items-center justify-center font-bold text-2xl">2</div>
                    <div>
                        <h3 className="text-xl font-bold mb-2">The Cosmic Freeze</h3>
                        <p className="text-muted-foreground">Our state-of-the-art process removes moisture, making them light and airy.</p>
                    </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="flex flex-col md:flex-row items-center gap-4"
                >
                     <div className="flex-shrink-0 bg-primary/20 text-primary rounded-full h-16 w-16 flex items-center justify-center font-bold text-2xl">3</div>
                    <div>
                        <h3 className="text-xl font-bold mb-2">Flavour Explosion</h3>
                        <p className="text-muted-foreground">The result? A mind-blowing crunchy treat with a super-concentrated taste.</p>
                    </div>
                </motion.div>
            </div>
        </div>
      </motion.section>

      {/* Testimonials */}
        <motion.section 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className="w-full container mx-auto px-4 py-16"
        >
            <h2 className="text-3xl font-bold font-headline tracking-tight text-foreground sm:text-4xl mb-12">
                Don't Just Take Our Word For It
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {testimonials.map((testimonial, i) => (
                    <motion.div
                       key={i}
                       initial={{ opacity: 0, y: 30 }}
                       whileInView={{ opacity: 1, y: 0 }}
                       viewport={{ once: true, amount: 0.5 }}
                       transition={{ duration: 0.5, delay: i * 0.1 }}
                    >
                        <Card className="text-left h-full">
                            <CardHeader className="flex flex-row items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                                    <UserCircle className="w-8 h-8 text-muted-foreground" />
                                </div>
                                <div>
                                    <CardTitle className="text-xl">{testimonial.name}</CardTitle>
                                    <StarRating rating={testimonial.rating} reviewCount={0} className="justify-start" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">"{testimonial.review}"</p>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </motion.section>

      {/* Key Selling Points */}
        <motion.section 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5 }}
            className="w-full bg-background py-16"
        >
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center text-foreground">
                    <Feature
                        icon={
                            <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}>
                                <Rocket className="h-12 w-12 text-primary" />
                            </motion.div>
                        }
                        title="UK Express Delivery"
                        description="Get your crunchy treats delivered to your door, fast. Don't wait to snack!"
                    />
                    <Feature
                        icon={
                            <motion.div animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}>
                                <Sparkles className="h-12 w-12 text-primary" />
                            </motion.div>
                        }
                        title="Unbeatable Crunch"
                        description="Our special freeze-drying process creates a unique, satisfyingly airy crunch."
                    />
                    <Feature
                        icon={
                             <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}>
                                <Star className="h-12 w-12 text-primary" />
                            </motion.div>
                        }
                        title="5-Star Rated"
                        description="Join hundreds of happy customers who rave about our cosmic confections."
                    />
                </div>
            </div>
        </motion.section>


      {/* Final Call to Action */}
      <motion.section 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5 }}
        className="relative w-full text-center bg-accent py-16"
      >
        <AnimatedSweets />
        <div className="relative z-10 container mx-auto px-4">
            <h2 className="text-3xl font-bold font-headline tracking-tight text-accent-foreground sm:text-4xl mb-4">
            Ready to Taste the Crunch?
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-accent-foreground/90 sm:text-xl mb-8">
            Your taste buds will thank you. Explore our full collection and find your new favourite snack today.
            </p>
            <Button asChild size="lg" variant="default" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90">
                <Link href="/products">Shop Now & Get 3 for 2</Link>
            </Button>
        </div>
      </motion.section>
    </div>
  );
}
