// src/app/api/create-order/route.ts
// @ts-nocheck — bypassing TS for server logic
'use server';

import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import type { Order } from '@/lib/types';
import { sendEmail } from '@/lib/email';
import {
  repaintCost,
  collectionFee,
  orderSchema,
  getSelectedService,
  normalizePhoneNumber,
} from '@/lib/order-helpers';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    //
    // 1) Remap your form field names into what Zod expects
    //
    const mappedBody = {
      ...body,
      name:         body.fullName,      // Zod: `name`
      email:        body.email,         // Zod: `email`
      deliveryDate: body.bookingDate,   // Zod: `deliveryDate`
      deliveryTime: body.bookingTime,   // Zod: `deliveryTime`
      address:      body.pickupAddress, // Zod: `address`
    };

    //
    // 2) Validate against your Zod schema
    //
    const parsed = orderSchema.safeParse(mappedBody);
    if (!parsed.success) {
      console.error('🛑 Validation failed:', parsed.error.format());
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.format() },
        { status: 400 }
      );
    }
    const data = parsed.data;

    //
    // 3) Lookup the chosen service
    //
    const svc = getSelectedService(data.serviceId);
    if (!svc) {
      return NextResponse.json({ error: 'Service not found' }, { status: 400 });
    }

    //
    // 4) Calculate costs
    //
    const baseCost   = svc.price * data.quantity;
    const repaintTot = data.repaint ? repaintCost * data.quantity : 0;
    const delivery   = data.deliveryMethod === 'collection' ? collectionFee : 0;
    const totalCost  = baseCost + repaintTot + delivery;

    //
    // 5) Normalize phone number
    //
    const phone = normalizePhoneNumber(data.phoneNumber);

    //
    // 6) Build the Firestore document
    //
    const orderData = {
      fullName:        data.name,
      email:           data.email,
      phoneNumber:     phone,

      serviceId:       data.serviceId,
      serviceName:     svc.name,
      quantity:        data.quantity,
      repaint:         data.repaint,

      deliveryMethod:  data.deliveryMethod,
      bookingDate:     data.deliveryDate,
      bookingTime:     data.deliveryTime,
      pickupAddress:   data.address?.trim() ? data.address : 'N/A',

      notes:            data.notes ?? '',
      paymentMethod:    data.paymentMethod ?? 'card',
      paymentIntentId:  data.paymentIntentId ?? null,

      totalCost,
      status:           data.status ?? 'pending',

      createdAt:       serverTimestamp(),
      updatedAt:       serverTimestamp(),
    };

    //
    // 7) Persist to Firestore
    //
    const docRef = await addDoc(collection(db, 'orders'), orderData);

    //
    // 8) Prepare the payload for the confirmation email
    //
    const emailOrder: Order = {
      id:             docRef.id,
      customerName:   data.name,
      userEmail:      data.email,
      phoneNumber:    phone,
      service:        svc.name,
      date:           data.deliveryDate,
      bookingTime:    data.deliveryTime,   // ← make sure we include this
      status:         'Pending',
      totalCost,
      notes:          data.notes ?? '',
      deliveryMethod: data.deliveryMethod,
      pickupAddress:  data.address?.trim() ? data.address : '',
      quantity:       data.quantity,
      repaint:        data.repaint,
      paymentMethod:  data.paymentMethod ?? 'card',
      paymentIntentId:data.paymentIntentId ?? undefined,
      createdAt:      new Date(),          // client‑side for email
    };

    //
    // 9) Send confirmation email (fire‑and‑forget)
    //
    sendEmail({ type: 'confirmation', order: emailOrder })
      .then(res => {
        if (!res.success) console.error('Email failed:', res.error);
      })
      .catch(err => console.error('Email error:', err));

    //
    // 10) Return the new order ID
    //
    return NextResponse.json(
      { orderId: docRef.id },
      { status: 201 }
    );
  } catch (err: unknown) {
    console.error('❌ Create-order error:', err);
    return NextResponse.json(
      {
        error:   'Internal server error',
        details: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    );
  }
}
