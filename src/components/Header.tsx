
'use client';

import Link from 'next/link';
import { Candy, ShoppingCart, Menu, X, Home, ShoppingBag, LayoutGrid } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/use-cart';
import { useIsMobile } from '@/hooks/use-mobile';
import { useState, useEffect } from 'react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetFooter,
  SheetHeader
} from "@/components/ui/sheet"
import { cn } from '@/lib/utils';
import { Separator } from './ui/separator';
import { motion } from 'framer-motion';

const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/products', label: 'Products', icon: ShoppingBag },
    { href: '/admin', label: 'Admin', icon: LayoutGrid },
];

export default function Header() {
  const { getItemCount, setIsCartOpen, isMenuOpen, setIsMenuOpen } = useCart();
  const isMobile = useIsMobile();
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  const itemCount = getItemCount();

  const NavLinks = ({ inSheet = false }: { inSheet?: boolean }) => (
    <nav className={cn(
        "flex items-center gap-4 lg:gap-6",
        inSheet && "flex-col items-stretch gap-2"
      )}>
        {navItems.map((item) => (
             inSheet ? (
                <Button
                    key={item.label}
                    asChild
                    variant="ghost"
                    className="justify-start text-base py-6 w-full group"
                    onClick={() => setIsMenuOpen(false)}
                >
                    <Link href={item.href} className="flex items-center">
                        <motion.div
                            whileHover={{ rotate: [0, -15, 15, -15, 0] }}
                            transition={{ duration: 0.5 }}
                        >
                            <item.icon className="mr-4 h-5 w-5" />
                        </motion.div>
                        {item.label}
                    </Link>
                </Button>
            ) : (
                <Button
                    key={item.label}
                    asChild
                    variant="ghost"
                    className="text-foreground/60 hover:text-foreground/80"
                >
                    <Link
                        href={item.href}
                        className="flex items-center gap-2"
                        onClick={() => setIsMenuOpen(false)}
                    >
                         <motion.div
                            whileHover={{ scale: 1.2, rotate: -5 }}
                            transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        >
                            <item.icon className="h-4 w-4" />
                         </motion.div>
                        {item.label}
                    </Link>
                </Button>
            )
        ))}
    </nav>
  );

  const Logo = () => (
    <Link href="/" className="flex items-center space-x-2" onClick={() => isMenuOpen && setIsMenuOpen(false)}>
        <Candy className="h-6 w-6 text-primary" />
        <span className="font-bold font-headline">Freezye</span>
    </Link>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex items-center">
            <Logo />
            <div className="ml-6">
                <NavLinks />
            </div>
        </div>

        {isMobile ? (
             <div className="flex items-center justify-between w-full">
                <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <Menu />
                            <span className="sr-only">Open Menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="flex flex-col p-0">
                        <SheetHeader className="p-4 border-b">
                           <div className="flex items-center gap-2">
                             <Logo />
                           </div>
                           <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                        </SheetHeader>
                        <div className="p-4 flex-1">
                            <NavLinks inSheet={true} />
                        </div>
                        <SheetFooter className="p-4 border-t bg-muted/40">
                             <Button asChild className="w-full" onClick={() => setIsMenuOpen(false)}>
                                <Link href="/products">
                                    Shop 3 for 2 Deals
                                </Link>
                            </Button>
                        </SheetFooter>
                    </SheetContent>
                </Sheet>
                 <div className="flex justify-center flex-1">
                    <Logo />
                 </div>
             </div>
        ) : <div className="md:hidden"><Logo/></div>}

        <div className={cn("flex items-center justify-end space-x-2", isMobile ? "" : "flex-1")}>
            <Button variant="ghost" size="icon" className="relative" onClick={() => setIsCartOpen(true)}>
                <ShoppingCart className="h-5 w-5" />
                {isClient && itemCount > 0 && (
                    <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-secondary text-secondary-foreground text-xs">
                        {itemCount}
                    </span>
                )}
                <span className="sr-only">Shopping Cart</span>
            </Button>
        </div>
      </div>
    </header>
  );
}
