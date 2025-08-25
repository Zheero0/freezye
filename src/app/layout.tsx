import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { CartProvider } from "@/components/cart-provider";
import Header from "@/components/header";
import CartModal from "@/components/cart-modal";
import { OrdersProvider } from "@/components/orders-provider";
import PageTransitionLoader from "@/components/page-transition-loader";

export const metadata: Metadata = {
  title: "Freezye - Freeze-Dried Sweets",
  description: "The tastiest freeze-dried sweets on the planet.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Lato:wght@400;700;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased h-full">
        <OrdersProvider>
          <CartProvider>
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-grow">
                <PageTransitionLoader>{children}</PageTransitionLoader>
              </main>
              <footer className="bg-card text-card-foreground border-t">
                <div className="container mx-auto py-4 px-4 sm:px-6 lg:px-8 text-center text-sm text-muted-foreground">
                  &copy; {new Date().getFullYear()} Freezye. All Rights
                  Reserved.
                </div>
              </footer>
            </div>
            <CartModal />
            <Toaster />
          </CartProvider>
        </OrdersProvider>
      </body>
    </html>
  );
}
