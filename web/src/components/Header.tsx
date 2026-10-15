"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "./cart/CartProvider";

const links = [
  { href: "/shop", label: "Shop all" },
  { href: "/shop?concern=hydration", label: "Hydration" },
  { href: "/shop?concern=acne-care", label: "Acne care" },
  { href: "/#ritual", label: "Our ritual" },
];

function BagIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
      <path d="M5 8h14l-1.2 11.2a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8z" strokeLinejoin="round" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" strokeLinecap="round" />
    </svg>
  );
}

export function Header() {
  const { cart, ready, setOpen } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-cream/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <button
          type="button"
          className="grid h-11 w-11 place-items-center rounded-full md:hidden"
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
            {menuOpen ? <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" /> : <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />}
          </svg>
        </button>

        <Link href="/" className="inline-flex min-h-11 items-center font-display text-3xl tracking-tight" onClick={() => setMenuOpen(false)}>
          Dewlune
        </Link>

        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex items-center gap-8 text-sm font-medium">
            {links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="inline-flex min-h-11 items-center hover:text-plum">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <button
          type="button"
          onClick={() => setOpen(true)}
          className="relative grid h-11 w-11 place-items-center rounded-full hover:bg-cream-deep"
          aria-label={`Open bag, ${cart.count} ${cart.count === 1 ? "item" : "items"}`}
        >
          <BagIcon />
          {ready && cart.count > 0 && (
            <span className="absolute top-0.5 right-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-plum px-1 text-[11px] font-bold text-cream">
              {cart.count}
            </span>
          )}
        </button>
      </div>

      {menuOpen && (
        <nav id="mobile-nav" aria-label="Main" className="border-t border-line md:hidden">
          <ul className="mx-auto max-w-6xl px-4 py-2">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={() => setMenuOpen(false)}
                  className="flex min-h-12 items-center border-b border-line text-base last:border-0"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
