import Link from "next/link";
import type { Concern, Product } from "@/lib/catalog";
import { formatPrice } from "@/lib/money";
import { QuickAdd } from "./cart/AddToCart";
import { ProductImage } from "./ProductImage";

export function ProductCard({ product, concerns }: { product: Product; concerns: Concern[] }) {
  const onSale = product.price < product.regularPrice;
  const firstConcern = concerns.find((c) => product.concerns.includes(c.slug));

  return (
    <article className="group flex flex-col">
      <Link
        href={`/products/${product.slug}`}
        className="relative block aspect-[4/5] overflow-hidden rounded-3xl bg-cream-deep"
        tabIndex={-1}
        aria-hidden="true"
      >
        <ProductImage product={product} variant="card" className="h-full w-full transition duration-500 group-hover:scale-[1.04]" />
        {onSale && <span className="absolute top-3 left-3 rounded-full bg-plum px-3 py-1 text-xs font-semibold text-cream">Sale</span>}
      </Link>
      <div className="mt-4 flex flex-1 flex-col gap-1">
        {firstConcern && <p className="text-xs font-semibold tracking-[0.16em] text-ink-soft uppercase">{firstConcern.name}</p>}
        <h3 className="font-display text-2xl leading-tight">
          <Link href={`/products/${product.slug}`} className="hover:underline">
            {product.name}
          </Link>
        </h3>
        <p className="line-clamp-2 text-sm text-ink-soft">{product.tagline}</p>
        <div className="mt-auto flex items-center justify-between gap-3 pt-3">
          <p className="tabular-nums">
            <span className="font-semibold">{formatPrice(product.price)}</span>
            {onSale && (
              <span className="ml-2 text-sm text-ink-soft line-through">
                <span className="sr-only">Was </span>
                {formatPrice(product.regularPrice)}
              </span>
            )}
          </p>
          {product.inStock ? (
            <QuickAdd product={product} />
          ) : (
            <span className="text-sm text-ink-soft">Out of stock</span>
          )}
        </div>
      </div>
    </article>
  );
}
