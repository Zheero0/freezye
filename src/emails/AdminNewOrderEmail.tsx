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

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:9002';

export const AdminNewOrderEmail = ({ order }: { order: Order }) => {
  const previewText = `New order received #${order.id.substring(0, 7)}`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>🛒 New Order Received</Heading>
          <Text style={paragraph}>
            You have received a new order from {order.customerName}. Details are below.
          </Text>
          <Section style={card}>
            <Text style={cardHeader}>Order #{order.id.substring(0, 7)}</Text>
            <Hr style={hr} />
            <Row style={itemRow}>
              <Column style={itemTitle}>Service:</Column>
              <Column style={itemValue} align="right">
                {order.service} (x{order.quantity})
              </Column>
            </Row>
            {order.repaint && (
              <Row style={itemRow}>
                <Column style={itemTitle}>Add-on:</Column>
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
            {order.deliveryMethod === 'collection' && (
              <Row style={itemRow}>
                <Column style={itemTitle}>Address:</Column>
                <Column style={itemValue} align="right">
                  {order.pickupAddress}
                </Column>
              </Row>
            )}
            <Row style={itemRow}>
              <Column style={itemTitle}>Date:</Column>
              <Column style={itemValue} align="right">
                {order.date}
              </Column>
            </Row>
            <Row style={itemRow}>
              <Column style={itemTitle}>Customer Email:</Column>
              <Column style={itemValue} align="right">
                {order.userEmail}
              </Column>
            </Row>
            <Row style={itemRow}>
              <Column style={itemTitle}>Phone:</Column>
              <Column style={itemValue} align="right">
                {order.phoneNumber || 'N/A'}
              </Column>
            </Row>
            <Hr style={hr} />
            <Row style={totalRow}>
              <Column style={totalTitle}>Total:</Column>
              <Column style={totalValue} align="right">
                £{order.totalCost?.toFixed(2)}
              </Column>
            </Row>
          </Section>
          {order.notes && (
            <Section style={{ marginTop: 20 }}>
              <Heading as="h3" style={subHeading}>
                Customer Notes
              </Heading>
              <Text style={paragraph}>{order.notes}</Text>
            </Section>
          )}
          <Hr style={hr} />
          <Text style={footer}>
            <Link href="https://sneakswash.com" style={footerLink}>
              sneakswash.com
            </Link>
            <br />
            Order management dashboard: <Link href="https://sneakswash.com/exec/admin" style={footerLink}>Admin</Link>
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default AdminNewOrderEmail;

// styles
const main = {
  backgroundColor: '#ffffff',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};
const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  width: '100%',
  maxWidth: '580px',
};
const heading = {
  fontSize: '24px',
  fontWeight: 'bold',
  textAlign: 'center' as const,
};
const subHeading = {
  fontSize: '18px',
  fontWeight: 'bold',
  margin: 0,
};
const paragraph = {
  fontSize: '14px',
  lineHeight: '22px',
  margin: '16px 0',
};
const card = {
  backgroundColor: '#f8f8f8',
  borderRadius: '8px',
  padding: '16px',
  border: '1px solid #e5e5e5',
};
const cardHeader = {
  fontSize: '16px',
  fontWeight: 'bold',
  margin: 0,
};
const itemRow = { width: '100%', padding: '4px 0' };
const itemTitle = { fontSize: '14px', color: '#555' };
const itemValue = { fontSize: '14px', fontWeight: 500 };
const totalRow = { width: '100%', paddingTop: 8 };
const totalTitle = { fontSize: '14px', fontWeight: 'bold', color: '#555' };
const totalValue = { fontSize: '16px', fontWeight: 'bold', color: '#111' };
const hr = { borderColor: '#e5e5e5', margin: '20px 0' };
const footerLink = { color: '#3b82f6', textDecoration: 'underline' };
const footer = { fontSize: '12px', color: '#888', textAlign: 'center' as const, marginTop: 20 };
