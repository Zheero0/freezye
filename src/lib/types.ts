
export type ServiceSelection = 'standard' | 'express' | 'sameday';

export interface Service {
  id: ServiceSelection;
  name: string;
  description: string;
  price: number;
}

export interface WashPack {
  id: string;
  name:string;
  washes: number;
  price: number;
  bestValue?: boolean;
}

export type OrderStatus = 'Pending' | 'Collected' | 'In Progress' | 'Completed' | 'Cancelled' | 'Ready for Collection';

export interface Order {
  id: string;
  customerName: string;
  service: string;
  date: string;
  status: OrderStatus;
  userEmail: string;
  notes?: string;
  phoneNumber: string; // Changed to required
  totalCost?: number;
  deliveryMethod?: 'collection' | 'dropoff';
  pickupAddress?: string;
  quantity?: number;
  repaint?: boolean;
  createdAt?: Date;
  collectionFee?: number;
  paymentMethod?: 'card' | 'cash'; // New field
  paymentIntentId?: string; // Changed to optional
}

export interface User {
  name: string;
  email: string;
  avatarUrl: string;
  washesRemaining: number;
  isAdmin: boolean;
}

export interface Booking {
  serviceId: ServiceSelection;
  quantity: number;
  repaint: boolean;
  bookingDate: Date;
  bookingTime: string;
  fullName: string;
  email: string;
  notes?: string;
}

    

    

    
