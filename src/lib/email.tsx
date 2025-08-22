// @ts-nocheck
'use server';

import { Resend } from 'resend';
import { OrderConfirmationEmail } from '@/emails/OrderConfirmationEmail';
import { OrderStatusUpdateEmail } from '@/emails/OrderStatusUpdateEmail';
import { AdminOrderNotificationEmail } from '@/emails/AdminOrderNotificationEmail';
import type { Order } from '@/lib/types';
import { render } from '@react-email/render';

if (!process.env.RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY is not set in the environment variables.');
}

const resend = new Resend(process.env.RESEND_API_KEY);
const fromEmail = process.env.FROM_EMAIL || 'orders@sneakswash.com';
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

  if (!type || !order) {
    return { success: false, error: 'Missing type or order data' };
  }

  const customerEmail = order.userEmail;
  if (!customerEmail) {
    return { success: false, error: 'Customer email is missing' };
  }

  const fromAddress = `${fromName} <${fromEmail}>`;

  try {
    switch (type) {
      case 'confirmation': {
        const customerHtml = await render(<OrderConfirmationEmail order={order} />);
        const adminHtml = await render(<AdminOrderNotificationEmail order={order} />);

        await resend.emails.send({
          from: fromAddress,
          to: customerEmail,
          subject: `Order Confirmed: #${order.id.substring(0, 7)}`,
          html: customerHtml,
        });

        await resend.emails.send({
          from: fromAddress,
          to: adminEmail,
          subject: `New Order Received: #${order.id.substring(0, 7)}`,
          html: adminHtml,
        });
        break;
      }

      case 'statusUpdate': {
        if (!newStatus) {
          return { success: false, error: 'Missing newStatus for statusUpdate email' };
        }
        const emailHtml = await render(<OrderStatusUpdateEmail order={order} newStatus={newStatus} />);
        await resend.emails.send({
          from: fromAddress,
          to: customerEmail,
          subject: `Order Update: Your order is now ${newStatus}`,
          html: emailHtml,
        });
        break;
      }

      default:
        return { success: false, error: 'Invalid email type' };
    }

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error?.message || 'Unknown email error' };
  }
}
