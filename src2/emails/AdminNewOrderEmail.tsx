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

const _baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:9002';

export function AdminNewOrderEmail({ order }: { order: Order & { bookingTime?: string } }) {
  const previewText = `New order received #${order.id.substring(0, 7)}`;

  return (
    <Html>
      <Head>
        {/* enforce dark mode */}
        <meta name="color-scheme" content="dark" />
        <meta name="supported-color-schemes" content="dark" />
        <style>{`
          :root { color-scheme: dark; supported-color-schemes: dark; }
          @media (prefers-color-scheme: light) {
            body[bgcolor], table[bgcolor], .main-container {
              background-color: #000 !important;
            }
          }
        `}</style>
      </Head>

      <Preview>{previewText}</Preview>

      {/* @ts-ignore */}
      <Body style={main} bgcolor="#000000">
        {/* MSO dark‑background wrapper */}
        {/* @ts-ignore */}
        <table role="presentation" width="100%" bgcolor="#000000" style={main}>
          <tr>
            <td></td>
            <td width="580">
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
            <tr>
              <td>
                <Container style={container} className="main-container">
                  <Section style={box}>
                    <Row style={headerRow}>
                      <Column align="left">
                        <Img
                          src={`${_baseUrl}/trans-logo.svg`}
                          width="50"
                          height="50"
                          alt="SneaksWash Logo"
                        />
                      </Column>
                      <Column align="right">
                        <Text style={headerText}>New Order Received</Text>
                      </Column>
                    </Row>

                    <Hr style={hr} />

                    <Heading style={heading}>
                      Order #{order.id.substring(0, 7)}
                    </Heading>
                    <Text style={paragraph}>
                      A new order has just been placed by <strong>{order.customerName}</strong>.
                    </Text>

                    <Section style={card}>
                      <Text style={cardHeader}>Order Summary</Text>
                      <Hr style={hr} />

                      <Row style={itemRow}>
                        <Column style={itemTitle}>Service:</Column>
                        <Column style={itemValue} align="right">
                          {order.service} (x{order.quantity})
                        </Column>
                      </Row>

                      {order.repaint && (
                        <Row style={itemRow}>
                          <Column style={itemTitle}>Add‑on:</Column>
                          <Column style={itemValue} align="right">
                            Repaint
                          </Column>
                        </Row>
                      )}

                      <Row style={itemRow}>
                        <Column style={itemTitle}>Delivery:</Column>
                        <Column style={itemValue} align="right">
                          {order.deliveryMethod}
                        </Column>
                      </Row>

                      {/* ← Updated to show both date and time */}
                      <Row style={itemRow}>
                        <Column style={itemTitle}>Scheduled:</Column>
                        <Column style={itemValue} align="right">
                          {order.date}
                          {order.bookingTime ? ` at ${order.bookingTime}` : ''}
                        </Column>
                      </Row>

                      {order.deliveryMethod === 'collection' && (
                        <Row style={itemRow}>
                          <Column style={itemTitle}>Address:</Column>
                          <Column style={itemValue} align="right">
                            {order.pickupAddress}
                          </Column>
                        </Row>
                      )}

                      <Hr style={hr} />

                      <Row style={totalRow}>
                        <Column style={totalTitle}>Total</Column>
                        <Column style={totalValue} align="right">
                          £{order.totalCost?.toFixed(2)}
                        </Column>
                      </Row>
                    </Section>

                    <Text style={paragraph}>
                      You can view and manage this order in your admin dashboard.
                    </Text>

                    <Hr style={hr} />

                    <Text style={footer}>
                      <Link href="https://sneakswash.com/admin" style={footerLink}>
                        Admin Dashboard
                      </Link>
                      <br />
                      &copy; {new Date().getFullYear()} SneaksWash
                    </Text>
                  </Section>
                </Container>
              </td>
            </tr>
          </tbody>
        </table>

        {/*[if mso | IE]>*/}
            </td>
            <td></td>
          </tr>
        </table>
        {/*<![endif]*/}
      </Body>
    </Html>
  );
}

export default AdminNewOrderEmail;

// ——— Styles ———

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
  fontSize: '20px',
  fontWeight: 'bold',
  textAlign: 'center',
  margin: '20px 0',
};

const paragraph: React.CSSProperties = {
  color: '#a1a1aa',
  fontSize: '14px',
  lineHeight: '22px',
  margin: '16px 0',
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
