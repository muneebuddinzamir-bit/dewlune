"use client";

import Link from "next/link";
import { lazy, Suspense, useRef, useState } from "react";
import { formatPrice } from "@/lib/money";
import type { CatalogItem } from "../cart/CartProvider";
import { ProductArt } from "../ProductArt";
import { GlassSurface, type Surface } from "../liquid/surface";
import { useLiquidGate } from "../liquid/useLiquidGate";

// Loaded only once the gate opens, so phones never download Plasma.
const LiquidStage = lazy(() => import("../liquid/LiquidStage"));

type Props = {
  featured: CatalogItem & { tagline: string };
  concerns: { slug: string; name: string }[];
};

export function Hero({ featured, concerns }: Props) {
  const ref = useRef<HTMLElement>(null);
  const liquid = useLiquidGate(ref);
  const [stageReady, setStageReady] = useState(false);

  const content = (S: Surface) => (
    <div className="mx-auto grid max-w-6xl items-center gap-6 px-4 py-14 sm:px-6 lg:grid-cols-[1.2fr_0.8fr] lg:gap-10 lg:py-24">
      <S fuse={false} radius={32} className="p-7 sm:p-10">
        <div>
          <p className="text-sm font-semibold tracking-[0.2em] text-moon uppercase">New · The night ritual</p>
          <h1 className="mt-4 font-display text-5xl leading-[1.02] sm:text-6xl lg:text-7xl">
            Skincare that moves <em className="text-dusk">with your day.</em>
          </h1>
          <p className="mt-5 max-w-lg text-lg text-cream/85">
            Lightweight serums, gentle cleansers and an SPF that disappears on every skin tone. Made for humid summers and dry winters.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/shop" className="rounded-full bg-cream px-7 py-3.5 font-semibold text-ink transition hover:bg-moon">
              Shop all products
            </Link>
            <Link href="#concerns" className="rounded-full border border-cream/60 px-7 py-3.5 font-semibold text-cream transition hover:bg-cream/10">
              Find your routine
            </Link>
          </div>
        </div>
      </S>

      <div className="grid gap-4 lg:gap-10">
        <S draggable radius={28} className="p-5" label="Featured product">
          <div className="flex items-center gap-4">
            <ProductArt art={featured.art} uid={`${featured.slug}-hero`} className="h-40 w-32 shrink-0" title={featured.name} />
            <div className="min-w-0">
              <p className="text-xs font-semibold tracking-[0.18em] text-moon uppercase">Bestseller</p>
              <p className="mt-1 font-display text-3xl leading-tight">{featured.name}</p>
              <p className="mt-1 text-sm text-cream/80">{featured.tagline}</p>
              <p className="mt-3 flex items-center gap-3">
                <span className="font-semibold">{formatPrice(featured.price)}</span>
                <Link href={`/products/${featured.slug}`} className="text-sm font-semibold underline underline-offset-4" data-plasma-nodrag>
                  View product
                </Link>
              </p>
            </div>
          </div>
        </S>
        <div className="flex flex-wrap gap-3 lg:gap-6 xl:gap-8">
          {concerns.map((c) => (
            <S key={c.slug} radius={22} className="px-4 py-3 xl:px-5">
              <Link href={`/shop?concern=${c.slug}`} className="text-sm font-semibold" data-plasma-nodrag>
                {c.name}
              </Link>
            </S>
          ))}
        </div>
        {liquid && <p className="text-sm text-cream/70">Drag the product card. It&apos;s liquid, and it merges with whatever it touches.</p>}
      </div>
    </div>
  );

  return (
    <section ref={ref} aria-label="Introduction" className={`liquid-hero on-dark relative text-cream ${liquid && stageReady ? "" : "dusk-field"}`}>
      {liquid ? (
        // The frosted panels stay in place while Plasma loads, so the layout never jumps.
        <Suspense fallback={content(GlassSurface)}>
          <LiquidStage bounds={ref} render={content} onReadyChange={setStageReady} />
        </Suspense>
      ) : (
        content(GlassSurface)
      )}
    </section>
  );
}
