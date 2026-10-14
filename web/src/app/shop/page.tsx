import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ProductCard } from "@/components/ProductCard";
import { getCatalog } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Shop all",
  description: "Every Dewlune product: cleansers, serums, moisturizers and sunscreen.",
};

const sorts = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
];

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function hrefFor(concern: string | undefined, sort: string | undefined) {
  const params = new URLSearchParams();
  if (concern) params.set("concern", concern);
  if (sort && sort !== "featured") params.set("sort", sort);
  const qs = params.toString();
  return qs ? `/shop?${qs}` : "/shop";
}

async function Results({ searchParams }: Pick<PageProps<"/shop">, "searchParams">) {
  const params = await searchParams;
  const concern = first(params.concern);
  const sort = first(params.sort) ?? "featured";
  const { products, concerns } = await getCatalog();

  const active = concerns.find((c) => c.slug === concern);
  let list = active ? products.filter((p) => p.concerns.includes(active.slug)) : products;
  if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
  if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);

  return (
    <>
      <div className="flex flex-col gap-6 border-b border-line pb-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="font-display text-5xl sm:text-6xl">{active ? active.name : "Shop all"}</h1>
          <p className="mt-2 text-ink-soft">{active ? active.blurb : "Everything we make, in one place."}</p>
        </div>
        <nav aria-label="Sort products" className="flex flex-wrap gap-2 text-sm">
          {sorts.map((s) => (
            <Link
              key={s.value}
              href={hrefFor(active?.slug, s.value)}
              aria-current={sort === s.value ? "true" : undefined}
              className={`inline-flex min-h-11 items-center rounded-full px-4 ${sort === s.value ? "bg-ink text-cream" : "border border-line bg-white hover:border-ink"}`}
            >
              {s.label}
            </Link>
          ))}
        </nav>
      </div>

      <nav aria-label="Filter by concern" className="mt-6 flex flex-wrap gap-2">
        <Link
          href={hrefFor(undefined, sort)}
          aria-current={!active ? "page" : undefined}
          className={`inline-flex min-h-11 items-center rounded-full px-4 text-sm font-semibold ${!active ? "bg-plum text-cream" : "bg-cream-deep hover:bg-line"}`}
        >
          All
        </Link>
        {concerns.map((c) => (
          <Link
            key={c.slug}
            href={hrefFor(c.slug, sort)}
            aria-current={active?.slug === c.slug ? "page" : undefined}
            className={`inline-flex min-h-11 items-center rounded-full px-4 text-sm font-semibold ${active?.slug === c.slug ? "bg-plum text-cream" : "bg-cream-deep hover:bg-line"}`}
          >
            {c.name}
          </Link>
        ))}
      </nav>

      <p className="mt-6 text-sm text-ink-soft" aria-live="polite">
        {list.length} {list.length === 1 ? "product" : "products"}
      </p>
      {list.length === 0 ? (
        <p className="py-20 text-center text-ink-soft">Nothing here yet. Try another concern.</p>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4 lg:gap-x-6">
          {list.map((p) => (
            <ProductCard key={p.id} product={p} concerns={concerns} />
          ))}
        </div>
      )}
    </>
  );
}

function ResultsSkeleton() {
  return (
    <div aria-hidden="true">
      <div className="h-16 w-64 rounded-xl bg-cream-deep" />
      <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} className="aspect-[4/5] rounded-3xl bg-cream-deep" />
        ))}
      </div>
    </div>
  );
}

export default function ShopPage(props: PageProps<"/shop">) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <Suspense fallback={<ResultsSkeleton />}>
        <Results searchParams={props.searchParams} />
      </Suspense>
    </div>
  );
}
