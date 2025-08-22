"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";

const navLinks = [
  { href: "/#services", label: "Services" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/#process", label: "Process" },
];

export function Header() {
  const [scrolled, setScrolled] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();

  const isAdminPage = pathname.startsWith("/exec/admin");

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center">
<Image
  src="/logo.png"
  alt="Sneakswash Logo"
  width={480}      // intrinsic size for optimization
  height={180}     // intrinsic size for optimization
  className="block h-20 w-auto md:h-24"
  priority
/>

        </Link>

        {!isAdminPage && (
          <nav className="hidden items-center gap-6 text-sm md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="transition-colors hover:text-foreground/80 text-foreground/60"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}

        <div className="flex items-center gap-2">
          {!isAdminPage && (
            <Button
              asChild
              size="sm"
              className="hidden md:inline-flex hover-lift glow-effect"
            >
              <Link href="/book">Book Now</Link>
            </Button>
          )}

          {isAdminPage && user && (
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="hidden md:inline-flex"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          )}

          <div className="md:hidden">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Open menu">
                  <Menu />
                </Button>
              </SheetTrigger>

              <SheetContent
                side="right"
                className="w-[300px] p-0 bg-background/95 backdrop-blur-sm"
              >
                {/* A11y requirement */}
                <SheetHeader className="sr-only">
                  <SheetTitle>Navigation</SheetTitle>
                </SheetHeader>

                {/* Tight custom header with large logo */}
                <div className="h-16 px-4 flex items-center border-b border-border">
                  <Link
                    href="/"
                    className="flex items-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
<Image
  src="/logo.png"
  alt="Sneakswash Logo"
  width={480}      // intrinsic size for optimization
  height={180}     // intrinsic size for optimization
  className="block h-20 w-auto md:h-24"
  priority
/>

                  </Link>
                </div>

                <nav className="flex flex-col gap-1 p-4">
                  {!isAdminPage &&
                    navLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="text-lg font-medium text-foreground/80 hover:text-primary rounded-md p-2 transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {link.label}
                      </Link>
                    ))}
                </nav>

                <div className="mt-auto p-4 border-t border-border">
                  {isAdminPage && user ? (
                    <Button onClick={handleLogout} className="w-full">
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </Button>
                  ) : (
                    <Button asChild size="lg" className="w-full font-bold">
                      <Link
                        href="/book"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Book Now
                      </Link>
                    </Button>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
