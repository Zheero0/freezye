
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";
import Image from "next/image";
import { siteStats, testimonialsData } from "@/lib/siteData";
import { motion } from 'framer-motion';

export function Testimonials() {
  return (
    <section className="py-32 px-4 relative overflow-hidden">
      <div className="container mx-auto relative z-10">
        <div className="text-center mb-20">
          {/* <div className="inline-flex items-center space-x-2  backdrop-blur-sm rounded-full px-6 py-3 border border-border mb-6">
            <Star className="h-4 w-4 text-primary" />
            <span className="text-sm text-muted-foreground">Client Stories</span>
          </div> */}
          <h2 className="text-4xl lg:text-6xl font-bold font-headline mb-6 tracking-tighter">
            <span className="gradient-text">Trusted by</span>
            <br />
            <span className="text-white">Connoisseurs</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Join thousands of discerning clients who trust us with their most
            precious footwear
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {testimonialsData.map((testimonial, index) => (
             <motion.div
              key={index}
              whileHover={{ y: -5 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="h-full"
            >
              <Card className="h-full bg-card/50 backdrop-blur-sm transition-shadow duration-300 hover:shadow-xl hover:shadow-primary/10 group relative overflow-hidden">
                 <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
                <CardContent className="p-8 relative z-10 flex flex-col items-center text-center md:items-start md:text-left h-full">
                  <div className="mb-6">
                    <Quote className="h-8 w-8 text-primary/50 group-hover:text-primary transition-colors" />
                  </div>

                  <div className="flex items-center mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-5 w-5 text-primary fill-current"
                      />
                    ))}
                    {testimonial.verified && (
                      <div className="ml-3 text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">
                        Verified
                      </div>
                    )}
                  </div>

                  <blockquote className="text-muted-foreground mb-8 italic text-lg leading-relaxed group-hover:text-white transition-colors">
                    "{testimonial.text}"
                  </blockquote>

                  <div className="flex items-center space-x-4 mt-auto">
                    <div className="relative w-[60px] h-[60px]">
                      {/* Glowing background effect */}
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-accent blur-sm opacity-50 group-hover:opacity-75 transition-opacity" />

                      {/* Avatar image */}
                      <Image
                        src={testimonial.image}
                        alt={testimonial.name}
                        width={60}
                        height={60}
                        className="relative w-full h-full rounded-full border-2 border-border group-hover:border-primary/50 transition-colors object-cover"
                        data-ai-hint="person avatar"
                      />
                    </div>

                    <div className="flex-1">
                      <div className="font-bold text-white text-lg group-hover:text-primary transition-colors">
                        {testimonial.name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {testimonial.role}
                      </div>
                      <div className="text-xs text-muted-foreground/80">
                        {testimonial.location}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="grid md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary">
                {siteStats.premiumRestorations}
              </div>
              <div className="text-sm text-muted-foreground">
                Premium Restorations
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary">
                {siteStats.clientSatisfaction}
              </div>
              <div className="text-sm text-muted-foreground">
                Client Satisfaction
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary">
                {siteStats.insuredService}
              </div>
              <div className="text-sm text-muted-foreground">
                Insured Service
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary">
                {siteStats.conciergeSupport}
              </div>
              <div className="text-sm text-muted-foreground">
                Concierge Support
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

    



