import { NextResponse } from 'next/server';
import { z } from 'zod';
import { sendEmail } from '@/lib/email';
import type { Order } from '@/lib/types';

// Zod schema to validate incoming request payload
const emailPayloadSchema = z.object({
  type: z.enum(['confirmation', 'statusUpdate']),
  order: z.any(), // runtime shape not strictly enforced here
  newStatus: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const validation = emailPayloadSchema.safeParse(body);
    if (!validation.success) {
      console.error('Email API Validation Error:', validation.error.flatten());
      return NextResponse.json(
        { error: 'Invalid request payload', details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const { type, order, newStatus } = validation.data;

    // Ensure correct typing for order
    const result = await sendEmail({ type, order: order as Order, newStatus });

    if (!result.success) {
      console.error('Email sending failed via API route:', result.error);
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Unhandled error in send-email API route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
