export const siteStats = {
  sneakersCleaned: '500+',
  customerRating: '4.9★',
  turnaround: '12h+',
  premiumRestorations: '500+',
  clientSatisfaction: '4.9/5',
  insuredService: '100%',
  conciergeSupport: '24/7',
};

// src/lib/siteData.ts

export interface Testimonial {
  name: string
  quote: string
}

export const testimonials: Testimonial[] = [
  { name: 'Nemzzz',            quote: 'My bro patterned me last minute' },
  { name: 'Shola Shoretire',   quote: 'Top service as always bro👊🏾' },
  { name: 'Owen Dodgson',      quote: 'You actually brought them back to life aha appreciate it bro' },
  { name: 'Zidane Iqbal',      quote: 'Appreciate it bro, quick delivery as always 👊' },
  { name: 'Rico Lewis',        quote: 'Top service thank you bro' },
  { name: 'Mipo Odubeko',      quote: 'Fresh my bro' },
  { name: 'Ali Al‑Hamadi',     quote: 'My boy, always got me 👊' },
  { name: 'Luke Mbete',        quote: 'Great service, appreciate you my boy' },
  { name: 'Tyrhys Dolan',      quote: 'Sorted me out nicely, appreciate it as always bro' },
  { name: 'Lisandro Martinez', quote: 'They look brand new' },
  { name: 'Dire Mebude',       quote: 'I didn’t think you would be able to save them😂appreciate it bro🤞🏾' },
]


export const celebritiesData = [
  {
    name: 'Rico Lewis',
    location: 'Manchester',
    role: 'Footballer',
    image: '/rico.webp',
    rating: 5,
    verified: true,
    specialty: 'Football Boots & Lifestyle',
    gradient: 'from-primary to-accent',
  },
  {
    name: 'Nemzzz',
    location: 'Manchester',
    role: 'Recording Artist',
    image: '/nemzzz.webp',
    rating: 5,
    verified: true,
    specialty: 'Designer Sneakers',
    gradient: 'from-primary/80 to-accent/80',
  },
  {
    id: 3,
    name: 'Zidane Iqbal',
    location: 'Manchester',
    role: 'Footballer',
    image: '/Zidane.webp',
    rating: 5,
    verified: true,
    specialty: 'Limited Editions',
    gradient: 'from-primary/90 to-accent/90',
  },
];
