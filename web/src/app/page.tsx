import Link from "next/link";
import { Hero } from "@/components/home/Hero";
import { ProductArt } from "@/components/ProductArt";
import { ProductCard } from "@/components/ProductCard";
import { FREE_SHIPPING_FROM } from "@/lib/cart";
import { getCatalog } from "@/lib/catalog";
import { formatPrice } from "@/lib/money";

const ritual = [
  { step: "01", title: "Cleanse", text: "Wash away sunscreen and city dust without stripping your skin.", slug: "moonmilk-gentle-cleanser" },
  { step: "02", title: "Treat", text: "Pick one serum for what your skin needs most right now.", slug: "dewdrop-hyaluronic-serum" },
  { step: "03", title: "Protect", text: "Finish every morning with SPF. Reapply when you're outdoors.", slug: "halo-sunscreen-spf-50" },
];

export default async function Home() {
  const { products, concerns } = await getCatalog();
  const featured = products.find((p) => p.slug === "dewdrop-hyaluronic-serum") ?? products[0];
  const bestsellers = products.slice(0, 4);

  return (
    <>
      <Hero
        featured={{
          id: featured.id,
          slug: featured.slug,
          name: featured.name,
          price: featured.price,
          size: featured.size,
          image: featured.image,
          art: featured.art,
          tagline: featured.tagline,
        }}
        concerns={concerns.slice(0, 3).map(({ slug, name }) => ({ slug, name }))}
      />

      {/* Everything below the hero is opaque: the liquid renderer paints behind the whole viewport. */}
      <div className="bg-cream">
        <ul className="mx-auto grid max-w-6xl gap-px overflow-hidden border-b border-line px-4 text-sm sm:grid-cols-3 sm:px-6">
          {[
            `Free delivery over ${formatPrice(FREE_SHIPPING_FROM)}`,
            "Cash on delivery nationwide",
            "Light textures for humid weather",
          ].map((t) => (
            <li key={t} className="py-4 text-center font-medium text-ink-soft">
              {t}
            </li>
          ))}
        </ul>

        <section id="concerns" aria-labelledby="concerns-title" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-20 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold tracking-[0.2em] text-plum uppercase">Shop by concern</p>
              <h2 id="concerns-title" className="mt-2 font-display text-5xl">
                What does your skin need?
              </h2>
            </div>
            <Link href="/shop" className="inline-flex min-h-11 items-center font-semibold underline underline-offset-4">
              See every product
            </Link>
          </div>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {concerns.map((c) => {
              const count = products.filter((p) => p.concerns.includes(c.slug)).length;
              return (
                <li key={c.slug}>
                  <Link
                    href={`/shop?concern=${c.slug}`}
                    className="flex h-full flex-col justify-between gap-6 rounded-3xl border border-line bg-white p-6 transition hover:-translate-y-1 hover:border-plum"
                  >
                    <div>
                      <p className="font-display text-3xl">{c.name}</p>
                      <p className="mt-2 text-sm text-ink-soft">{c.blurb}</p>
                    </div>
                    <p className="text-sm font-semibold text-plum">
                      {count} {count === 1 ? "product" : "products"} →
                    </p>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>

        <section aria-labelledby="best-title" className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
          <h2 id="best-title" className="font-display text-5xl">
            Bestsellers
          </h2>
          <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4 lg:gap-x-6">
            {bestsellers.map((p) => (
              <ProductCard key={p.id} product={p} concerns={concerns} />
            ))}
          </div>
        </section>

        <section id="ritual" aria-labelledby="ritual-title" className="scroll-mt-20 bg-cream-deep">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
            <p className="text-sm font-semibold tracking-[0.2em] text-plum uppercase">The Dewlune ritual</p>
            <h2 id="ritual-title" className="mt-2 max-w-xl font-display text-5xl">
              Three steps. That&apos;s really all it takes.
            </h2>
            <ol className="mt-12 grid gap-6 md:grid-cols-3">
              {ritual.map((r) => {
                const p = products.find((x) => x.slug === r.slug);
                return (
                  <li key={r.step} className="flex flex-col rounded-3xl bg-cream p-6">
                    <div className="flex items-center justify-between">
                      <span className="font-display text-5xl text-plum">{r.step}</span>
                      {p && <ProductArt art={p.art} uid={`${p.slug}-ritual`} className="h-28 w-24" title={p.name} />}
                    </div>
                    <h3 className="mt-4 font-display text-3xl">{r.title}</h3>
                    <p className="mt-2 text-ink-soft">{r.text}</p>
                    {p && (
                      <Link href={`/products/${p.slug}`} className="mt-auto pt-6 font-semibold underline underline-offset-4">
                        {p.name}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ol>
          </div>
        </section>
      </div>
    </>
  );
}
