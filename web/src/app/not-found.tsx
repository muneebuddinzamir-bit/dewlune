import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6">
      <p className="text-sm font-semibold tracking-[0.2em] text-plum uppercase">404</p>
      <h1 className="mt-3 font-display text-5xl">We couldn&apos;t find that page</h1>
      <p className="mt-3 text-ink-soft">It may have moved, or the product is no longer available.</p>
      <Link href="/shop" className="mt-8 inline-block rounded-full bg-ink px-7 py-3.5 font-semibold text-cream hover:bg-plum">
        Browse the shop
      </Link>
    </div>
  );
}
