import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from '@/context/AuthContext';

export const metadata: Metadata = {
  title: 'SneaksWash',
  description: 'Professional sneaker cleaning for enthusiasts who care.',
    icons: {
    icon: "/logo.png",        // PNG works fine
    apple: "/logo.png",       // iOS home screen
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <div className="fixed inset-0 z-0">
          <div className="absolute left-1/2 top-0 h-[100vh] w-[100vw] -translate-x-1/2 bg-[radial-gradient(circle_50%_50%_at_50%_50%,#8EACFF33,transparent)] backdrop-blur-[2px]"></div>
          <div aria-hidden="true" className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute -left-40 top-1/4 w-[400px] h-[400px] bg-primary/30 rounded-full blur-3xl opacity-20 animate-pulse"></div>
            <div className="absolute -right-40 bottom-1/4 w-[400px] h-[400px] bg-accent/30 rounded-full blur-3xl opacity-20 animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-primary/10 to-accent/10 rounded-full blur-3xl animate-spin-slow"></div>
            <div className="absolute top-[80%] left-[10%] w-[300px] h-[300px] bg-primary/20 rounded-full blur-3xl opacity-10 animate-pulse delay-500"></div>
            <div className="absolute top-[120%] right-[5%] w-[250px] h-[250px] bg-accent/20 rounded-full blur-3xl opacity-10 animate-pulse delay-1500"></div>
          </div>
        </div>
        <AuthProvider>
          <div className="relative z-10 flex flex-col min-h-screen">
            {children}
          </div>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}