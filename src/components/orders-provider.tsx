
"use client";

import React, { useEffect, useCallback } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { OrdersContext } from '@/hooks/use-orders';
import { useToast } from '@/hooks/use-toast';
import type { Order } from '@/types';
import { products } from '@/lib/products';

const dummyOrders: Omit<Order, 'shippingCost'>[] = [
  {
    id: '1721234567890',
    date: new Date('2024-07-17T12:30:00Z').toISOString(),
    status: 'Delivered',
    customer: {
      name: 'Alice Johnson',
      email: 'alice@example.com',
      street: '123 Sweet Lane',
      city: 'Candyville',
      zip: 'SW1A 0AA',
      country: 'UK',
    },
    items: [
      { ...products[0], quantity: 2 },
      { ...products[3], quantity: 1 },
    ],
    subtotal: 23.27,
    discount: 0,
    total: 28.26,
    shipping: 'standard',
    referralSource: 'instagram',
  },
  {
    id: '1721123456789',
    date: new Date('2024-07-16T10:00:00Z').toISOString(),
    status: 'Shipped',
    customer: {
      name: 'Bob Smith',
      email: 'bob@example.com',
      street: '456 Treat Street',
      city: 'Confectionery City',
      zip: 'M1 1AE',
      country: 'UK',
    },
    items: [
      { ...products[1], quantity: 1 },
      { ...products[4], quantity: 1 },
    ],
    subtotal: 15.98,
    discount: 0,
    total: 28.97,
    shipping: 'express',
    referralSource: 'tiktok',
  },
    {
    id: '1721012345678',
    date: new Date('2024-07-15T18:45:00Z').toISOString(),
    status: 'Processing',
    customer: {
      name: 'Charlie Brown',
      email: 'charlie@example.com',
      street: '789 Gummy Road',
      city: 'Sugar Town',
      zip: 'B1 1BB',
      country: 'UK',
    },
    items: [
        { ...products[2], quantity: 3 },
        { ...products[5], quantity: 2 },
        { ...products[6], quantity: 1 },
    ],
    subtotal: 43.94,
    discount: 8.49,
    total: 40.44,
    shipping: 'standard',
    referralSource: 'friend',
  }
];

const SHIPPING_COSTS = {
  standard: 4.99,
  express: 12.99,
};

const getShippingCost = (shipping: string) => {
    return shipping === 'express' ? SHIPPING_COSTS.express : SHIPPING_COSTS.standard;
}

const initialOrders: Order[] = dummyOrders.map(o => ({...o, shippingCost: getShippingCost(o.shipping)}));


export function OrdersProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useLocalStorage<Order[]>('orders', []);
  const { toast } = useToast();

  useEffect(() => {
    const storedOrders = window.localStorage.getItem('orders');
    if (!storedOrders || JSON.parse(storedOrders).length === 0) {
      setOrders(initialOrders);
    }
  }, []);

  const addOrder = (newOrderData: Omit<Order, 'id' | 'date' | 'status'>): Order => {
    const newOrder: Order = {
      ...newOrderData,
      id: Date.now().toString(),
      date: new Date().toISOString(),
      status: 'Processing',
    };
    setOrders((prevOrders) => [newOrder, ...prevOrders]);
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, status } : order
      )
    );
    toast({
      title: "Order Updated",
      description: `Order #${orderId.slice(-6)} status changed to ${status}.`,
    });
  };

  const getOrderById = useCallback((orderId: string) => {
    return orders.find(order => order.id === orderId);
  }, [orders]);

  const value = {
    orders,
    addOrder,
    updateOrderStatus,
    getOrderById
  };

  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>;
}
