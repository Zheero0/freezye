
import {
    Body,
    Button,
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
    Column
  } from '@react-email/components';
  import * as React from 'react';
  import type { Order } from '@/lib/types';
  
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:9002';
  
  export const AdminOrderNotificationEmail = ({ order }: {order: Order}) => {
    const previewText = `New Order Received: #${order.id.substring(0,7)}`;
  
    return (
      <Html>
        <Head>
          <meta name="color-scheme" content="light dark" />
          <meta name="supported-color-schemes" content="light dark" />
          <style>
            {`
              :root {
                color-scheme: light dark;
                supported-color-schemes: light dark;
              }
              @media (prefers-color-scheme: dark) {
                body, table, .main-container, .content-box {
                  background-color: #0c0a09 !important;
                }
                .card {
                    background-color: #1c1917 !important;
                }
              }
            `}
          </style>
        </Head>
        <Preview>{previewText}</Preview>
        <Body style={main}>
          {/*[if mso | IE]>
          <table role="presentation" width="100%"
            style="background-color:#0c0a09;">
            <tr>
              <td></td>
              <td width="580">
          <![endif]*/}
          <table align="center" width="100%" border={0} cellPadding="0" cellSpacing="0" role="presentation" style={main}>
            <tbody>
              <tr>
                <td>
                  <Container style={container} className="main-container">
                    <Section style={box} className="content-box">
                      <Row style={headerRow}>
                        <Column align="left">
                            <Img
                            src={`${baseUrl}/logo.png`}
                            width="48"
                            height="48"
                            alt="SneaksWash Logo"
                            />
                        </Column>
                        <Column align="right">
                            <Text style={headerText}>New Order</Text>
                        </Column>
                      </Row>
                      <Hr style={hr} />
                      <Heading style={heading}>New Order Received!</Heading>
                      <Text style={paragraph} className='text-left'>
                        A new order has been placed by {order.customerName}. You can view the full order details in the admin dashboard.
                      </Text>
                      
                      <Section style={card} className="card">
                        <Text style={cardHeader}>Order Summary - #{order.id.substring(0,7)}</Text>
                        <Hr style={hr} />
                        <Row style={itemRow}>
                            <Column style={itemTitle}>Customer:</Column>
                            <Column style={itemValue} align="right">{order.customerName}</Column>
                        </Row>
                        <Row style={itemRow}>
                            <Column style={itemTitle}>Email:</Column>
                            <Column style={itemValue} align="right">{order.userEmail}</Column>
                        </Row>
                         <Row style={itemRow}>
                            <Column style={itemTitle}>Phone:</Column>
                            <Column style={itemValue} align="right">{order.phoneNumber}</Column>
                        </Row>
                        <Hr style={hr}/>
                        <Row style={itemRow}>
                            <Column style={itemTitle}>Service:</Column>
                            <Column style={itemValue} align="right">{order.service} (x{order.quantity})</Column>
                        </Row>
                        {order.repaint && (
                            <Row style={itemRow}>
                                <Column style={itemTitle}>Add-on:</Column>
                                <Column style={itemValue} align="right">Repaint</Column>
                            </Row>
                        )}
                        <Row style={itemRow}>
                            <Column style={itemTitle}>Delivery Method:</Column>
                            <Column style={{...itemValue, textTransform: 'capitalize'}} align="right">{order.deliveryMethod}</Column>
                        </Row>
                        <Row style={itemRow}>
                            <Column style={itemTitle}>Scheduled for:</Column>
                            <Column style={itemValue} align="right">{order.date}</Column>
                        </Row>
                         {order.deliveryMethod === 'collection' && (
                            <Row style={itemRow}>
                                <Column style={itemTitle}>Collection Address:</Column>
                                <Column style={itemValue} align="right">{order.pickupAddress}</Column>
                            </Row>
                         )}
                         {order.paymentMethod && (
                            <Row style={itemRow}>
                                <Column style={itemTitle}>Payment Method:</Column>
                                <Column style={{...itemValue, textTransform: 'capitalize'}} align="right">{order.paymentMethod}</Column>
                            </Row>
                         )}
                        <Hr style={hr} />
                        <Row style={totalRow}>
                            <Column style={totalTitle}>Total</Column>
                            <Column style={totalValue} align="right">£{order.totalCost?.toFixed(2)}</Column>
                        </Row>
                      </Section>
          
                      <Section style={{ textAlign: 'center', marginTop: '30px' }}>
                        <Button style={button} href={`${baseUrl}/exec/admin/orders/${order.id}`}>
                          View Order in Dashboard
                        </Button>
                      </Section>
                      
                      <Hr style={hr} />
                      <Text style={footer}>
                         <Link href="https://sneakswash.com" style={footerLink}>sneakswash.com</Link>
                      </Text>
                    </Section>
                  </Container>
                </td>
              </tr>
            </tbody>
          </table>
          {/*[if mso | IE]>
              </td>
              <td></td>
            </tr>
          </table>
          <![endif]*/}
        </Body>
      </Html>
    );
  };
  
  export default AdminOrderNotificationEmail;
  
  const main = {
    backgroundColor: '#0c0a09',
    fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
  };
  
  const container = {
    backgroundColor: '#0c0a09',
    margin: '0 auto',
    padding: '20px 0 48px',
    width: '100%',
    maxWidth: '580px',
  };
  
  const box = {
    padding: '24px',
    backgroundColor: '#1c1917',
    border: '1px solid #27272a',
    borderRadius: '12px',
  };

  const headerRow = {
    width: '100%',
  }

  const headerText = {
    color: '#a1a1aa',
    fontSize: '14px',
    margin: '0',
  }
  
  const heading = {
    color: '#fafafa',
    fontSize: '24px',
    fontWeight: 'bold',
    textAlign: 'center' as const,
    margin: '30px 0',
  };
  
  const paragraph = {
    color: '#a1a1aa',
    fontSize: '14px',
    lineHeight: '22px',
    margin: '16px 0',
  };

  const button = {
    backgroundColor: '#8EACFF',
    borderRadius: '6px',
    color: '#111827',
    fontSize: '14px',
    fontWeight: '500',
    textDecoration: 'none',
    textAlign: 'center' as const,
    display: 'inline-block',
    padding: '12px 20px',
  };
  
  const hr = {
    borderColor: '#27272a',
    margin: '20px 0',
  };
  
  const footerLink = {
    color: '#8EACFF',
    textDecoration: 'underline',
  };

  const footer = {
    color: '#a1a1aa',
    fontSize: '12px',
    lineHeight: '20px',
    textAlign: 'center' as const,
    margin: '20px 0 0 0',
  };
  
  const card = {
    backgroundColor: '#0c0a09',
    borderRadius: '8px',
    padding: '16px',
    border: '1px solid #27272a'
  }

  const cardHeader = {
    color: '#fafafa',
    fontSize: '16px',
    fontWeight: 'bold',
    margin: '0 0 16px 0',
  }

  const itemRow = {
    width: '100%',
    padding: '4px 0',
  }
  const itemTitle = {
    color: '#a1a1aa',
    fontSize: '14px'
  }
  const itemValue = {
    color: '#fafafa',
    fontSize: '14px',
    fontWeight: '500'
  }
  const totalRow = {
    width: '100%',
    paddingTop: '8px'
  }
  const totalTitle = {
    color: '#a1a1aa',
    fontSize: '14px',
    fontWeight: 'bold'
  }
  const totalValue = {
    color: '#8EACFF',
    fontSize: '16px',
    fontWeight: 'bold',
  }
