'use server';

import { Resend } from 'resend';
import { OrderConfirmationEmail } from '@/emails/OrderConfirmationEmail';
import { OrderStatusUpdateEmail } from '@/emails/OrderStatusUpdateEmail';
import { AdminNewOrderEmail } from '@/emails/AdminNewOrderEmail';
import type { Order } from '@/lib/types';
// Using React templates with Resend; no need to pre-render HTML.

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

  let subject: string;
  let emailReact: JSX.Element;
  const customerEmail = order.userEmail;

  if (!customerEmail) {
    console.error('Email Error: Customer email is missing');
    return { success: false, error: 'Customer email is missing' };
  }

  const fromAddress = `${fromName} <${fromEmail}>`;

  try {
    switch (type) {
      case 'confirmation':
        subject = `Order Confirmed: #${order.id.substring(0, 7)}`;
        emailReact = OrderConfirmationEmail({ order });

        // Send to customer
        await resend.emails.send({
          from: fromAddress,
          to: customerEmail,
          subject: subject,
          react: emailReact,
        });

        // Tailored admin notification
        const adminReact = AdminNewOrderEmail({ order });
        await resend.emails.send({
          from: fromAddress,
          to: adminEmail,
          subject: `New Order Received: #${order.id.substring(0, 7)}`,
          react: adminReact,
        });

        break;

      case 'statusUpdate':
        if (!newStatus) {
            console.error('Email Error: Missing newStatus for statusUpdate email');
            return { success: false, error: 'Missing newStatus for statusUpdate email' };
        }
        subject = `Order Update: Your order is now ${newStatus}`;
        emailReact = OrderStatusUpdateEmail({ order, newStatus });

        // Send to customer
        await resend.emails.send({
          from: fromAddress,
          to: customerEmail,
          subject: subject,
          react: emailReact,
        });
        break;

      default:
        console.error(`Email Error: Invalid email type '${type}'`);
        return { success: false, error: 'Invalid email type' };
    }
    
    console.log(`Email type '${type}' sent successfully to ${customerEmail}.`);
    return { success: true };

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error(`Failed to send email type '${type}':`, message);
    return { success: false, error: message };
  }
}
