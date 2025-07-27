export const siteStats = {
  sneakersCleaned: '1000+',
  customerRating: '★4.9',
  turnaround: '12h+',
  premiumRestorations: '1000+',
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
    id: 0,
    name: 'Nemzzz',
    location: 'Manchester',
    role: 'Music Artist',
    image: '/nemzzz.webp',
    rating: 5,
    verified: true,
    specialty: 'Designer Sneakers',
    gradient: 'from-primary/80 to-accent/80',

  },
  {
    id: 1,
    name: 'Rico Lewis',
    location: 'Manchester City, England',
    role: 'Footballer',
    image: '/rico.webp',
    rating: 5,
    verified: true,
    specialty: 'Football Boots & Lifestyle',
    gradient: 'from-primary to-accent',
  },
  {
        id: 2,
    name: 'Shola Shoretire',
    location: 'PAOK, Greece',
    role: 'Footballer',
    image: '/Shola.webp',
    rating: 5,
    verified: true,
    specialty: 'Football Boots & Lifestyle',
    gradient: 'from-primary to-accent',
  },
  {
    id: 3,
    name: 'Zidane Iqbal',
    location: 'FC Utrecht, Netherlands',
    role: 'Footballer',
    image: '/Zidane.webp',
    rating: 5,
    verified: true,
    specialty: 'Limited Editions',
    gradient: 'from-primary/90 to-accent/90',
  },
    {
    id: 4,
    name: 'Tyryhs Dolan',
    location: 'Espanyol, Spain',
    role: 'Footballer',
    image: '/Tyryhs.jpg',
    rating: 5,
    verified: true,
    specialty: 'Limited Editions',
    gradient: 'from-primary/90 to-accent/90',
  },
      {
    id: 5,
    name: "Luke Mbete",
    location: 'Manchester City, England',
    role: 'Footballer',
    image: '/Luke.webp',
    rating: 5,
    verified: true,
    specialty: 'Limited Editions',
    gradient: 'from-primary/90 to-accent/90',
  },
        {
    id: 6,
    name: "Josh Wilson-Esbrand",
    location: 'Manchester City, England',
    role: 'Footballer',
    image: '/Josh.webp',
    rating: 5,
    verified: true,
    specialty: 'Limited Editions',
    gradient: 'from-primary/90 to-accent/90',
  },
          {
    id: 7,
    name: "Dire Mebude",
    location: 'KVC Westerlo, Belgium ',
    role: 'Footballer',
    image: '/Dire.webp',
    rating: 5,
    verified: true,
    specialty: 'Limited Editions',
    gradient: 'from-primary/90 to-accent/90',
  },
            {
    id: 8,
    name: "Sam Mathe",
    location: 'Manchester United, England',
    role: 'Footballer',
    image: '/Sam.webp',
    rating: 5,
    verified: true,
    specialty: 'Limited Editions',
    gradient: 'from-primary/90 to-accent/90',
  },
];
