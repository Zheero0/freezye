
'use client';

import * as React from 'react';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { Process } from '@/components/Process';
import { Services } from '@/components/Services';
import { Testimonials } from '@/components/Testimonials';
import { InstagramFeed } from '@/components/InstagramFeed';
import { Pricing } from '@/components/Pricing';
import { AboutUs } from '@/components/AboutUs';
import { motion } from 'framer-motion';


export default function Home() {
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <div className="bg-background/0 text-foreground overflow-x-hidden">
      <Header />
      <main className="flex-1">
        <Hero />
        
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={sectionVariants}>
          <AboutUs/>
        </motion.div>
        
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={sectionVariants}>
          <Process />
        </motion.div>

        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={sectionVariants}>
          <Services />
        </motion.div>

        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={sectionVariants}>
          <Pricing />
        </motion.div>

        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={sectionVariants}>
          <Testimonials />
        </motion.div>
        
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={sectionVariants}>
          <InstagramFeed />
        </motion.div>

      </main>

      <footer className="py-6 border-t border-border flex items-center justify-center text-center">
        <div className="container text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Sneakswash. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
}
