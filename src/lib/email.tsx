// src/lib/email.tsx
'use server';

import { Resend } from 'resend';
import { OrderConfirmationEmail } from '@/emails/OrderConfirmationEmail';
import { OrderStatusUpdateEmail } from '@/emails/OrderStatusUpdateEmail';
import { AdminOrderNotificationEmail } from '@/emails/AdminOrderNotificationEmail';
import type { Order } from '@/lib/types';

if (!process.env.RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY is not set in the environment variables.');
}

const resend = new Resend(process.env.RESEND_API_KEY);
const fromEmail = process.env.FROM_EMAIL || 'info@sneakswash.com';
const adminEmail = process.env.ADMIN_EMAIL || 'admin@sneakswash.com';
const fromName = 'SneaksWash';

type EmailType = 'confirmation' | 'statusUpdate';

interface SendEmailPayload {
  type: EmailType;
  order: Order;
  newStatus?: Order['status'];
}

export async function sendEmail(payload: SendEmailPayload) {
  const { type, order, newStatus } = payload;

  if (!type || !order) return { success: false, error: 'Missing type or order' };

  const customerEmail = order.userEmail;
  if (!customerEmail) return { success: false, error: 'Missing customer email' };

  const fromAddress = `${fromName} <${fromEmail}>`;

  try {
    if (type === 'confirmation') {
      // Fire both sends; succeed only if BOTH succeed.
      const [cust, admin] = await Promise.allSettled([
        resend.emails.send({
          from: fromAddress,
          to: customerEmail,
          subject: `Order Confirmed: #${order.id.substring(0, 7)}`,
          react: <OrderConfirmationEmail order={order} />,
        }),
        resend.emails.send({
          from: fromAddress,
          to: adminEmail,
          subject: `New Order Received: #${order.id.substring(0, 7)}`,
          react: <AdminOrderNotificationEmail order={order} />,
        }),
      ]);

      const customerOk = cust.status === 'fulfilled';
      const adminOk = admin.status === 'fulfilled';

      if (!customerOk || !adminOk) {
        console.error('[EMAIL] confirmation failed', {
          customerOk,
          adminOk,
          customerErr: customerOk ? null : (cust as PromiseRejectedResult).reason,
          adminErr: adminOk ? null : (admin as PromiseRejectedResult).reason,
        });
        return { success: false, error: 'One or both emails failed to send' };
      }

      return { success: true };
    }

    if (type === 'statusUpdate') {
      if (!newStatus) return { success: false, error: 'Missing newStatus' };

      await resend.emails.send({
        from: fromAddress,
        to: customerEmail,
        subject: `Order Update: Your order is now ${newStatus}`,
        react: <OrderStatusUpdateEmail order={order} newStatus={newStatus} />,
      });

      return { success: true };
    }

    return { success: false, error: 'Invalid email type' };
  } catch (err: any) {
    console.error('[EMAIL] send failed:', err);
    return { success: false, error: err?.message || 'Unknown error' };
  }
}
