
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
  
  interface OrderStatusUpdateEmailProps {
    order: Order;
    newStatus: Order['status'];
  }
  
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:9002';
  
  export const OrderStatusUpdateEmail = ({ order, newStatus }: OrderStatusUpdateEmailProps) => {
    const previewText = `Update on your SneaksWash order #${order.id.substring(0,7)}`;
  
    const statusMessages: Record<Order['status'], string> = {
        Pending: "Your order is pending and will be processed shortly.",
        Collected: "We've successfully collected your sneakers! They are now on their way to our facility for their spa day.",
        'In Progress': "The cleaning process has begun! Our experts are meticulously restoring your sneakers.",
        'Ready for Collection': "Good news! Your sneakers are now ready for collection. You can pick them up from our Trafford Park location at your convenience.",
        Completed: "Great news! Your sneakers are clean, fresh, and ready for you.",
        Cancelled: "Your order has been cancelled as per your request."
    }

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
                    background-color: #0c0a09 !important;
                }
                .callout {
                    background-color: #0c0a09 !important;
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
                                        width="58"
                                        height="58"
                                        alt="SneaksWash Logo"
                                        />
                                    </Column>
                                    <Column align="right">
                                        <Text style={headerText}>Status Update</Text>
                                    </Column>
                                </Row>
                                <Hr style={hr} />
                                <Heading style={heading} className='text-left'>Your Order is Now "{newStatus}"</Heading>
                                <Text style={paragraph}>
                                    Hi {order.customerName}, we have an update on your order #{order.id.substring(0,7)}.
                                </Text>
                                <Text style={{ ...paragraph, ...callout }} className="callout">
                                    {statusMessages[newStatus]}
                                </Text>
                                
                                <Section style={card} className="card">
                                    <Text style={cardHeader}>Order Details</Text>
                                    <Row style={itemRow}>
                                        <Column style={itemTitle}>Service:</Column>
                                        <Column style={itemValue} align="right">{order.service} (x{order.quantity})</Column>
                                    </Row>
                                    <Row style={itemRow}>
                                        <Column style={itemTitle}>Scheduled for:</Column>
                                        <Column style={itemValue} align="right">{order.date}</Column>
                                    </Row>
                                </Section>
                    
                                <Text style={footer}>
                                  <Link href="https://sneakswash.com" style={footerLink}>
                                    sneakswash.com
                                  </Link>
                                  <br />
                                  Store First St Modwen Rd, Trafford Park, M32 0ZF
                           
                                  <br />
                                  Mon – Sat: 8am – 6pm | Sun: 10am – 4pm 
                                  <br />   
                                  <a href="tel:+447444023834" style={footerLink}>
                                    Call Us
                                  </a>
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
  
  export default OrderStatusUpdateEmail;
  
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
  
  const callout = {
    backgroundColor: '#0c0a09',
    padding: '16px',
    borderRadius: '8px',
    border: '1px solid #27272a',
    color: '#fafafa'
  }

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
    padding: '16px 0',
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

    
