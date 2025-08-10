
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { services } from '@/lib/services';
import type { Order } from '@/lib/types';
import { sendEmail } from '@/lib/email';

const repaintCost = 20;
const collectionFee = 10;

// A new, self-contained Zod schema for server-side validation.
// This is the single source of truth for what constitutes a valid order.
const orderSchema = z.object({
  serviceId: z.string().refine(val => services.some(s => s.id === val), { message: "Invalid service ID" }),
  quantity: z.number().int().min(1),
  repaint: z.boolean().default(false),
  deliveryMethod: z.enum(['collection', 'dropoff']),
  paymentMethod: z.enum(['card', 'cash']),
  bookingDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Invalid date format" }),
  bookingTime: z.string().regex(/^\d{2}:\d{2}$/, { message: "Invalid time format" }),
  fullName: z.string().min(2, { message: "Full name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  phoneNumber: z.string().min(1, { message: "Phone number is required" }),
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

    // 1. Rigorous server-side validation with our new schema
    const validationResult = orderSchema.safeParse(body);
    if (!validationResult.success) {
      console.error('Validation Error:', validationResult.error.flatten());
      return NextResponse.json({ error: 'Invalid data provided.', details: validationResult.error.flatten() }, { status: 400 });
    }

    const validatedData = validationResult.data;

    // Normalize phone number: add leading '0' if it's missing.
    let normalizedPhoneNumber = validatedData.phoneNumber;
    if (normalizedPhoneNumber && !/^\s*(0|\+44)/.test(normalizedPhoneNumber)) {
        normalizedPhoneNumber = '0' + normalizedPhoneNumber.trim();
    }

    // 2. Server-side price calculation to prevent tampering
    const selectedService = services.find(s => s.id === validatedData.serviceId);
    if (!selectedService) {
      // This case is technically covered by the schema refine, but good to have
      return NextResponse.json({ error: 'Invalid service selected.' }, { status: 400 });
    }

    const subtotal = selectedService.price * validatedData.quantity;
    const repaintTotal = validatedData.repaint ? repaintCost * validatedData.quantity : 0;
    const deliveryFee = validatedData.deliveryMethod === 'collection' ? collectionFee : 0;
    const totalCost = subtotal + repaintTotal + deliveryFee;

    // 3. Prepare the final data object for Firestore, using only validated data
    const finalOrderData = {
      ...validatedData,
      phoneNumber: normalizedPhoneNumber,
      totalCost,
      status: 'Pending' as const,
      serviceName: selectedService.name,
      createdAt: serverTimestamp(),
    };

    // 4. Securely add the document to Firestore
    const docRef = await addDoc(collection(db, 'orders'), finalOrderData);

    // 5. Construct the full order object for the email, including the newly generated ID
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
        // createdAt will be a server timestamp, which is fine to omit for the email
    };
    
    // 6. Send confirmation email directly (fire-and-forget)
    sendEmail({
        type: 'confirmation',
        order: newOrderForEmail,
    }).catch(emailError => {
        // Log email sending errors but don't fail the entire request
        console.error("Failed to send confirmation email:", emailError);
    });


    return NextResponse.json({ success: true, message: 'Order created successfully' });

  } catch (error: any) {
    console.error('Error creating order:', error);
    // Generic error to avoid leaking implementation details
    return NextResponse.json({ error: 'An internal error occurred. Please try again.' }, { status: 500 });
  }
}
