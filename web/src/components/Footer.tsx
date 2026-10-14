import Link from "next/link";
import { FREE_SHIPPING_FROM } from "@/lib/cart";
import { formatPrice } from "@/lib/money";

export function Footer() {
  return (
    <footer className="on-dark mt-auto bg-plum-deep text-cream">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="space-y-3">
          <p className="font-display text-4xl">Dewlune</p>
          <p className="max-w-sm text-cream/75">
            Gentle, effective skincare made for Pakistani weather. Free delivery on orders over {formatPrice(FREE_SHIPPING_FROM)}, cash on delivery
            nationwide.
          </p>
        </div>
        <nav aria-label="Shop">
          <p className="mb-3 text-sm font-semibold tracking-widest text-moon uppercase">Shop</p>
          <ul className="space-y-1 text-cream/80">
            <li>
              <Link href="/shop" className="inline-flex min-h-10 items-center hover:text-cream">
                All products
              </Link>
            </li>
            <li>
              <Link href="/shop?concern=brightening" className="inline-flex min-h-10 items-center hover:text-cream">
                Brightening
              </Link>
            </li>
            <li>
              <Link href="/shop?concern=barrier-repair" className="inline-flex min-h-10 items-center hover:text-cream">
                Barrier repair
              </Link>
            </li>
          </ul>
        </nav>
        <div>
          <p className="mb-3 text-sm font-semibold tracking-widest text-moon uppercase">About this site</p>
          <p className="text-sm text-cream/75">
            Dewlune is a fictional brand. This store is a portfolio project built with Next.js, Plasma UI and a headless WooCommerce backend. No real
            orders are shipped.
          </p>
        </div>
      </div>
    </footer>
  );
}
