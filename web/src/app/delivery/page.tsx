import type { Metadata } from "next";
import Link from "next/link";
import { FREE_SHIPPING_FROM, SHIPPING_FLAT } from "@/lib/cart";
import { formatPrice } from "@/lib/money";

export const metadata: Metadata = {
  title: "Delivery & returns",
  description: "Delivery rates, timelines, cash on delivery and returns at Dewlune.",
};

const facts = [
  {
    title: "Delivery rates",
    body: `Standard delivery is ${formatPrice(SHIPPING_FLAT)}. Orders over ${formatPrice(FREE_SHIPPING_FROM)} ship free, and the bag shows how close you are.`,
  },
  {
    title: "Delivery times",
    body: "Orders ship in 2-4 working days. Major cities usually arrive sooner; remote areas can take a little longer.",
  },
  {
    id: "cod",
    title: "Cash on delivery",
    body: "Pay the rider in cash when your order arrives. There is no extra fee for cash on delivery.",
  },
  {
    title: "Returns",
    body: "Changed your mind? Unopened products can be returned within 7 days of delivery for a full refund.",
  },
];

const faq = [
  {
    q: "Do you deliver everywhere in Pakistan?",
    a: "Yes. We ship to every city our courier partners serve, with the same rates nationwide.",
  },
  {
    q: "Can I pay by card?",
    a: "Not yet. For now every order is cash on delivery, so you only pay when the parcel is in your hands.",
  },
  {
    q: "How will I know when my order ships?",
    a: "You will get an SMS with your tracking number on the day your order leaves our warehouse.",
  },
  {
    q: "Which products suit sensitive skin?",
    a: "Start with the Moonmilk Cleanser and Cloudsoft Ceramide Cream, and patch test any new product on your inner arm for a day first.",
  },
];

export default function DeliveryPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
      <p className="text-sm font-semibold tracking-[0.2em] text-plum uppercase">Help</p>
      <h1 className="mt-2 font-display text-5xl sm:text-6xl">Delivery &amp; returns</h1>
      <p className="mt-4 max-w-2xl text-lg text-ink-soft">Everything you need to know before you order, in one place.</p>

      <div className="mt-12 grid gap-4 sm:grid-cols-2">
        {facts.map((f) => (
          <section key={f.title} id={f.id} className="scroll-mt-24 rounded-3xl border border-line bg-white p-6">
            <h2 className="font-display text-3xl">{f.title}</h2>
            <p className="mt-2 text-ink-soft">{f.body}</p>
          </section>
        ))}
      </div>

      <section id="faq" aria-labelledby="faq-title" className="mt-16 scroll-mt-24">
        <h2 id="faq-title" className="font-display text-4xl">
          Questions
        </h2>
        <div className="mt-6 divide-y divide-line border-y border-line">
          {faq.map((item) => (
            <details key={item.q} className="group py-5">
              <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 font-semibold">
                {item.q}
                <span className="text-xl transition group-open:rotate-45" aria-hidden="true">
                  +
                </span>
              </summary>
              <p className="mt-3 text-ink-soft">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      <div className="mt-14 flex flex-wrap items-center justify-between gap-4 rounded-3xl bg-cream-deep p-6">
        <p className="font-semibold">Ready to find your routine?</p>
        <Link href="/shop" className="rounded-full bg-ink px-6 py-3 font-semibold text-cream hover:bg-plum">
          Shop all products
        </Link>
      </div>
      <p className="mt-6 text-sm text-ink-soft">Dewlune is a fictional brand; these policies are part of a portfolio demo.</p>
    </div>
  );
}
