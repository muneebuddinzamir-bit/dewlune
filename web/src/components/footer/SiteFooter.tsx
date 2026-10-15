"use client";

import Link from "next/link";
import { lazy, Suspense, useRef, useState } from "react";
import { FREE_SHIPPING_FROM } from "@/lib/cart";
import { formatPrice } from "@/lib/money";
import { midnightMood } from "../liquid/moods";
import { GlassSurface, type Surface } from "../liquid/surface";
import { useLiquidGate } from "../liquid/useLiquidGate";
import { NewsletterForm } from "./NewsletterForm";

const LiquidStage = lazy(() => import("../liquid/LiquidStage"));

const icon = "h-6 w-6 shrink-0 text-moon";

const trust = [
  {
    title: "Free delivery",
    text: `On orders over ${formatPrice(FREE_SHIPPING_FROM)}`,
    svg: (
      <svg viewBox="0 0 24 24" className={icon} fill="none" stroke="currentColor" strokeWidth={1.7} aria-hidden="true">
        <path d="M3 6h11v10H3zM14 9h4l3 3v4h-7" strokeLinejoin="round" />
        <circle cx="7" cy="17.5" r="1.8" />
        <circle cx="17" cy="17.5" r="1.8" />
      </svg>
    ),
  },
  {
    title: "Cash on delivery",
    text: "Pay the rider anywhere in Pakistan",
    svg: (
      <svg viewBox="0 0 24 24" className={icon} fill="none" stroke="currentColor" strokeWidth={1.7} aria-hidden="true">
        <rect x="3" y="6" width="18" height="12" rx="2" />
        <circle cx="12" cy="12" r="2.6" />
        <path d="M6.5 9.5v5M17.5 9.5v5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "7-day returns",
    text: "On unopened products",
    svg: (
      <svg viewBox="0 0 24 24" className={icon} fill="none" stroke="currentColor" strokeWidth={1.7} aria-hidden="true">
        <path d="M4 12a8 8 0 1 0 2.4-5.7M4 4v4h4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

const columns = [
  {
    title: "Shop",
    links: [
      { href: "/shop", label: "All products" },
      { href: "/shop?concern=hydration", label: "Hydration" },
      { href: "/shop?concern=brightening", label: "Brightening" },
      { href: "/shop?concern=acne-care", label: "Acne care" },
    ],
  },
  {
    title: "Help",
    links: [
      { href: "/delivery", label: "Delivery & returns" },
      { href: "/delivery#faq", label: "FAQ" },
      { href: "/cart", label: "Your bag" },
    ],
  },
  {
    title: "Dewlune",
    links: [
      { href: "/about", label: "Our story" },
      { href: "/#ritual", label: "The ritual" },
    ],
  },
];

export function SiteFooter() {
  const ref = useRef<HTMLElement>(null);
  const liquid = useLiquidGate(ref);
  const [stageReady, setStageReady] = useState(false);

  const panels = (S: Surface) => (
    <div className="grid items-stretch gap-6 lg:grid-cols-[1.35fr_0.65fr] lg:gap-10">
      <S fuse={false} radius={30} className="p-7 sm:p-9">
        <div>
          <p className="text-sm font-semibold tracking-[0.2em] text-moon uppercase">The Dewlune letter</p>
          <p className="mt-3 font-display text-4xl leading-tight sm:text-5xl">Skin notes, once a month.</p>
          <p className="mt-3 max-w-md text-cream/80">New launches, routines for the season and the occasional offer. Never spam.</p>
          <NewsletterForm />
        </div>
      </S>
      <ul className="grid content-center gap-6">
        {trust.map((t) => (
          <li key={t.title}>
            <S radius={22} className="px-5 py-4">
              <div className="flex items-center gap-4">
                {t.svg}
                <div>
                  <p className="font-semibold">{t.title}</p>
                  <p className="text-sm text-cream/75">{t.text}</p>
                </div>
              </div>
            </S>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <footer ref={ref} className={`on-dark mt-auto text-cream ${liquid && stageReady ? "" : "midnight-field"}`}>
      <div className="mx-auto max-w-6xl px-4 pt-16 pb-10 sm:px-6">
        {liquid ? (
          <Suspense fallback={panels(GlassSurface)}>
            <LiquidStage bounds={ref} render={panels} onReadyChange={setStageReady} mood={midnightMood} group="footer" />
          </Suspense>
        ) : (
          panels(GlassSurface)
        )}

        <div className="mt-14 grid gap-10 border-t border-cream/15 pt-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="inline-flex min-h-11 items-center font-display text-4xl">
              Dewlune
            </Link>
            <p className="mt-2 max-w-xs text-cream/75">Gentle, effective skincare made for Pakistani weather, from humid summers to dry winters.</p>
          </div>
          {columns.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <p className="mb-2 text-sm font-semibold tracking-widest text-moon uppercase">{col.title}</p>
              <ul>
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="inline-flex min-h-11 items-center text-cream/80 hover:text-cream">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-cream/15 pt-6 text-sm text-cream/70 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Dewlune. A fictional brand made for a portfolio project; no real orders are shipped.</p>
          <p>
            Designed and built by{" "}
            <a href="https://muneebuddinzamir-bit.github.io" className="inline-flex min-h-11 items-center font-semibold text-cream underline underline-offset-4">
              Muneeb Ud Din
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
