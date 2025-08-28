"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useOrders } from "../hooks/use-orders";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "./ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Badge } from "./ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import type { Order } from "../types";
import { cn } from "../lib/utils";
import { useIsMobile } from "../hooks/use-mobile";
import BrandedLoader from "./branded-loader";

export default function OrderManagement() {
  const { orders, updateOrderStatus } = useOrders();
  const [isClient, setIsClient] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    // A small delay to better showcase the loading state
    const timer = setTimeout(() => setIsClient(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const getStatusVariant = (status: Order["status"]) => {
    switch (status) {
      case "Processing":
        return "default";
      case "Shipped":
        return "secondary";
      case "Delivered":
        return "outline";
      case "Cancelled":
        return "destructive";
      default:
        return "default";
    }
  };

  const StatusSelector = ({ order }: { order: Order }) => (
    <Select
      value={order.status}
      onValueChange={(value) =>
        updateOrderStatus(order.id, value as Order["status"])
      }
    >
      <SelectTrigger
        className={cn(
          "w-32 focus:ring-0 focus:ring-offset-0 border-none !bg-transparent",
          {
            "text-yellow-600": order.status === "Processing",
            "text-blue-600": order.status === "Shipped",
            "text-green-600": order.status === "Delivered",
            "text-red-600": order.status === "Cancelled",
          }
        )}
        onClick={(e) => e.preventDefault()}
      >
        <SelectValue asChild>
          <Badge
            variant={getStatusVariant(order.status)}
            className="capitalize"
          >
            {order.status}
          </Badge>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="Processing">Processing</SelectItem>
        <SelectItem value="Shipped">Shipped</SelectItem>
        <SelectItem value="Delivered">Delivered</SelectItem>
        <SelectItem value="Cancelled">Cancelled</SelectItem>
      </SelectContent>
    </Select>
  );

  const OrderRow = ({ order }: { order: Order }) => (
    <TableRow>
      <TableCell>
        <Link
          href={`/admin/orders/${order.id}`}
          className="font-medium hover:underline"
        >
          #{order.id.slice(-6)}
        </Link>
      </TableCell>
      <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
      <TableCell>{order.customer.name}</TableCell>
      <TableCell>£{order.total.toFixed(2)}</TableCell>
      <TableCell>
        <StatusSelector order={order} />
      </TableCell>
    </TableRow>
  );

  const DesktopView = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Order ID</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Total</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.length > 0 ? (
          orders.map((order) => <OrderRow key={order.id} order={order} />)
        ) : (
          <TableRow>
            <TableCell colSpan={5} className="text-center">
              No orders yet.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );

  const MobileView = () => (
    <div className="space-y-4">
      {orders.length > 0 ? (
        orders.map((order) => (
          <Link
            href={`/admin/orders/${order.id}`}
            key={order.id}
            className="block"
          >
            <Card className="hover:bg-muted/50 transition-colors">
              <CardHeader>
                <CardTitle>Order #{order.id.slice(-6)}</CardTitle>
                <CardDescription>
                  {new Date(order.date).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Customer</span>
                  <span className="font-medium">{order.customer.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total</span>
                  <span className="font-medium">£{order.total.toFixed(2)}</span>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Status</span>
                <StatusSelector order={order} />
              </CardFooter>
            </Card>
          </Link>
        ))
      ) : (
        <div className="text-center text-muted-foreground py-8">
          No orders yet.
        </div>
      )}
    </div>
  );

  const LoadingSkeleton = () => (
    <div className="min-h-[60vh] flex items-center justify-center">
      <BrandedLoader
        title="Loading Order Simulations..."
        description="Please wait while we conjure up your simulated order data."
      />
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Simulation</CardTitle>
        <CardDescription>
          View and manage simulated orders. Data is stored in your browser's
          local storage.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!isClient ? (
          <LoadingSkeleton />
        ) : isMobile ? (
          <MobileView />
        ) : (
          <DesktopView />
        )}
      </CardContent>
    </Card>
  );
}
