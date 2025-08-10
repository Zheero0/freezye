import { Resend } from 'resend';
import { render } from '@react-email/render';
import { OrderConfirmationEmail }    from '@/emails/OrderConfirmationEmail';
import { OrderStatusUpdateEmail }    from '@/emails/OrderStatusUpdateEmail';
import { AdminNewOrderEmail }        from '@/emails/AdminNewOrderEmail';
import type { Order, OrderStatus } from './types';

type SendResult = {
  success: boolean;
  error?: any;
  responses?: {
    customer?: any;
    admin?: any;
    statusUpdate?: any;
  };
};

if (!process.env.RESEND_API_KEY) {
  throw new Error('Missing RESEND_API_KEY');
}
const resend = new Resend(process.env.RESEND_API_KEY);
const fromAddress = 'SneaksWash <noreply@sneakswash.com>';
const adminEmail = process.env.ADMIN_EMAIL!;

export async function sendEmail(args: {
  type: 'confirmation' | 'statusUpdate';
  order: Order;
  newStatus?: OrderStatus;
}): Promise<SendResult> {
  if (args.type === 'confirmation') {
    return sendOrderConfirmation(args.order);
  } else {
    if (!args.newStatus) {
      return { success: false, error: 'newStatus is required' };
    }
    return sendOrderStatusUpdate(args.order, args.newStatus);
  }
}

async function sendOrderConfirmation(order: Order): Promise<SendResult> {
  const customerHtml = await render(<OrderConfirmationEmail order={order} />);
  const adminHtml    = await render(<AdminNewOrderEmail order={order} />);

  // Send to customer
  const customerResult = await resend.emails.send({
    from:    fromAddress,
    to:      [order.userEmail],
    subject: `Order Confirmed – #${order.id.slice(0,7)}`,
    html:    customerHtml,
  });

  if (customerResult.error) {
    return {
      success:  false,
      error:    customerResult.error,
      responses:{ customer: customerResult },
    };
  }

  // Send to admin
  const adminResult = await resend.emails.send({
    from:    fromAddress,
    to:      [adminEmail],
    subject: `New Order Received – #${order.id.slice(0,7)}`,
    html:    adminHtml,
  });

  if (adminResult.error) {
    return {
      success:  false,
      error:    adminResult.error,
      responses:{ customer: customerResult, admin: adminResult },
    };
  }

  return {
    success:    true,
    responses:  { customer: customerResult, admin: adminResult },
  };
}

async function sendOrderStatusUpdate(
  order:     Order,
  newStatus: OrderStatus
): Promise<SendResult> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const html    = await render(
    <OrderStatusUpdateEmail
      order={order}
      newStatus={newStatus}
      baseUrl={baseUrl}
    />
  );

  const statusResult = await resend.emails.send({
    from:    fromAddress,
    to:      [order.userEmail],
    subject: `Order Update – #${order.id.slice(0,7)}`,
    html,
  });

  if (statusResult.error) {
    return {
      success:  false,
      error:    statusResult.error,
      responses:{ statusUpdate: statusResult },
    };
  }

  return {
    success:    true,
    responses:  { statusUpdate: statusResult },
  };
}
