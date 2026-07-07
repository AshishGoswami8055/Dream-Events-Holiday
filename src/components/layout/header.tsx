"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X, Phone } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/logo";
import { NAV_LINKS, SITE_CONFIG } from "@/constants";
import { cn } from "@/lib/utils";

/** Plain pages without a hero/banner — keep the light header at the top */
const SOLID_HEADER_ROUTES = ["/privacy-policy", "/terms-and-conditions"];

function usesTransparentHeader(pathname: string, isScrolled: boolean) {
  if (pathname.startsWith("/admin")) return false;
  if (SOLID_HEADER_ROUTES.includes(pathname)) return false;
  return !isScrolled;
}

export function Header() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const isTransparent = usesTransparentHeader(pathname, isScrolled);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        isScrolled ? "glass-nav py-3 shadow-md" : "bg-transparent py-4"
      )}
    >
      <div className="container-custom flex items-center justify-between">
        <Logo href="/" height={isScrolled ? 44 : 48} priority className="rounded-lg" />

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium transition-all",
                isTransparent
                  ? pathname === link.href
                    ? "bg-white/15 text-white"
                    : "text-white/85 hover:bg-white/10 hover:text-white"
                  : pathname === link.href
                    ? "bg-primary/10 text-primary"
                    : "text-foreground/80 hover:bg-secondary hover:text-primary"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <a
            href={`tel:${SITE_CONFIG.phone.replace(/\s/g, "")}`}
            className={cn(
              "flex items-center gap-2 text-sm transition-colors",
              isTransparent ? "text-white/80 hover:text-white" : "text-muted-foreground hover:text-primary"
            )}
            aria-label={`Call us at ${SITE_CONFIG.phone}`}
          >
            <Phone className="h-4 w-4" aria-hidden="true" />
            <span className="hidden xl:inline">{SITE_CONFIG.phone}</span>
          </a>
          <Button
            asChild
            size="sm"
            className={cn(
              "rounded-full",
              isTransparent ? "bg-white text-black hover:bg-white/90 btn-glow-light" : "btn-glow"
            )}
            variant={isTransparent ? "secondary" : "accent"}
          >
            <Link href="/packages">Book Now</Link>
          </Button>
        </div>

        <button
          className={cn(
            "rounded-lg p-2 lg:hidden focus:outline-none focus:ring-2 focus:ring-primary",
            isTransparent ? "text-white hover:bg-white/10" : "hover:bg-secondary"
          )}
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t bg-background lg:hidden"
          >
            <nav className="container-custom flex flex-col gap-1 py-4" aria-label="Mobile navigation">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "rounded-lg px-4 py-3 text-base font-medium transition-colors hover:bg-secondary",
                    pathname === link.href ? "text-primary bg-secondary" : "text-foreground"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <Button asChild className="mt-2 rounded-full btn-glow" variant="accent">
                <Link href="/packages">Book Now</Link>
              </Button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
