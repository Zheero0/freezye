import { z } from 'zod';
import type { Order } from './types';
import { services } from './services';

export const repaintCost = 20;
export const collectionFee = 10;

// Order schema for validation
export const orderSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phoneNumber: z.string().min(8),
  address: z.string().min(1),
  serviceId: z.string().min(1),
  quantity: z.number().min(1),
  repaint: z.boolean().optional(),
  deliveryMethod: z.enum(['collection', 'dropoff']),
  deliveryDate: z.string().min(1),
  deliveryTime: z.string().min(1),
  notes: z.string().optional(),
});

export function getSelectedService(serviceId: string) {
  return services.find(s => s.id === serviceId);
}

export function normalizePhoneNumber(phoneNumber: string) {
  return phoneNumber.replace(/\D/g, '');
}
