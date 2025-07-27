/* eslint-disable react/no-unescaped-entities */
// @ts-nocheck — ignoring TS for email‑specific attrs
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
  Row,
  Column,
} from '@react-email/components';
import * as React from 'react';
import type { Order } from '@/lib/types';

interface OrderStatusUpdateEmailProps {
  order: Order;
  newStatus: Order['status'];
  baseUrl: string;
}

export function OrderStatusUpdateEmail({
  order,
  newStatus,
  baseUrl,
}: OrderStatusUpdateEmailProps) {
  const previewText = `Update on your SneaksWash order #${order.id.substring(0, 7)}`;

  const statusMessages: Record<Order['status'], string> = {
    Pending:    'Your order is pending and will be processed shortly.',
    Collected:  "We’ve successfully collected your sneakers! They are now on their way to our facility for their spa day.",
    'In Progress': 'The cleaning process has begun! Our experts are meticulously restoring your sneakers.',
    Completed:  'Great news! Your sneakers are clean, fresh, and ready for you.',
    Cancelled:  'Your order has been cancelled as per your request.',
  };

  return (
    <Html>
      <Head>
        {/* Always dark */}
        <meta name="color-scheme" content="dark" />
        <meta name="supported-color-schemes" content="dark" />
        <style>{`
          :root { color-scheme: dark; supported-color-schemes: dark; }
          @media (prefers-color-scheme: light) {
            body[bgcolor], table[bgcolor], .main-container {
              background-color: #000000 !important;
            }
          }
        `}</style>
      </Head>

      <Preview>{previewText}</Preview>

      {/* @ts-ignore */}
      <Body style={main} bgcolor="#000000">
        {/* MSO/IE fallback */}
        {/* @ts-ignore */}
        <table role="presentation" width="100%" bgcolor="#000000" style={main}>
          <tr><td></td><td width="580">
        {/*<![endif]*/}

        {/* @ts-ignore */}
        <table
          align="center"
          width="100%"
          border={0}
          cellPadding={0}
          cellSpacing={0}
          role="presentation"
          bgcolor="#000000"
          style={main}
        >
          <tbody>
            <tr><td>
              <Container style={container} className="main-container">
                <Section style={box}>
                  <Row style={headerRow}>
                    <Column align="left">
                      <Img
                        src={`${baseUrl}/trans-logo.svg`}
                        width="50"
                        height="50"
                        alt="SneaksWash Logo"
                      />
                    </Column>
                    <Column align="right">
                      <Text style={headerText}>Status Update</Text>
                    </Column>
                  </Row>

                  <Hr style={hr} />

                  <Heading style={heading}>
                    Order Update — “{newStatus}”
                  </Heading>
                  <Text style={paragraph}>
                    Hi {order.customerName}, here’s the latest on your order #{order.id.substring(0,7)}.
                  </Text>

                  <Text style={{ ...paragraph, ...callout }} className="callout">
                    {statusMessages[newStatus]}
                  </Text>

                  <Section style={card}>
                    <Text style={cardHeader}>Order Details</Text>

                    <Hr style={hr} />

                    <Row style={itemRow}>
                      <Column style={itemTitle}>Service:</Column>
                      <Column style={itemValue} align="right">
                        {order.service} (x{order.quantity})
                      </Column>
                    </Row>

                    <Row style={itemRow}>
                      <Column style={itemTitle}>Scheduled for:</Column>
                      <Column style={itemValue} align="right">
                        {order.date}
                      </Column>
                    </Row>

                    <Hr style={hr} />

                    <Row style={totalRow}>
                      <Column style={totalTitle}>Current Status</Column>
                      <Column style={totalValue} align="right">
                        {newStatus}
                      </Column>
                    </Row>
                  </Section>

                  <Text style={paragraph}>
                    We’ll notify you again with any further updates. If you have any questions, please don’t hesitate to contact us.
                  </Text>

                  <Hr style={hr} />

                  <Text style={footer}>
                    <Link href="https://sneakswash.com" style={footerLink}>
                      sneakswash.com
                    </Link>
                    <br/>
                    Store First St Modwen Rd, Trafford Park, M32 0ZF
                    <br/>
                    Mon–Sat: 8 am–6 pm | Sun: 10 am–4 pm
                  </Text>
                </Section>
              </Container>
            </td></tr>
          </tbody>
        </table>

        {/*[if mso | IE]>*/}
            </td><td></td></tr>
        </table>
        {/*<![endif]*/}
      </Body>
    </Html>
  );
}

const main: React.CSSProperties = {
  backgroundColor: '#000000',
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Ubuntu, sans-serif',
};

const container: React.CSSProperties = {
  backgroundColor: '#000000',
  margin: '0 auto',
  padding: '20px 0 48px',
  width: '100%',
  maxWidth: '580px',
};

const box: React.CSSProperties = {
  padding: '24px',
  backgroundColor: '#1c1917',
  border: '1px solid #27272a',
  borderRadius: '12px',
};

const headerRow: React.CSSProperties = { width: '100%' };
const headerText: React.CSSProperties = {
  color: '#a1a1aa',
  fontSize: '14px',
  margin: 0,
};

const heading: React.CSSProperties = {
  color: '#fafafa',
  fontSize: '24px',
  fontWeight: 'bold',
  textAlign: 'center',
  margin: '30px 0',
};

const paragraph: React.CSSProperties = {
  color: '#a1a1aa',
  fontSize: '14px',
  lineHeight: '22px',
  margin: '16px 0',
};

const callout: React.CSSProperties = {
  backgroundColor: '#0c0a09',
  padding: '16px',
  borderRadius: '8px',
  border: '1px solid #27272a',
  color: '#fafafa',
};

const hr: React.CSSProperties = { borderColor: '#27272a', margin: '20px 0' };

const card: React.CSSProperties = {
  backgroundColor: '#1c1917',
  borderRadius: '8px',
  padding: '16px',
  border: '1px solid #27272a',
};

const cardHeader: React.CSSProperties = {
  color: '#fafafa',
  fontSize: '16px',
  fontWeight: 'bold',
  margin: '0 0 16px 0',
};

const itemRow: React.CSSProperties = { width: '100%', padding: '4px 0' };
const itemTitle: React.CSSProperties = { color: '#a1a1aa', fontSize: '14px' };
const itemValue: React.CSSProperties = {
  color: '#fafafa',
  fontSize: '14px',
  fontWeight: 500,
};

const totalRow: React.CSSProperties = { width: '100%', paddingTop: '8px' };
const totalTitle: React.CSSProperties = {
  color: '#a1a1aa',
  fontSize: '14px',
  fontWeight: 'bold',
};
const totalValue: React.CSSProperties = {
  color: '#8EACFF',
  fontSize: '16px',
  fontWeight: 'bold',
};

const footerLink: React.CSSProperties = {
  color: '#8EACFF',
  textDecoration: 'underline',
};
const footer: React.CSSProperties = {
  color: '#a1a1aa',
  fontSize: '12px',
  lineHeight: '20px',
  textAlign: 'center',
  margin: '20px 0 0 0',
};
