// src/components/Testimonials.tsx
'use client';

import * as React from 'react';
import { testimonials } from '@/lib/siteData';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

export function Testimonials() {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [idx, setIdx] = React.useState(0);
  const total = testimonials.length;

  React.useEffect(() => {
    const h = setInterval(() => setIdx(i => (i + 1) % total), 2000);
    return () => clearInterval(h);
  }, [total]);

  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const child = el.children[idx] as HTMLElement;
    const scrollLeft = child.offsetLeft - (el.clientWidth - child.clientWidth) / 2;
    el.scrollTo({ left: scrollLeft, behavior: 'smooth' });
  }, [idx]);

  return (
    <section className="py-32 px-4">
      <div className="container mx-auto text-center mb-12">
        <h2 className="text-4xl lg:text-6xl font-bold font-headline mb-2 tracking-tighter">
          <span className="gradient-text">Trusted by</span><br/>
          <span className="text-white">Connoisseurs</span>
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Join hundreds of discerning clients who trust us with their most precious footwear
        </p>
      </div>

      <div
        ref={containerRef}
        className="flex gap-6 overflow-x-auto pb-4 scroll-smooth snap-x snap-mandatory hide-scrollbar"
        style={{ scrollPadding: '0 1rem', msOverflowStyle: 'none', scrollbarWidth: 'none' }}
      >
        {testimonials.map(({ name, quote }, i) => (
          <motion.div
            key={i}
            className="snap-center flex-shrink-0 w-96 h-52"
            initial={false}
            animate={
              idx === i
                ? { scale: 1, opacity: 1 }
                : { scale: 0.95, opacity: 0.6 }
            }
            transition={{ type: 'spring', stiffness: 80, damping: 25 }}
          >
            <Card className="h-full bg-card/50 backdrop-blur-sm overflow-hidden">
              <CardContent className="p-6 flex flex-col justify-between h-full">
                <Quote
                  className="flex-none text-primary/50 mb-4"
                  style={{ width: '2rem', height: '2rem', minWidth: '2rem', minHeight: '2rem' }}
                />
                <p className="italic text-muted-foreground mb-4 text-base leading-relaxed">
                  “{quote}”
                </p>
                <p className="font-bold text-white text-lg mt-2 text-right">
                  — {name}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}