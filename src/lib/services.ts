
import type { Service } from './types';
import type { ButtonProps } from '@/components/ui/button';

export const services: (Service & { buttonVariant: ButtonProps['variant'], bestValue?: boolean, features: string[] })[] = [
  {
    id: "standard",
    name: "Standard Service",
    description: "Our classic deep clean with a 5-7 day turnaround.",
    price: 30,
    features: ["Deep Clean & Restoration", "Lace & Insole Cleaning", "Midsole & Undersole Treatment", "Deodorization & Sanitization", "5-7 Day Turnaround"],
    buttonVariant: "outline",
    bestValue: false,
  },
  {
    id: "express",
    name: "Express Service",
    description: "Our classic deep clean with a faster 72-hour turnaround.",
    price: 40,
    features: [
      "Deep Clean & Restoration", 
      "Lace & Insole Cleaning", 
      "Midsole & Undersole Treatment", 
      "Deodorization & Sanitization",
      "72-Hour Turnaround"
    ],
    buttonVariant: "default",
    bestValue: true,
  },
  {
    id: "sameday",
    name: "Same-Day Service",
    description: "Our classic deep clean with a same-day turnaround.",
    price: 50,
    features: [
      "Deep Clean & Restoration", 
      "Lace & Insole Cleaning", 
      "Midsole & Undersole Treatment", 
      "Deodorization & Sanitization",
      "Same-Day Turnaround"
    ],
    buttonVariant: "outline",
    bestValue: false,
  },
];

    
