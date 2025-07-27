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

export function OrderConfirmationEmail({ order }: { order: Order & { bookingTime?: string } }) {
  const previewText = `Your SneaksWash order #${order.id.substring(0, 7)} is confirmed!`;

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
        {/* MSO/IE dark wrapper */}
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
                        src={`${_baseUrl}/trans-logo.svg`}
                        width="50"
                        height="50"
                        alt="SneaksWash Logo"
                      />
                    </Column>
                    <Column align="right">
                      <Text style={headerText}>Order Confirmed</Text>
                    </Column>
                  </Row>

                  <Hr style={hr} />

                  <Heading style={heading}>
                    Thanks for your order, {order.customerName}!
                  </Heading>
                  <Text style={paragraph}>
                    We’ve received your order and are getting it ready for you. You can view your order details below.
                  </Text>

                  <Section style={card}>
                    <Text style={cardHeader}>
                      Order Summary – #{order.id.substring(0, 7)}
                    </Text>
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

                    {/* <-- Updated this block to include both date + time --> */}
                    <Row style={itemRow}>
                      <Column style={itemTitle}>Scheduled for:</Column>
                      <Column style={itemValue} align="right">
                        {order.date}
                        {order.bookingTime ? ` at ${order.bookingTime}` : ''}
                      </Column>
                    </Row>

                    {order.deliveryMethod === 'collection' && (
                      <Row style={itemRow}>
                        <Column style={itemTitle}>Collection Address:</Column>
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
                    We’ll notify you again once your order status is updated. If you have any questions, please don’t hesitate to contact us.
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

export default OrderConfirmationEmail;

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

const itemRow: React.CSSProperties = {
  width: '100%',
  padding: '4px 0',
};
const itemTitle: React.CSSProperties = {
  color: '#a1a1aa',
  fontSize: '14px',
};
const itemValue: React.CSSProperties = {
  color: '#fafafa',
  fontSize: '14px',
  fontWeight: 500,
};

const totalRow: React.CSSProperties = {
  width: '100%',
  paddingTop: '8px',
};
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
