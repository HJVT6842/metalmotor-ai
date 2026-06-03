"use client";

import { useState } from "react";

import { WhatsAppCta } from "@/components/WhatsAppCta";
import { Container } from "@/components/ui/Container";
import { CloseIcon, MenuIcon } from "@/components/ui/icons";
import { NAV_LINKS, SITE } from "@/data/site";

/** Sticky site header with responsive mobile navigation. */
export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-steel-200 bg-white/90 backdrop-blur">
      <Container className="flex h-16 items-center justify-between">
        <a href="#inicio" className="flex items-center gap-2" aria-label={SITE.name}>
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-steel-900 font-bold text-brand-500">
            M
          </span>
          <span className="text-lg font-bold tracking-tight text-steel-900">
            {SITE.name}
          </span>
        </a>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Principal">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-steel-600 transition-colors hover:text-steel-900"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:block">
          <WhatsAppCta label="Cotizar" size="md" />
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex items-center justify-center rounded-md p-2 text-steel-700 md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
        >
          {open ? <CloseIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
        </button>
      </Container>

      {open ? (
        <div id="mobile-menu" className="border-t border-steel-200 bg-white md:hidden">
          <Container className="flex flex-col gap-1 py-4">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-2 py-2.5 text-base font-medium text-steel-700 hover:bg-steel-100"
              >
                {link.label}
              </a>
            ))}
            <div className="mt-2">
              <WhatsAppCta label="Cotizar por WhatsApp" size="md" className="w-full" />
            </div>
          </Container>
        </div>
      ) : null}
    </header>
  );
}
