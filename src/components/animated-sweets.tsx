
'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lollipop, Candy, Donut, Cookie } from 'lucide-react';
import { cn } from '@/lib/utils';

const sweetIcons = [
  { Icon: Lollipop, color: 'text-pink-400', size: 'w-8 h-8' },
  { Icon: Candy, color: 'text-red-500', size: 'w-10 h-10' },
  { Icon: Donut, color: 'text-blue-400', size: 'w-12 h-12' },
  { Icon: Cookie, color: 'text-yellow-500', size: 'w-9 h-9' },
  { Icon: Lollipop, color: 'text-purple-400', size: 'w-7 h-7' },
  { Icon: Candy, color: 'text-green-400', size: 'w-11 h-11' },
];

const animatedSweetVariants = {
  initial: { y: -20, opacity: 0 },
  animate: (i: number) => ({
    y: [0, -15, 0],
    opacity: [0, 0.9, 0],
    transition: {
      duration: Math.random() * 3 + 4,
      repeat: Infinity,
      repeatType: 'loop',
      ease: 'easeInOut',
    },
  }),
};

const staticSweetVariants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: {
        opacity: 0.7,
        scale: 1,
        transition: {
            duration: 0.4,
            ease: 'easeOut',
        },
    },
};


interface Sweet {
    Icon: React.ElementType;
    color: string;
    size: string;
    top: string;
    left: string;
}

export default function AnimatedSweets({ isStatic = false }: { isStatic?: boolean }) {
  const [sweets, setSweets] = useState<Sweet[]>([]);

  useEffect(() => {
    const generatedSweets = Array.from({ length: 25 }).map((_, i) => {
        const sweetIcon = sweetIcons[i % sweetIcons.length];
        return {
            ...sweetIcon,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
        };
    });
    setSweets(generatedSweets);
  }, []);

  const variants = isStatic ? staticSweetVariants : animatedSweetVariants;

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
      {sweets.map((sweet, i) => (
        <motion.div
            key={i}
            custom={i}
            variants={variants}
            initial="initial"
            animate="animate"
            style={{ top: sweet.top, left: sweet.left }}
            className="absolute"
        >
            <sweet.Icon className={cn(sweet.size, sweet.color, 'opacity-70')} />
        </motion.div>
      ))}
    </div>
  );
}
