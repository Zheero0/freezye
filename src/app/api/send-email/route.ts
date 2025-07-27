// app/api/send-email/route.ts (or wherever your POST handler lives)

import { NextResponse } from 'next/server';
import { z }           from 'zod';
import { sendEmail }   from '@/lib/email';
import type { Order }  from '@/lib/types';

// validate incoming JSON
const schema = z.object({
  type:      z.enum(['confirmation','statusUpdate']),
  order:     z.any(),               // narrow if you care
  newStatus: z.string().optional(),
});

export async function POST(request: Request) {
  const payload = await request.json();
  const parsed  = schema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid payload', details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { type, order, newStatus } = parsed.data;

  // call your helper
  const result = await sendEmail({
    type,
    order:     order as Order,
    newStatus: newStatus as Order['status']
  });

  // if sendEmail reports failure, return 500 + the raw resend error
  if (!result.success) {
    console.error('Email send failed:', result.error);
    return NextResponse.json(
      { success: false, error: result.error, responses: result.responses },
      { status: 500 }
    );
  }

  // otherwise return the full success + response objects
  return NextResponse.json(
    { success: true, responses: result.responses },
    { status: 200 }
  );
}
