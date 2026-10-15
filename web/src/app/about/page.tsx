import type { Metadata } from "next";
import Link from "next/link";
import { ProductArt } from "@/components/ProductArt";
import { getCatalog } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Our story",
  description: "Why Dewlune exists, what we believe in, and how this store was built.",
};

const values = [
  { title: "Gentle first", text: "Effective ingredients at levels your skin can live with every day, without the sting." },
  { title: "Made for our weather", text: "Light textures for humid summers, richer care for dry winters, and an SPF that disappears on every skin tone." },
  { title: "Honest pricing", text: "Clear prices, free delivery over a fair threshold, and cash on delivery so you can pay when it arrives." },
];

const stack = ["Next.js 16", "React 19", "TypeScript", "Tailwind CSS", "Plasma UI", "WooCommerce Store API", "WordPress", "PHP", "Docker"];

export default async function AboutPage() {
  const { products } = await getCatalog();
  const trio = ["dewdrop-hyaluronic-serum", "cloudsoft-ceramide-moisturizer", "halo-sunscreen-spf-50"]
    .map((slug) => products.find((p) => p.slug === slug))
    .filter((p) => p !== undefined);

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <div className="grid items-center gap-10 lg:grid-cols-2">
        <div>
          <p className="text-sm font-semibold tracking-[0.2em] text-plum uppercase">Our story</p>
          <h1 className="mt-2 font-display text-5xl leading-tight sm:text-6xl">Skincare for the way we actually live.</h1>
          <p className="mt-5 text-lg text-ink-soft">
            Dewlune started with a simple frustration: most skincare is made for weather we don&apos;t have. Heavy creams pill in July, and light gels
            vanish by December. So we built a small, focused range that works through every season here, from a gentle cleanser to a sunscreen
            you&apos;ll actually wear.
          </p>
        </div>
        <div className="flex items-end justify-center gap-2 rounded-[2rem] bg-cream-deep p-8">
          {trio.map((p, i) => (
            <ProductArt key={p.slug} art={p.art} uid={`${p.slug}-about`} title={p.name} className={i === 1 ? "h-64 w-48" : "h-48 w-36"} />
          ))}
        </div>
      </div>

      <section aria-labelledby="values-title" className="mt-20">
        <h2 id="values-title" className="font-display text-4xl">
          What we believe
        </h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {values.map((v) => (
            <div key={v.title} className="rounded-3xl border border-line bg-white p-6">
              <h3 className="font-display text-3xl">{v.title}</h3>
              <p className="mt-2 text-ink-soft">{v.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="project-title" className="on-dark mt-20 rounded-[2rem] bg-plum-deep p-8 text-cream sm:p-12">
        <p className="text-sm font-semibold tracking-[0.2em] text-moon uppercase">About this project</p>
        <h2 id="project-title" className="mt-2 font-display text-4xl sm:text-5xl">
          A real store, for a fictional brand.
        </h2>
        <p className="mt-4 max-w-3xl text-cream/80">
          Dewlune is a portfolio project by Muneeb Ud Din. The storefront is built with Next.js, and the catalog, cart and cash-on-delivery checkout
          run on WordPress and WooCommerce through the Store API. The liquid panels in the hero and footer are rendered in WebGL with Plasma UI.
        </p>
        <ul className="mt-6 flex flex-wrap gap-2">
          {stack.map((s) => (
            <li key={s} className="rounded-full border border-cream/25 px-3 py-1 text-sm">
              {s}
            </li>
          ))}
        </ul>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href="https://github.com/muneebuddinzamir-bit/dewlune" className="rounded-full bg-cream px-6 py-3 font-semibold text-ink hover:bg-moon">
            View the code
          </a>
          <a href="https://muneebuddinzamir-bit.github.io" className="rounded-full border border-cream/50 px-6 py-3 font-semibold hover:bg-cream/10">
            More of my work
          </a>
        </div>
      </section>

      <div className="mt-14 text-center">
        <Link href="/shop" className="inline-block rounded-full bg-ink px-7 py-3.5 font-semibold text-cream hover:bg-plum">
          Shop the range
        </Link>
      </div>
    </div>
  );
}
