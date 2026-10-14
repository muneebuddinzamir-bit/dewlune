import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { AddToCart } from "@/components/cart/AddToCart";
import { ProductCard } from "@/components/ProductCard";
import { ProductImage } from "@/components/ProductImage";
import { FREE_SHIPPING_FROM } from "@/lib/cart";
import { getCatalog, getProduct } from "@/lib/catalog";
import { formatPrice } from "@/lib/money";

export async function generateStaticParams() {
  const { products } = await getCatalog();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/products/[slug]">): Promise<Metadata> {
  const product = await getProduct((await params).slug);
  if (!product) return { title: "Product not found" };
  return { title: product.name, description: product.tagline };
}

type Params = PageProps<"/products/[slug]">["params"];

export default function ProductPage({ params }: PageProps<"/products/[slug]">) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <Suspense fallback={<ProductSkeleton />}>
        <ProductDetails params={params} />
      </Suspense>
    </div>
  );
}

function ProductSkeleton() {
  return (
    <div aria-hidden="true" className="mt-10 grid gap-10 lg:grid-cols-2 lg:gap-16">
      <div className="aspect-[4/5] rounded-[2rem] bg-cream-deep" />
      <div className="space-y-4">
        <div className="h-14 w-3/4 rounded-xl bg-cream-deep" />
        <div className="h-6 w-1/2 rounded-xl bg-cream-deep" />
        <div className="h-12 w-full rounded-full bg-cream-deep" />
      </div>
    </div>
  );
}

async function ProductDetails({ params }: { params: Params }) {
  const { slug } = await params;
  const [{ products, concerns }, product] = await Promise.all([getCatalog(), getProduct(slug)]);
  if (!product) notFound();

  const onSale = product.price < product.regularPrice;
  const tags = concerns.filter((c) => product.concerns.includes(c.slug));
  const related = products.filter((p) => p.slug !== product.slug && p.concerns.some((c) => product.concerns.includes(c))).slice(0, 4);

  return (
    <>
      <nav aria-label="Breadcrumb" className="text-sm text-ink-soft">
        <ol className="flex flex-wrap gap-2">
          <li>
            <Link href="/shop" className="hover:underline">
              Shop
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-ink">
            {product.name}
          </li>
        </ol>
      </nav>

      <div className="mt-6 grid gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="aspect-[4/5] overflow-hidden rounded-[2rem] bg-cream-deep lg:sticky lg:top-24 lg:self-start">
          <ProductImage product={product} variant="detail" className="h-full w-full" sizes="(min-width: 1024px) 50vw, 100vw" preload />
        </div>

        <div>
          <ul className="flex flex-wrap gap-2">
            {tags.map((t) => (
              <li key={t.slug}>
                <Link href={`/shop?concern=${t.slug}`} className="inline-flex min-h-9 items-center rounded-full bg-cream-deep px-3 text-xs font-semibold hover:bg-line">
                  {t.name}
                </Link>
              </li>
            ))}
          </ul>
          <h1 className="mt-4 font-display text-5xl leading-tight sm:text-6xl">{product.name}</h1>
          <p className="mt-3 text-lg text-ink-soft">{product.tagline}</p>
          <p className="mt-6 flex items-baseline gap-3 tabular-nums">
            <span className="text-2xl font-semibold">{formatPrice(product.price)}</span>
            {onSale && (
              <span className="text-ink-soft line-through">
                <span className="sr-only">Was </span>
                {formatPrice(product.regularPrice)}
              </span>
            )}
            {product.size && <span className="text-sm text-ink-soft">· {product.size}</span>}
          </p>

          <div className="mt-8">
            <AddToCart
              product={{
                id: product.id,
                slug: product.slug,
                name: product.name,
                price: product.price,
                size: product.size,
                image: product.image,
                art: product.art,
              }}
              inStock={product.inStock}
            />
          </div>
          <p className="mt-4 text-sm text-ink-soft">
            Free delivery over {formatPrice(FREE_SHIPPING_FROM)} · Cash on delivery · Ships in 2-4 working days
          </p>

          <div className="mt-10 divide-y divide-line border-y border-line">
            <details className="group py-5" open>
              <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between font-semibold">
                About this product
                <span className="text-xl transition group-open:rotate-45" aria-hidden="true">
                  +
                </span>
              </summary>
              <p className="mt-3 whitespace-pre-line text-ink-soft">{product.description}</p>
            </details>
            {product.keyIngredients.length > 0 && (
              <details className="group py-5">
                <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between font-semibold">
                  Key ingredients
                  <span className="text-xl transition group-open:rotate-45" aria-hidden="true">
                    +
                  </span>
                </summary>
                <ul className="mt-3 list-disc space-y-1 pl-5 text-ink-soft">
                  {product.keyIngredients.map((i) => (
                    <li key={i}>{i}</li>
                  ))}
                </ul>
              </details>
            )}
            {product.howToUse && (
              <details className="group py-5">
                <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between font-semibold">
                  How to use
                  <span className="text-xl transition group-open:rotate-45" aria-hidden="true">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-ink-soft">{product.howToUse}</p>
              </details>
            )}
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section aria-labelledby="related-title" className="mt-24">
          <h2 id="related-title" className="font-display text-4xl">
            Pairs well with
          </h2>
          <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4 lg:gap-x-6">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} concerns={concerns} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
