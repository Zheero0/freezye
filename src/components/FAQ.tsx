// components/FAQ.tsx
'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Minus } from 'lucide-react';

const faqs = [
  {
    question: 'What kind of stains can you remove?',
    answer: `Our experienced team can effectively remove various stains, including dirt, mud, blood, ink, grass, and more. However, some stains may be more challenging to remove altogether, so while we do our best, we cannot guarantee complete removal in all cases.`,
  },
  {
    question: 'Do you offer any guarantees on your services?',
    answer: `We take pride in our work and strive to provide the best results possible. If you're not satisfied with our service, please let us know, and we'll do our best to address any concerns or redo the cleaning if necessary.`,
  },
  {
    question: 'Where are we based and do we offer pick‑up services?',
    answer: `We are based in Trafford Manchester; however, we offer pickup and delivery services for an additional fee. Contact us to inquire about availability in your area.`,
  },
  {
    question: 'Where is the drop‑off location?',
    answer: `Our drop‑off location is at:  
Store First, St Modwen Rd, Trafford Park, M32 0ZF  

**Opening hours:**  
• Mon–Sat: 8 am – 6 pm  
• Sun: 10 am – 4 pm`,
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 ">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-headline font-bold text-white text-center mb-12">
          <span className="gradient-text">Frequently</span> Asked Questions
        </h2>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <Card
                key={idx}
                className="bg-card/50 backdrop-blur-sm overflow-hidden"
              >
                <CardContent className="p-4 md:p-6">
                  <button
                    className="w-full flex justify-between items-center"
                    onClick={() =>
                      setOpenIndex(isOpen ? null : idx)
                    }
                  >
                    {/* only this line changed from text-white → text-primary */}
                    <span className="text-primary text-lg md:text-xl">
                      {faq.question}
                    </span>
                    {isOpen ? (
                      <Minus className="w-5 h-5 text-primary" />
                    ) : (
                      <Plus className="w-5 h-5 text-primary" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="mt-3 text-muted-foreground text-base md:text-lg leading-relaxed whitespace-pre-line">
                      {faq.answer}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
