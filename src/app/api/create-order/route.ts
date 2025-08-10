// app/api/create-order/route.ts
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { services } from '@/lib/services';
import type { Order } from '@/lib/types';
import { sendEmail } from '@/lib/email';

export const runtime = 'nodejs'; // ensure Node runtime (not Edge)

const repaintCost = 20;
const collectionFee = 10;

const orderSchema = z.object({
  serviceId: z.string().refine(val => services.some(s => s.id === val), { message: 'Invalid service ID' }),
  quantity: z.number().int().min(1),
  repaint: z.boolean().default(false),
  deliveryMethod: z.enum(['collection', 'dropoff']),
  paymentMethod: z.enum(['card', 'cash']),
  bookingDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: 'Invalid date format' }),
  bookingTime: z.string().regex(/^\d{2}:\d{2}$/, { message: 'Invalid time format' }),
  fullName: z.string().min(2, { message: 'Full name is required' }),
  email: z.string().email({ message: 'Invalid email address' }),
  phoneNumber: z.string().min(1, { message: 'Phone number is required' }),
  pickupAddress: z.string().optional(),
  notes: z.string().optional(),
  paymentIntentId: z.string().optional(),
}).refine(data => {
  if (data.deliveryMethod === 'collection') {
    return !!data.pickupAddress && data.pickupAddress.length >= 10;
  }
  return true;
}, {
  message: 'A valid pickup address is required for collection.',
  path: ['pickupAddress'],
}).refine(data => {
  if (data.paymentMethod === 'card') {
    return !!data.paymentIntentId;
  }
  return true;
}, {
  message: 'A valid paymentIntentId is required for card payments.',
  path: ['paymentIntentId'],
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const validationResult = orderSchema.safeParse(body);
    if (!validationResult.success) {
      console.error('Validation Error:', validationResult.error.flatten());
      return NextResponse.json(
        { error: 'Invalid data provided.', details: validationResult.error.flatten() },
        { status: 400 }
      );
    }

    const data = validationResult.data;

    // normalize phone number
    let normalizedPhoneNumber = data.phoneNumber;
    if (normalizedPhoneNumber && !/^\s*(0|\+44)/.test(normalizedPhoneNumber)) {
      normalizedPhoneNumber = '0' + normalizedPhoneNumber.trim();
    }

    // price calc
    const selectedService = services.find(s => s.id === data.serviceId);
    if (!selectedService) {
      return NextResponse.json({ error: 'Invalid service selected.' }, { status: 400 });
    }

    const subtotal = selectedService.price * data.quantity;
    const repaintTotal = data.repaint ? repaintCost * data.quantity : 0;
    const deliveryFee = data.deliveryMethod === 'collection' ? collectionFee : 0;
    const totalCost = subtotal + repaintTotal + deliveryFee;

    // write order
    const finalOrderData = {
      ...data,
      phoneNumber: normalizedPhoneNumber,
      totalCost,
      status: 'Pending' as const,
      serviceName: selectedService.name,
      createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, 'orders'), finalOrderData);

    // prepare email payload
    const newOrderForEmail: Order = {
      id: docRef.id,
      customerName: finalOrderData.fullName,
      service: finalOrderData.serviceName,
      date: finalOrderData.bookingDate,
      status: finalOrderData.status,
      userEmail: finalOrderData.email,
      phoneNumber: finalOrderData.phoneNumber,
      totalCost: finalOrderData.totalCost,
      notes: finalOrderData.notes,
      deliveryMethod: finalOrderData.deliveryMethod,
      pickupAddress: finalOrderData.pickupAddress,
      quantity: finalOrderData.quantity,
      repaint: finalOrderData.repaint,
      paymentMethod: finalOrderData.paymentMethod,
      paymentIntentId: finalOrderData.paymentIntentId,
    };

    // ✅ await emails and base status on BOTH sends
    const emailResult = await sendEmail({ type: 'confirmation', order: newOrderForEmail });
    console.log('[CREATE-ORDER] emailResult:', emailResult);

    // If your sendEmail returns detailed results (customer/admin),
    // prefer that. Otherwise this fallback uses success boolean.
    const ok = emailResult?.success !== false;

    return NextResponse.json(
      { success: ok, message: 'Order created', email: emailResult },
      { status: ok ? 200 : 502 }
    );
  } catch (err: any) {
    console.error('Error creating order:', err);
    return NextResponse.json(
      { error: 'An internal error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
