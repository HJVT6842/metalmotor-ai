"use client";

import { useEffect, useState } from "react";

import { WhatsAppCta } from "@/components/WhatsAppCta";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";
import { CloseIcon, MenuIcon } from "@/components/ui/icons";
import { cn } from "@/lib/cn";
import { NAV_LINKS } from "@/data/site";

/** Sticky glass header that solidifies on scroll. */
export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 transition-colors duration-300",
        scrolled || open
          ? "border-b border-white/10 bg-steel-950/80 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <Container className="flex h-16 items-center justify-between">
        <a href="#inicio" aria-label="Metal Motor — inicio">
          <Logo variant="horizontal" />
        </a>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Principal">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-steel-300 transition-colors hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden lg:block">
          <WhatsAppCta label="Cotizar" size="md" />
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex items-center justify-center rounded-md p-2 text-white lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
        >
          {open ? <CloseIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
        </button>
      </Container>

      {open ? (
        <div
          id="mobile-menu"
          className="border-t border-white/10 bg-steel-950/95 backdrop-blur-xl lg:hidden"
        >
          <Container className="flex flex-col gap-1 py-4">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-2 py-2.5 text-base font-medium text-steel-200 hover:bg-white/5 hover:text-white"
              >
                {link.label}
              </a>
            ))}
            <div className="mt-2">
              <WhatsAppCta
                label="Cotizar por WhatsApp"
                size="md"
                className="w-full"
              />
            </div>
          </Container>
        </div>
      ) : null}
    </header>
  );
}
