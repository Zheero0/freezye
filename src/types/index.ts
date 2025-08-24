export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  imageUrl: string;
  imageHint?: string;
  promotion?: string;
  rating: number;
  reviewCount: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Address {
  name: string;
  email: string;
  street: string;
  city: string;
  zip: string;
  country: string;
}

export type ReferralSource = 'tiktok' | 'instagram' | 'friend' | 'other' | '';

export interface Order {
  id: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  total: number;
  customer: Address;
  shipping: string;
  referralSource?: ReferralSource;
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  date: string;
}
