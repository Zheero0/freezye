import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import OrderManagement from "../../components/order-management";
import { OrdersProvider } from "../../components/orders-provider";
import { Package } from "lucide-react";

export default function AdminPage() {
  return (
    <OrdersProvider>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold font-headline mb-6">
          Admin Dashboard
        </h1>
        <Tabs defaultValue="orders" className="w-full">
          <TabsList className="grid w-full grid-cols-1">
            <TabsTrigger value="orders">
              <Package className="mr-2 h-4 w-4" />
              Order Simulation
            </TabsTrigger>
          </TabsList>
          <TabsContent value="orders">
            <OrderManagement />
          </TabsContent>
        </Tabs>
      </div>
    </OrdersProvider>
  );
}
