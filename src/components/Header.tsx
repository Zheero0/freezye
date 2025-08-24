'use client';

import Link from 'next/link';
import { Candy, ShoppingCart, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { useCart } from '@/hooks/use-cart';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'Products' },
  { href: '/admin', label: 'Admin' },
];

function NavLinks({ className, onClick }: { className?: string; onClick?: () => void }) {
  return (
    <nav className={cn('flex items-center gap-4 lg:gap-6', className)}>
      {navItems.map((item) => (
        <Link
          key={item.label}
          href={item.href}
          className="transition-colors hover:text-foreground/80 text-foreground/60"
          onClick={onClick}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

function Logo({ onClick }: { onClick?: () => void }) {
  return (
    <Link href="/" className="flex items-center space-x-2" onClick={onClick}>
      <Candy className="h-6 w-6 text-primary" />
      <span className="font-bold font-headline">Freezye</span>
    </Link>
  );
}

export default function Header() {
  const { getItemCount, setIsCartOpen } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);
  const itemCount = getItemCount();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        {/* Left: logo + nav (desktop) / menu (mobile) */}
        <div className="flex items-center md:flex-1 pl-4 md:pl-8">
          {/* Mobile menu */}
          <div className="md:hidden mr-2">
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Open menu">
                  <Menu />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72">
                <SheetTitle className="sr-only">Menu</SheetTitle>
                <div className="flex flex-col gap-4 p-4">
                  <Logo onClick={() => setIsMenuOpen(false)} />
                  <NavLinks
                    className="flex-col items-start gap-2"
                    onClick={() => setIsMenuOpen(false)}
                  />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Desktop logo+nav */}
          <div className="hidden md:flex items-center gap-6">
            <Logo />
            <NavLinks />
          </div>
        </div>

        {/* Center: logo (mobile only) */}
        <div className="flex md:hidden flex-1 justify-center">
          <Logo onClick={() => setIsMenuOpen(false)} />
        </div>

        {/* Right: cart */}
        <div className="flex items-center md:flex-1 justify-end pr-4 md:pr-8">
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            onClick={() => setIsCartOpen(true)}
            aria-label="Open cart"
          >
            <ShoppingCart className="h-5 w-5" />
            {isClient && itemCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-secondary text-secondary-foreground text-[10px] leading-none">
                {itemCount}
              </span>
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}
