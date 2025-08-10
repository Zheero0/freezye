// email.tsx  <-- rename to .tsx so JSX works without TS errors
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

  if (!type || !order) {
    console.error('Email Error: Missing type or order data');
    return { success: false, error: 'Missing type or order data' };
  }

  const customerEmail = order.userEmail;
  if (!customerEmail) {
    console.error('Email Error: Customer email is missing');
    return { success: false, error: 'Customer email is missing' };
  }

  const fromAddress = `${fromName} <${fromEmail}>`;

  try {
    if (type === 'confirmation') {
      // Send to customer
      await resend.emails.send({
        from: fromAddress,
        to: customerEmail,
        subject: `Order Confirmed: #${order.id.substring(0, 7)}`,
        react: <OrderConfirmationEmail order={order} />,
      });

      // Send to admin
      await resend.emails.send({
        from: fromAddress,
        to: adminEmail,
        subject: `New Order Received: #${order.id.substring(0, 7)}`,
        react: <AdminOrderNotificationEmail order={order} />,
      });
    }

    if (type === 'statusUpdate') {
      if (!newStatus) {
        console.error('Email Error: Missing newStatus for statusUpdate email');
        return { success: false, error: 'Missing newStatus for statusUpdate email' };
      }

      await resend.emails.send({
        from: fromAddress,
        to: customerEmail,
        subject: `Order Update: Your order is now ${newStatus}`,
        react: <OrderStatusUpdateEmail order={order} newStatus={newStatus} />,
      });
    }

    console.log(`Email type '${type}' sent successfully to ${customerEmail}.`);
    
    return { success: true };
  } catch (error: any) {
    console.error(`Failed to send email type '${type}':`, error);
    return { success: false, error: error.message };
  }
}
